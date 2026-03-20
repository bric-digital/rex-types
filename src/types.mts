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
  'metadata*'?:any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

export class DateString {
  value:string

  constructor(value:string) {
    this.value = value
  }

  getAttr() {
    return this.value;
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

export interface NewsArticle {
  url: string,
  headline: string,
  posted:DateString,
  authors:string[],
  content:string,
  summary?:string,   // summary, excerpt, or subheadline
  citations?: Citation[],
  topics?: string[], // open/customizable — use for categories, tags, or any classification
}

export interface Result {
  title:string,
  url:string,
  preview:string,
  index:number,
  metadata?:any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Search {
  platform:string,
  'query*':string,
  type:string,
  results:Result[],
  news?:NewsBlurb[],
  aiSummaries?:AISummary[],
}

export interface Turn {
  speaker:string,
  when:DateString,
  'content*':string,
  identifier?:string,
  search?:Search,
  'metadata*'?:any, // eslint-disable-line @typescript-eslint/no-explicit-any
  citations?: Citation[],
  parent?:string,
}

export interface Conversation {
  turns:Turn[],
  platform:string,
  identifier:string,
  started:DateString,
  ended?:DateString,
  metadata?:any, // eslint-disable-line @typescript-eslint/no-explicit-any
}
