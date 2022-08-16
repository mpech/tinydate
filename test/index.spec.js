import parse from '../index.js'
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.145.0/testing/asserts.ts"
import { it } from "https://deno.land/std@0.152.0/testing/bdd.ts"

it('preserves identity', () => {
  assertEquals(parse('2022-06-26T07:53:15.848Z').toISOString(), '2022-06-26T07:53:15.848Z')
})

it('defaults to given locale', () => {
  const now = new Date('2022-07-04T23:02:03.000Z')
  console.log('FFFFFFFFFFFFFFFFFFFfbck', parse('2020-06-26T07:53:15.848Z', 'YYYY', { now }).toISOString())
  assertEquals(parse('2020-06-26T07:53:15.848Z', 'YYYY', { now }).toISOString(), '2020-07-04T23:02:03.000Z')
})
it('parses YYYY, MM, DD, hh, mm, sss', () => {
  const back = parse('848Z-15:53:07T11-03-2023', 'SSS-hh:mm:ss:DD:MM:YYYY')
  assertEquals(back.toISOString(), '2023-03-11T15:53:07.848Z')
})
it('parses MMM', () => {
  const back = parse('mar 1', 'MMM DD')
  assertEquals(back.getUTCMonth(), 2)
  assertEquals(back.getUTCDate(), 1)
})
it('parses YY', () => {
  const back = parse('21/03/05', 'YY/MM/DD')
  assertEquals(back.getUTCFullYear(), 2021)
})
it('parses default MM', () => {
  const now = new Date('2022-07-04T23:02:03.000Z')
  const back = parse('21', 'YY', { now })
  assertEquals(back.getMonth(), 6)
})
it('parses default DD', () => {
  const now = new Date('2022-07-04T23:02:03.000Z')
  const back = parse('21/05', 'YY/MM', { now })
  assertEquals(back.getMonth(), 4)
})
it('utc::forces utc by locale', () => {
  const back = parse('21/03/05 12', 'YY/MM/DD hh', { utc: true })
  assertEquals(back.getUTCHours(), 12)
})
it('utc::defaults YYYY', () => {
  const back = parse('03/05 12', 'MM/DD hh', { utc: true })
  assertEquals(back.getUTCFullYear(), 2022)
})
it('utc::forces utc by Z', () => {
  const back = parse('21/03/05T12Z', 'YY/MM/DD hh')
  assertEquals(back.getUTCHours(), 12)
})
it('utc::locale.utc < Z presence', () => {
  const back = parse('21/03/05Z12', 'YY/MM/DD hh', { utc: false })
  assertEquals(back.getUTCHours(), 12)
})
it('offsets date given GMT', () => {
  const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'MMM DD YYYY hh mm ss SSS')
  assertEquals(back.toISOString(), '2011-10-05T12:33:00.150Z')
})
it('keeps offsets if utc: false given', () => {
  const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'MMM DD YYYY hh mm ss SSS', { utc: false })
  assertEquals(back.toISOString(), '2011-10-05T12:33:00.150Z')
})
it('returns null if could not parse with format', () => {
  const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'phoque', { utc: false })
  assertEquals(back, null)
})
