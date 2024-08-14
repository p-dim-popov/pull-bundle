#!/usr/bin/env bun

import { parseArgs } from "util";
import { main } from './main';

const { values } = parseArgs({
  args: Bun.argv,
  strict: true,
  allowPositionals: true,
  options: {
    entrypoint: {
      type: "string",
    },
  },
});

if (!values.entrypoint) {
  throw new Error("Missing required argument: --entrypoint");
}

const result = await main(values.entrypoint)

console.log([...result.resolvedSources.entries()].map(([src, contents]) => `\n\n// ====================== ${src} \n\n${contents}`).join('\n'));
