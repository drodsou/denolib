# DENO LIB

in `/ts` and some derived in `/esm` if they don't depend on Deno api

## snippets

```js
let __dirname = import.meta.url.split('/').slice(3,-1).join('/');
```