#!/bin/bash
deno run -A --unstable ts/deno2esm/mod.ts ts/slash_join esm/slash_join
deno test esm/slash_join/mod_test.js
