import path from "path";
import { simplyCached } from "./simplyCached";
import createDebug from 'debug'

const debug = createDebug("resolveContent");

export type ResolvedContents = string[];

export const resolveContent = async (
  content: string,
  perspective: string,
  // FIXME: don't like passing a map around
  previouslyResolved: Map<SourceUri, ResolvedContents>
): Promise<ResolvedContents> => {
  const importsSources = extractImportsSourcesFromContent(content);

  const resolvedContents: string[] = [];
  for (const source of importsSources) {
    const currentContents = await resolveSource(source, perspective, previouslyResolved);
    resolvedContents.push(...currentContents);
  }

  return [content, ...resolvedContents];
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

export const resolveSource = async (source: string, perspective: string, previouslyResolved: Map<SourceUri, ResolvedContents>) => {
  const uri = path.join(perspective, source).replace(/^http(s?):\/\/?/i, (match: string, ssl: string) => `http${ssl}://`);
  if (previouslyResolved.has(uri)) {
    return []
  }

  const sourcePerspective = path.dirname(uri);
  const content = await fetchSource(uri);
  const resolvedContents = await resolveContent(content, sourcePerspective, previouslyResolved);

  previouslyResolved.set(uri, resolvedContents);

  return resolvedContents
}

export type SourceUri = string;

const fetchSource = simplyCached(
  async (uri: SourceUri) => {
    debug(`Fetch source: ${uri}`);
    const res = await fetch(uri);

    if (!res.ok) {
      throw new Error(`Failed to fetch source: ${uri}`);
    }

    const content =  await res.text();

    return content;
  },
);
