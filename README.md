# Tinydate

Yet another date parser

- no deps
- < 50 lines, <1kB minified


### statuses ###

![not minified](https://badge-size.herokuapp.com/mpech/tinydate/master/index.js)
![tests](https://github.com/mpech/tinydate/actions/workflows/nodejs.yml/badge.svg)

### Usage ###

```
import parse from 'tinydate'
const back = parse('Wed Oct 05 2011 16:48:00.150 GMT+0415 (CEST)', 'MMM DD YYYY hh mm ss SSS')
expect(back.toISOString()).toBe('2011-10-05T12:33:00.150Z')
```

Assumes UTC if z present

```
    const back = parse('21/03/05T12Z', 'YY/MM/DD hh')
    expect(back.getUTCHours()).toBe(12)
```


### args ###

`parse(str, format, options)`


`format`

| matcher   |      label    
|-----------|:-------------:
| YYYY      | year
| MMM       | 3-letter month as jan, feb, ...
| DD        | day
| hh        | hour
| mm        | minute
| ss        | second
| SSS       | millisecond
    


`options`

- `options.months`: ['list of month', '...']
- `options.utc`: Boolean

`options.utc`: `true` will assume input `str` has no local timezone offset

`options.utc`: `false` will assume input `str` is expressed in local timezone (even though z present)


### dev ###

`deno test --watch test/index.spec.js`

`pnpm test && pnpm run build`