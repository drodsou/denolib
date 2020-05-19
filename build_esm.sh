#!/bin/bash

function build_esm {
  deno run -A --unstable ts/deno2esm/mod.ts ts/$1 esm/$1
}

build_esm slash_join