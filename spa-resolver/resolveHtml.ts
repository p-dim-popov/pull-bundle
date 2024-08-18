import type { JsScript, JsSource } from "./types";
import path from "path";

export type ResolvedJsOrSource = JsScript | JsSource;

/**
 * @description Resolves HTML to array of scripts contents or scripts sources.
 * Example:
 * ```html
 * <script src="https://cdn.com/script.js"></script>
 * <script>
 *   console.log("Hello, world!");
 * </script>
 * <script>
 * </script>
 * ```
 * Will resolve to:
 * ```js
 * [
 *   { src: "https://cdn.com/script.js" },
 *   'console.log("Hello, world!");'
 * ]
 * ```
 */
export const resolveHtml = (
  html: string,
  uri: string,
): ResolvedJsOrSource[] => {
  const rewriter = new HTMLRewriter();

  const contentsAndSources: ResolvedJsOrSource[] = [];
  rewriter
    .on("script", {
      element: (element: HTMLRewriterTypes.Element): void | Promise<void> => {
        const src = element.getAttribute("src");
        if (src) {
          contentsAndSources.push({ uri: src.match(/^https?:\/\/.+/i) ? src : path.join(uri, src) });
        }
      },
      text({ text }) {
        if (text.trim().length > 0) {
          contentsAndSources.push({
            uri: uri + `#root-${contentsAndSources.length}`,
            content: text,
          });
        }
      },
    })
    .transform(html);

  return contentsAndSources;
};
