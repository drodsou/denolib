/**
 * given text string, returns estimated time to read it {h,m,s,min} 
 * where 'min' is aprox rounded minutes
*/
export function timeToRead (text:string, wordsPerMinute=180) {
  let wordsPerSecond = wordsPerMinute / 60; 
  let seconds = text.split(' ').length / wordsPerSecond;
  let hhmmss = new Date(seconds * 1000).toISOString().substr(11, 8).split(':');
  return {
    h: parseInt(hhmmss[0]),
    m: parseInt(hhmmss[1]),
    s: parseInt(hhmmss[2]),
    min : Math.ceil(seconds/60)
  }
}

