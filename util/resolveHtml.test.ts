import { expect, test } from "bun:test";
import { resolveHtml } from "./resolveHtml";

test("extracts js scripts or sources from html", () => {
  const html = `
    <body>
      Hello, world!
      <p>Some text</p>
      <script src="https://cdn.com/script.js"></script>
    </body>
    <script>
      console.log("Hello, world!");
    </script>
    <script>
    </script>
`;
  const contentsAndSources = resolveHtml(html);

  expect(contentsAndSources).toEqual([
    { src: "https://cdn.com/script.js" },
    '\n      console.log(\"Hello, world!\");\n    ',
  ]);
});
