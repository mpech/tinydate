const MONTHS = 'janfebmaraprmayjunjulaugsepoctnovdec'.match(/.../g)
const regs = {
  MMM: months => `(?<MMM>(${months.join`|`}))`,
  ...Object.fromEntries(['YYYY', 'YY', 'MM', 'DD', 'hh', 'mm', 'ss', 'SSS'].map(k => [k, () => `(?<${k}>\\d+)`]))
}
/**
 * s String the date to parse
 * format String e.g YYYY:MM:DD hh:mm
 * options: { 
 *  locale: {
 *    months: ['jan', 'feb', ...],  months to be used to parse date if MMM given
 *    utc: false: use local timezone, true: use GMT. If GMT in s, apply offsets on GMT (whether utc true of false)
 *  },
 *  now Date date to be considered as current (default Date.now)
 *  strict Boolean strictly parse string instead of tokenizing input
 * }
*/
const parse = (s, format, { months = MONTHS, utc: iUtc = false, strict, now = Date.now() } = {}) => {
  if (!format) return new Date(s)
  s = s.toLowerCase()

  const reg = format.split(/[^\w+]/).map(tok => (regs[tok] && regs[tok](months)) || '').join('(?:[TZ]|[^a-z0-9])+')
  const groups = s.match(new RegExp(reg, 'i'))?.groups
  if (!groups) return null

  const GMT_match = s.match(/gmt([+-])(\d\d)(\d\d)/)
  const utc = !GMT_match && (iUtc || /z/.test(s))
  const { YYYY, YY, MMM, MM, DD, hh, mm, ss, SSS } = groups
  const cur = new Date(now)
  const defaultGet = suffix => cur['get' + (utc ? 'UTC' : '') + suffix]()
  const year = YYYY || (YY && '20' + YY) || defaultGet('FullYear')
  const month = MM
    ? MM - 1
    : MMM
      ? months.findIndex(m => m === MMM)
      : defaultGet('Month')
  const day = DD || defaultGet('Date')
  const hours = +hh || defaultGet('Hours')
  const minutes = +mm || defaultGet('Minutes')
  const seconds = ss || defaultGet('Seconds')
  const milliseconds = SSS || defaultGet('Milliseconds')

  const [,pm, h, m] = GMT_match || []
  const offsetDir = -(pm === '+')
  const offsetHour = offsetDir * h || 0
  const offsetMinute = offsetDir * m || 0
  return GMT_match || utc
    ? new Date(Date.UTC(year, month, day, offsetHour + hours, offsetMinute + minutes, seconds, milliseconds))
    : new Date(year, month, day, hours, minutes, seconds, milliseconds)
}

export default parse
