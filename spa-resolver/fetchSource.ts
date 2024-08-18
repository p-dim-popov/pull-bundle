import type { JsSource } from "./types";
import createDebug from "debug";
import { simplyCached } from "./simplyCached";

const debug = createDebug("fetchSource");

export const fetchSource = simplyCached(async (source: JsSource) => {
  debug(`Fetch source: ${source.uri}`);
  const res = await fetch(source.uri);

  if (!res.ok) {
    throw new Error(`Failed to fetch source: ${source.uri}`);
  }

  const content = await res.text();

  return content;
});
