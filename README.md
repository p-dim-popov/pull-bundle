# pull-bundle

## Description

Pulls all JS of a website.

## Usage

To install dependencies:

```bash
bun install
```

To run:

```bash
./index.ts --entrypoint https://example.com
```

where `https://example.com` is the target SPA

You can also save the output to a file:

```bash
./index.ts --entrypoint https://example.com > output.js
```

This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
