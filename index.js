const regs = {
  MMM: ({ months }) => `(?<MMM>(${months.join`|`}))`,
  ...Object.fromEntries(['YYYY', 'YY', 'MM', 'DD', 'hh', 'mm', 'ss', 'SSS'].map(k => [k, () => `(?<${k}>\\d+)`]))
}
const months = 'janfebmaraprmayjunjulaugsepoctnovdec'.match(/.../g)
const parse = (s, format, locale = {}) => {
  if (!format) return new Date(s)
  s = s.toLowerCase()
  const loc = { months, ...locale }

  const reg = format.split(/[^\w+]/).map(tok => (regs[tok] && regs[tok](loc)) || '').join('(?:[TZ]|[^a-z0-9])+')
  const groups = s.match(new RegExp(reg, 'i'))?.groups
  if (!groups) return null

  const utc = locale.utc ?? s.includes('z')

  const { YYYY, YY, MMM, MM, DD, hh, mm, ss, SSS } = groups
  const cur = new Date(loc.now ?? Date.now())
  const defaultGet = suffix => cur['get' + (utc ? 'UTC' : '') + suffix]()
  const year = YYYY || (YY && '20' + YY) || defaultGet('FullYear')
  const month = MM
    ? MM - 1
    : MMM
      ? loc.months.findIndex(m => m === MMM)
      : defaultGet('Month')
  const day = DD || defaultGet('Date')
  const hours = +hh || defaultGet('Hours')
  const minutes = +mm || defaultGet('Minutes')
  const seconds = ss || defaultGet('Seconds')
  const milliseconds = SSS || defaultGet('Milliseconds')

  const [,pm, h, m] = (locale.utc !== false && s.match(/gmt([+-])(\d\d)(\d\d)/)) || []
  const offsetDir = -(pm === '+')
  const offsetHour = offsetDir * h || 0
  const offsetMinute = offsetDir * m || 0
  return utc || pm
    ? new Date(Date.UTC(year, month, day, offsetHour + hours, offsetMinute + minutes, seconds, milliseconds))
    : new Date(year, month, day, hours, minutes, seconds, milliseconds)
}

export default parse
