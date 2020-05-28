export type CurlyTransformed = {
  text: string,
  attachments?: {
    relFile: string,
    absFile: string
  }[]
}

export type CurlyVar = {
  text: string,
  type:string, 
  content:string 
}