# About

I ran into a confusing issue where Node was erroring because it couldn't import a named export.

This repro demos the error message and my workaround.

## Requirements

I ran this with Node@15.10.0 and npm@7.5.6.

## Getting started

- Run `npm install`
- Run `node index.js`
- See outputted error message:

```
import { Env } from "@humanwhocodes/env";
         ^^^
SyntaxError: Named export 'Env' not found. The requested module '@humanwhocodes/env' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@humanwhocodes/env';
const { Env } = pkg;
```

- Run `npm run patch`
- Run `node index.js` again
- See new output `my test value`

## Why?

The imported module has common js and esm versions available. In the `package.json` it has the following configuration:

```
  "main": "dist/env.cjs.js",
  "module": "dist/env.js",
  "types": "dist/env.d.ts",
  "exports": {
    ".": {
      "require": "./dist/env.cjs.js",
      "import": "./dist/env.js"
    }
  },
```

We are `import`ing the module, Node uses the `exports` field from the module's `package.json`

Node correctly resolves `import { Env } from "@humanwhocodes/env";` to the file `node_modules/@humanwhocodes/env/dist/env.js`.

The file is written as an ESM file, here's the last line:  `export { Env };`.  

However, Node seems to treat the file as CommonJS file and therefore fails to find the named exports in the file.

My workaround is to use `patch-package` to change the file extension to `.mjs`, and then update its `package.json` to reference the renamed file:

```diff
  "exports": {
    ".": {
      "require": "./dist/env.cjs.js",
-      "import": "./dist/env.js"
+      "import": "./dist/env.mjs"
    }
  },
```

You can see the patch changes in the `patches` directory of this repo.