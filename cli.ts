#!/usr/bin/env bun

import { parseArgs } from 'util';
import { SpaResolver } from "./spa-resolver";

const { values } = parseArgs({
  args: Bun.argv,
  strict: true,
  allowPositionals: true,
  options: {
    uri: {
      type: "string",
    },
  },
});

if (!values.uri) {
  throw new Error("Missing required argument: --uri");
}

const result = await new SpaResolver().resolve(values.uri)

console.log([...result.values()].map((contents) => `\n\n// ====================== ${contents.uri} \n\n${contents.content}`).join('\n'));
