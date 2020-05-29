# unzip_remote

copies remote (or local) zip contents in your folder.

optionally: copy only a subfolder from the zip

## why?

usefull for initializing project scaffolds from github repos

## install
```
deno install -A https://raw.githubusercontent.com/drodsou/denolib/v1.0.0/ts/unzip_remote/unzip_remote.ts
```

NOTE: check last release version

## usage

```unzip_remote --help```

```unzip_remote zipUrl destDir [zipSubdir]```


## example 

from some folder, do:

```
unzip_remote https://github.com/drodsou/mdbookgen/archive/master.zip myfolder mdbookgen-master/example-book
```