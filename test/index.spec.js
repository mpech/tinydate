import { expect, it, describe } from 'vitest'
import parse from '../index.js'

describe('parse date', () => {
  it('preserves identity', () => {
    expect(parse('2022-06-26T07:53:15.848Z').toISOString()).toBe('2022-06-26T07:53:15.848Z')
  })
  it('defaults to given locale', () => {
    const now = new Date('2022-07-04T23:02:03.000Z')
    expect(parse('2020-06-26T07:53:15.848Z', 'YYYY', { now }).toISOString()).toBe('2020-07-04T23:02:03.000Z')
  })
  it('parses YYYY, MM, DD, hh, mm, sss', () => {
    const back = parse('848Z-15:53:07T11-03-2023', 'SSS-hh:mm:ss:DD:MM:YYYY')
    expect(back.toISOString()).toBe('2023-03-11T15:53:07.848Z')
  })
  it('parses MMM', () => {
    const back = parse('mar 1', 'MMM DD')
    expect(back.getUTCMonth()).toBe(2)
    expect(back.getUTCDate()).toBe(1)
  })
  it('parses YY', () => {
    const back = parse('21/03/05', 'YY/MM/DD')
    expect(back.getUTCFullYear()).toBe(2021)
  })
  it('parses default MM', () => {
    const now = new Date('2022-07-04T23:02:03.000Z')
    const back = parse('21', 'YY', { now })
    expect(back.getMonth()).toBe(6)
  })
  it('parses default DD', () => {
    const now = new Date('2022-07-04T23:02:03.000Z')
    const back = parse('21/05', 'YY/MM', { now })
    expect(back.getMonth()).toBe(4)
  })
  describe('utc', () => {
    it('forces utc by locale', () => {
      const back = parse('21/03/05 12', 'YY/MM/DD hh', { utc: true })
      expect(back.getUTCHours()).toBe(12)
    })
    it('defaults YYYY', () => {
      const back = parse('03/05 12', 'MM/DD hh', { utc: true })
      expect(back.getUTCFullYear()).toBe(2022)
    })
    it('forces utc by Z', () => {
      const back = parse('21/03/05T12Z', 'YY/MM/DD hh')
      expect(back.getUTCHours()).toBe(12)
    })
    it('locale::utc > Z presence', () => {
      const back = parse('21/03/05Z12', 'YY/MM/DD hh', { utc: false })
      expect(back.getUTCHours()).not.toBe(12)
    })
  })
  it('offsets date given GMT', () => {
    const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'MMM DD YYYY hh mm ss SSS')
    expect(back.toISOString()).toBe('2011-10-05T12:33:00.150Z')
  })
  it('ignore offsets if utc: false given', () => {
    const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'MMM DD YYYY hh mm ss SSS', { utc: false })
    expect(back.toISOString()).toBe('2011-10-05T14:48:00.150Z')
  })
  it('returns null if could not parse with format', () => {
    const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'phoque', { utc: false })
    expect(back).toBe(null)
  })
})
