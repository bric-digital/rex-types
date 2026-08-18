import { Temporal, toTemporalInstant } from '@js-temporal/polyfill'

declare global {
  interface Date {
    toTemporalInstant(): Temporal.Instant;
  }
}

Date.prototype.toTemporalInstant = toTemporalInstant;

import check from 'check-types'

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
  value:Temporal.Instant|null = null
  originalValue:string = ''

  constructor(value:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (check.number(value)) {
      // ChatGPT (and others) emit epoch-seconds as floats with sub-millisecond
      // precision (e.g. 1777570208.089697). fromEpochMilliseconds requires an
      // integer, so route through nanoseconds to preserve microsecond precision.
      const nanos = BigInt(Math.round(value * 1e9))
      this.value = Temporal.Instant.fromEpochNanoseconds(nanos)
      this.originalValue = `number:${value}`
    } else if (check.date(value)) {
      const legacyDate = (value as Date)

      this.value = legacyDate.toTemporalInstant()
      this.originalValue = `date:${value}`
    } else {
      try {
        this.value = Temporal.Instant.from(value)
        this.originalValue = `other:${value}`
      } catch {
        console.log(`[rex-types / DateString] Unable to parse ${value} of type "${typeof value}".`)
        this.originalValue = `${value}`
        this.value = null
      }
    }
  }

  toJSON() {
    if (this.value !== null) {
      return this.value.toString()
    }

    return this.originalValue
  }

  timestamp(): number {
    if (this.value === null) {
      throw new Error('Cannot convert a null Temporal.Instant to a timestamp.');
    }

    return this.value.epochMilliseconds
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
  engine?:string,
  metadata?:any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface StockTicker {
  symbol:string,
  name?:string,
  price:string,
  change:string,
  changePercent:string,
  direction:'up' | 'down',
  lastUpdated?:string,
  url?:string,
  topics?: string[], // open/customizable — use for categories, tags, or any classification
  metadata?:any, // eslint-disable-line @typescript-eslint/no-explicit-any
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
  started?:DateString,
  ended?:DateString,
  metadata?:any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Internal coordination record published by rex-page-events whenever a URL becomes
 * active in a tab (tab_open or tab_url_change). Sibling modules (notably rex-history)
 * subscribe to these via `globalThis.__rexPageEventsUrlActive.subscribe` to link
 * their own records with tab/session identity.
 *
 * This record carries a raw URL by design (rex-history needs it to match before its
 * own redaction pass). In default mode it never leaves the extension — it's delivered
 * only to the in-process subscriber list. With `page_events.debug: true` it is also
 * dispatched via rex-core's event bus for debugging visibility.
 */
export interface RexPageUrlActiveEvent {
  name: 'rex-page-url-active',
  tab_id: number,
  window_id: number,
  session_id: string,
  url: string,
  url_shown_at: number,
}

export class REXStackOperator<T> {
  private stack:T[] = []

  push(...elements:T[]) {
    this.stack.push(...elements)
  }

  run(operation:(item:T) => Promise<void>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const processNext = () => {
        if (this.stack.length === 0) {
          resolve()
        } else {
          const item:T|undefined = this.stack.pop()

          if (item !== undefined) {
            try {
              operation(item)
                .then(() => {
                  processNext()
                })
                .catch((err) => {
                  reject(err)
                })
            } catch (err) {
              reject(err)
            }
          } else {
            processNext()
          }
        }
      }

      processNext()
    })
  }
}