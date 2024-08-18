import type { JsScript, JsScriptMap } from "./types";
import { $ } from "bun";
import { resolveHtml } from "./resolveHtml";
import { fetchSource } from "./fetchSource";
import { inspectScript } from "./inspectScript.ts";

export class SpaResolver {
  // private members instead of mutable params?

  async resolve(uri: string) {
    const html = await $`curl ${uri}`.text();

    const contentsAndSources = resolveHtml(html, uri);

    const scriptMap: JsScriptMap = new Map();

    for (const contentOrSource of contentsAndSources) {
      const content: JsScript =
        "content" in contentOrSource
          ? contentOrSource
          : {
              uri: contentOrSource.uri,
              content: await fetchSource(contentOrSource),
            };

      await inspectScript(content, scriptMap);
    }

    return scriptMap;
  }
}
