import { fetchSource } from "./fetchSource.ts";
import type { JsScript, JsScriptMap } from "./types";
import path from "path";

export const inspectScript = async (
  script: JsScript,
  scriptMap: JsScriptMap = new Map(),
): Promise<JsScriptMap> => {
  const _script = scriptMap.get(script.uri) ?? script;
  if (_script === script) {
    scriptMap.set(script.uri, script);
  }

  if (_script.status) return scriptMap;

  _script.status = "inspecting";

  const importsSources = extractImportsSourcesFromContent(_script.content);

  for (const source of importsSources) {
    // console.log(script, source)
    const uri = path
      .join(path.dirname(_script.uri), source)
      .replace(
        /^http(s?):\/\/?/i,
        (match: string, ssl: string) => `http${ssl}://`,
      );

    const resolvedSource = await fetchSource({ uri });

    const resolvedJs: JsScript = { uri, content: resolvedSource };

    await inspectScript(resolvedJs, scriptMap);
  }

  _script.status = "inspected";

  return scriptMap;
};

const extractImportsSourcesFromContent = (content: string) => {
  const importRegex =
    /import\s+(?:[\w*\s{},]*)\s+from\s+['"]([^'"]+)['"];?|import\s*\(['"]([^'"]+)['"]\)/g;
  const imports: string[] = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const [, staticImport, dynamicImport] = match;
    if (staticImport) {
      imports.push(staticImport);
    }
    if (dynamicImport) {
      imports.push(dynamicImport);
    }
  }

  return imports;
};
