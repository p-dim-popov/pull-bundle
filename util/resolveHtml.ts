export type ContentOrSource = string | { src: string };

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
export const resolveHtml = (html: string): ContentOrSource[] => {
  const rewriter = new HTMLRewriter();

  const contentsAndSources: ContentOrSource[] = [];
  rewriter
    .on("script", {
      element: (element: HTMLRewriterTypes.Element): void | Promise<void> => {
        const src = element.getAttribute("src");
        if (src) {
          contentsAndSources.push({ src });
        }
      },
      text({ text }) {
        if (text.trim().length > 0) {
          contentsAndSources.push(text);
        }
      },
    })
    .transform(html);

  return contentsAndSources;
};
