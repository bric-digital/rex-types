export interface Position {
  top:number,
  left:number,
  width:number,
  height:number,
}

export interface Citation {
  source:string,
  title:string,
  url?:string,
}

export interface AISummary {
  'query*':string,
  'content*':string,
  platform:string,
  citations?:Citation[],
  'metadata*'?:any,
}

export class DateString {
  value:string

  constructor(value) {
    this.value = value
  }
}

export interface NewsBlurb {
  headline:string,
  posted:DateString,
  source:string,
  authors:string[],
  summary?:string,
  url?:string,
  citations?: Citation[],
  position?:Position,
}

export interface Result {
  title:string,
  link:string,
  preview:string,
  index:number,
}

export interface Search {
  platform:string,
  'query*':string,
  type:string,
  result:Result[],
  news?:NewsBlurb[],
  aiSummaries?:AISummary[],
}

export interface Turn {
  speaker:string,
  when:DateString,
  'content*':string,
  identifier?:string,
  search?:Search,
  'metadata*'?:any,
  citations?: Citation[]
}

export interface Conversation {
  turns:Turn[],
  platform:string,
  identifier:string,
  started:DateString,
  ended?:DateString,
  metadata?:any,
}
