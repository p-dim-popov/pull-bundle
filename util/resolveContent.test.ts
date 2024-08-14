import { expect, test, describe, type Mock, afterEach, spyOn } from "bun:test";
import { resolveSource } from "./resolveContent";
import * as fetchMock from "bun-bagel";

afterEach(() => {
  fetchMock.clearMocks();
});

describe("resolveContent", () => {
  test("fetches uri", async () => {
    fetchMock.mock("https://example.com/assets/main.ts", {
      data: 'console.log("hello world");\n',
    });

    const result = await resolveSource(
      "/assets/main.ts",
      "https://example.com",
      new Map(),
    );

    expect(result).toEqual(['console.log("hello world");\n']);
  });

  // FIXME: library can't mock fetch errors
  test.skip("throws on http error", async () => {
    fetchMock.mock("https://example.com/assets/main.ts");

    const act = async () =>
      resolveSource("/assets/main.ts", "https://example.com", new Map());

    expect(act).toThrow(
      "Failed to fetch source: https://example.com/assets/main.ts",
    );
  });

  test("does not resolve already resolved sources", async () => {
    const result = await resolveSource(
      "/assets/main.ts",
      "https://example.com",
      new Map([
        ["https://example.com/assets/main.ts", ["console.log('hello world');"]],
      ]),
    );

    expect(result).toEqual([]);
  });
});
