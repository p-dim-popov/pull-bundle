import { $ } from "bun";
import {
  resolveHtml,
  type ContentOrSource,
  resolveContent,
  type ResolvedContents,
  type SourceUri,
  resolveSource,
} from "./util";

export async function main(entrypoint: string) {
  const html = await $`curl ${entrypoint}`.text();

  const contentsAndSources = resolveHtml(html);

  const resolvedSources = new Map<SourceUri, ResolvedContents>();

  const resolvedContents = await resolveContentsAndSources(
    contentsAndSources,
    entrypoint,
    resolvedSources,
  );

  return { resolvedContents, resolvedSources };
}

const resolveContentsAndSources = async (
  contentsAndSources: ContentOrSource[],
  entrypoint: string,
  previouslyResolved: Map<SourceUri, ResolvedContents>,
) => {
  const contents: string[] = [];
  for (const contentOrSource of contentsAndSources) {
    const resolvedContents = await resolveContentOrSource(contentOrSource, entrypoint, previouslyResolved);

    contents.push(...resolvedContents);
  }
  return contents;
};

const resolveContentOrSource = async (
  contentOrSource: ContentOrSource,
  entrypoint: string,
  previouslyResolved: Map<SourceUri, ResolvedContents>,
) => {
  if (typeof contentOrSource === "string") {
    const resolvedContents = await resolveContent(contentOrSource, entrypoint, previouslyResolved);

    return resolvedContents;
  }

  return resolveSource(contentOrSource.src, entrypoint, previouslyResolved)
};
