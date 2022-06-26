import parse from '../index.js'
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.145.0/testing/asserts.ts"

Deno.test('preserves identity', () => {
  assertEquals(parse('2022-06-26T07:53:15.848Z').toISOString(), '2022-06-26T07:53:15.848Z')
})

Deno.test('defaults to given locale', () => {
  const now = new Date('2022-07-04T23:02:03.000Z')
  assertEquals(parse('2020-06-26T07:53:15.848Z', 'YYYY', { now }).toISOString(), '2020-07-04T23:02:03.000Z')
})
Deno.test('parses YYYY, MM, DD, hh, mm, sss', () => {
  const back = parse('848Z-15:53:07T11-03-2023', 'SSS-hh:mm:ss:DD:MM:YYYY')
  assertEquals(back.toISOString(), '2023-03-11T15:53:07.848Z')
})
Deno.test('parses MMM', () => {
  const back = parse('mar 1', 'MMM DD')
  assertEquals(back.getUTCMonth(), 2)
  assertEquals(back.getUTCDate(), 1)
})
Deno.test('parses YY', () => {
  const back = parse('21/03/05', 'YY/MM/DD')
  assertEquals(back.getUTCFullYear(), 2021)
})
Deno.test('parses default MM', () => {
  const now = new Date('2022-07-04T23:02:03.000Z')
  const back = parse('21', 'YY', { now })
  assertEquals(back.getMonth(), 6)
})
Deno.test('parses default DD', () => {
  const now = new Date('2022-07-04T23:02:03.000Z')
  const back = parse('21/05', 'YY/MM', { now })
  assertEquals(back.getMonth(), 4)
})
Deno.test('utc::forces utc by locale', () => {
  const back = parse('21/03/05 12', 'YY/MM/DD hh', { utc: true })
  assertEquals(back.getUTCHours(), 12)
})
Deno.test('utc::defaults YYYY', () => {
  const back = parse('03/05 12', 'MM/DD hh', { utc: true })
  assertEquals(back.getUTCFullYear(), 2022)
})
Deno.test('utc::forces utc by Z', () => {
  const back = parse('21/03/05T12Z', 'YY/MM/DD hh')
  assertEquals(back.getUTCHours(), 12)
})
Deno.test('utc::locale.utc > Z presence', () => {
  const back = parse('21/03/05Z12', 'YY/MM/DD hh', { utc: false })
  assertNotEquals(back.getUTCHours(), 12)
})
Deno.test('offsets date given GMT', () => {
  const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'MMM DD YYYY hh mm ss SSS')
  assertEquals(back.toISOString(), '2011-10-05T12:33:00.150Z')
})
Deno.test('ignore offsets if utc: false given', () => {
  const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'MMM DD YYYY hh mm ss SSS', { utc: false })
  assertEquals(back.toISOString(), '2011-10-05T14:48:00.150Z')
})
Deno.test('returns null if could not parse with format', () => {
  const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'phoque', { utc: false })
  assertEquals(back, null)
})
