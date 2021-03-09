  import {slashJoin} from '../slash_join/mod.ts';

  /** Deno.watch but throttled and grouping events in watched dirs */
  export async function watch ( {dirs, fn, exclude=[], options={}}
    : {dirs:string[], fn:(event:Object)=>void, exclude?:string[], options?:any}
  ) {
    // -- default options
    options.throttle = options.throttle || 500;   // ms to wait
    options.slash = options.slash || true;        // convert path to / even in windows
    
    // -- returned object with affected dirs as keys, and array of paths as values
    // let eventDirs: {[key:string]:Array<Object>} = {};
    let eventDirs: {[key:string]:string} = {};

    // -- common settimeout ref
    let timer: number | undefined;    

    // -- watch
    const watcher = Deno.watchFs(dirs);
    for await (const event of watcher) {
      // { kind: "create", paths: [ "/foo.txt" ] }
      
      let excludedOnly = true;
      // -- add affected watched dirs to eventDirs list
      for (let eventPath of event.paths) { 
        if (exclude.some(ex=>slashJoin(eventPath).includes(ex))) { 
          //console.log('excluded', slashJoin(eventPath));
          continue;
        }
        excludedOnly = false;
        for (let dir of dirs) {
          if (slashJoin(eventPath).includes(slashJoin(dir))) {

            // -- optionally convert \ to /
            let dirKey = options.slash ? slashJoin(dir) : dir;
            if (options.slash) {
              event.paths = event.paths.map(p=>slashJoin(p));
            }

            event.paths.forEach(path=>{
              if (!eventDirs[path]) {eventDirs[path] = event.kind }  
            })
            // eventDirs[dir].push(event);
          }
        }
      }

      // -- lauch callback function inf x ms if no other event happens before
      
      if (timer) { clearTimeout(timer); }
      if (!excludedOnly) {
        timer = setTimeout(()=>{
          const eventDirsArr: {path:string, kind:string}[] = [];
          Object.keys(eventDirs).forEach(path=>{
            // kind: modify, remove, create...
            eventDirsArr.push({path, kind: eventDirs[path]}) 
          });
          fn(eventDirsArr);
          eventDirs = {};
        }, options.throttle);
      }
    }

  };

  // -- example
  // console.log('watching...');
  // watch({dirs:['src', 'lib'], fn: (dirs)=>{
  //   console.log(Object.keys(dirs));
  // } });