import { beforeEach, expect, type Mock, spyOn, test } from "bun:test";
import { inspectScript } from "./inspectScript.ts";
import type { JsScript } from "./types.ts";

let fetchMock: Mock<typeof fetch>;

beforeEach(() => {
  fetchMock = spyOn(globalThis, "fetch");
});

test("fetches uri", async () => {
  const mainScript: JsScript = {
    uri: "https://example.com/assets/main.ts",
    content: 'import { start } from "./start.ts";',
  };
  const startScript: JsScript = {
    uri: "https://example.com/assets/start.ts",
    content: 'console.log("hello world");',
  };

  fetchMock.mockResolvedValueOnce(new Response(startScript.content));

  const scriptMap = await inspectScript(mainScript);

  expect([...scriptMap.values()]).toEqual([
    { ...mainScript, status: "inspected" },
    { ...startScript, status: "inspected" },
  ]);
});

test("throws on http error", async () => {
  const mainScript: JsScript = {
    uri: "https://example.com/assets/main.ts",
    content: "import { all } from 'second.ts';",
  };
  fetchMock.mockResolvedValueOnce(new Response("broken", { status: 400 }));

  const act = async () => inspectScript(mainScript);

  expect(act).toThrow(
    "Failed to fetch source: https://example.com/assets/second.ts",
  );
});

test("handles circular imports", async () => {
  const mainScript: JsScript = {
    uri: "https://example.com/assets/main.ts",
    content: "import * from './primary.ts';\n",
  };
  const primaryScript: JsScript = {
    uri: "https://example.com/assets/primary.ts",
    content: "import * from './secondary.ts';\n",
  };
  const secondaryScript: JsScript = {
    uri: "https://example.com/assets/secondary.ts",
    content: "import * from './primary.ts';\n",
  };

  fetchMock
    .mockResolvedValueOnce(new Response(primaryScript.content))
    .mockResolvedValueOnce(new Response(secondaryScript.content));

  const scriptMap = await inspectScript(mainScript);

  expect([...scriptMap.values()]).toEqual([
    { ...mainScript, status: "inspected" },
    { ...primaryScript, status: "inspected" },
    { ...secondaryScript, status: "inspected" },
  ]);
});
