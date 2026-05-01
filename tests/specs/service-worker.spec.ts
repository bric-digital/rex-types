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
              'string': new DateString('2024-03-10T03:00:00-04:00'),
              'number': new DateString(1777529052.500),
              'date': new Date(1777529052000),
              'fractionalEpoch': new DateString(1777570208.089697),
            }

            testResolve(JSON.parse(JSON.stringify(dates)))
          })
        })
        .then((workerResponse) => {
          expect(workerResponse).toEqual({
            'date': '2026-04-30T06:04:12.000Z',
            'number': '2026-04-30T06:04:12.5Z',
            'string': '2024-03-10T07:00:00Z',
            'fractionalEpoch': '2026-04-30T17:30:08.089696768Z',
          })

          resolve()
        })
      })
    }, 2500)
  })
})
