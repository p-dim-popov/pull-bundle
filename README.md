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
./cli.ts --uri 'https://example.com'
```

where `https://example.com` is the target SPA

You can also save the output to a file:

```bash
./cli.ts --uri 'https://example.com' > output.js
```

This project was created using `bun init` in bun v1.1.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
