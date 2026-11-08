import { describe, expect, it } from 'vitest'
import { LANGS, DATE_LOCALES, DERIVED_LOCALES } from './i18n-core.js'
import { matchLocale } from './default-lang.js'
import el from '../locales/el.js'

// Greek came in as a pack plus the registry lines. A pack the registry forgets never
// shows up in the language picker, and one without a date locale formats dates in English.
describe('Greek is wired up', () => {
  const packs = import.meta.glob('../locales/*.js', { eager: true, import: 'default' })
  const codes = Object.keys(packs).map(p => p.match(/([\w-]+)\.js$/)[1])

  it.each(codes)('%s is offered in the picker and has a date locale', (code) => {
    expect(LANGS[code], `${code} missing from LANGS`).toEqual(expect.any(String))
    expect(DATE_LOCALES[code], `${code} missing from DATE_LOCALES`).toEqual(expect.any(String))
    expect(DERIVED_LOCALES[code]).toBeUndefined()
  })

  it('a Greek phone gets Greek, with Greek dates', () => {
    expect(LANGS.el).toBe('Ελληνικά')
    expect(matchLocale('el-GR')).toBe('el')
    expect(matchLocale('el_GR')).toBe('el')
    // Greek dates use the genitive month: 23 Οκτωβρίου.
    expect(new Intl.DateTimeFormat(DATE_LOCALES.el, { month: 'long' }).format(new Date(2026, 9, 23))).toBe('Οκτωβρίου')
  })

  it('the Greek pack has no em dashes in what it shows', () => {
    const text = v => (v && typeof v === 'object' ? Object.values(v).join(' ') : String(v))
    const dashed = Object.entries(el).filter(([, v]) => text(v).includes('—')).map(([k]) => k)
    expect(dashed).toEqual([])
  })
})
