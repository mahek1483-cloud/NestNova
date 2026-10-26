import { expect, test, describe } from 'vitest'

describe('Filter Logic', () => {
  test('sponsored properties can be sorted to the top', () => {
    const list = [
      { id: '1', name: 'Regular PG', promotion: { isSponsored: false } },
      { id: '2', name: 'Sponsored PG', promotion: { isSponsored: true } },
    ]
    
    // Simple sort simulating the search page
    const sorted = [...list].sort((a, b) => {
      if (a.promotion?.isSponsored && !b.promotion?.isSponsored) return -1
      if (!a.promotion?.isSponsored && b.promotion?.isSponsored) return 1
      return 0
    })

    expect(sorted[0].id).toBe('2')
    expect(sorted[1].id).toBe('1')
  })
})
