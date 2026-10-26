import { expect, test, describe } from 'vitest'
import { getTravelEstimate, formatTravelString } from './travel'

describe('Travel Estimates (Demo)', () => {
  test('walking estimate is ~12 mins per km', () => {
    const est = getTravelEstimate(2.5, 'walk')
    expect(est.timeMins).toBe(30)
    expect(est.costInr).toBe(0)
  })

  test('auto estimate has base fare and per km logic', () => {
    const est = getTravelEstimate(5, 'auto')
    expect(est.timeMins).toBe(23) // 5 * 4 + 3
    expect(est.costInr).toBe(120) // 30 + 5 * 18
  })

  test('format string outputs correctly', () => {
    const est = getTravelEstimate(2, 'metro')
    const str = formatTravelString(est)
    expect(str).toContain('2 km')
    expect(str).toContain('14 min via metro')
    expect(str).toContain('₹18')
  })
})
