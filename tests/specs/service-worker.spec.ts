// @ts-nocheck

import { test, expect } from './fixtures.js';

import { DateString } from '../../src/types.mjs';

test('Service worker test: DateString', async ({serviceWorker}) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      return new Promise<any>((testResolve) => {
        serviceWorker.evaluate(async () => {
          return new Promise<any>((testResolve) => {
            const dates = {
              'date': new DateString(new Date(1777529052000)),
              'number': new DateString(1777529052.500),
              'string': new DateString('2024-03-10T03:00:00-04:00'),
              '10_hours_ago': new DateString(' 10 hours ago'),
              '10_days_ago': new DateString(' 10 days ago'),
              '1_hour_ago': new DateString(' 1 hour ago'),
              'seconds': new DateString('1749656945'),
              'unparseable': new DateString('Pizza Hut')
            }

            testResolve(JSON.parse(JSON.stringify(dates)))
          })
        })
        .then((workerResponse) => {
          expect(workerResponse).toEqual({
            'date': '2026-04-30T06:04:12.000Z', 
            'number': '2026-04-30T06:04:12.5Z', 
            'string': '2024-03-10T07:00:00Z',
            'seconds': '2024-03-10T07:00:00Z',
            'unparseable': 'foo bar',
          })

          resolve()
        })
      })
    }, 2500)
  })
})
