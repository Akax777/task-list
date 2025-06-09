// tests/unit/useTextParser.spec.ts
import { describe, expect, it } from 'vitest'
import { useTextParser } from '../../../composables/useTextParser'

describe('useTextParser', () => {
  it('parsea hashtags', () => {
    const { parseDisplayText } = useTextParser()
    const result = parseDisplayText('Hello #world')
    expect(result).toContain('bg-purple-200')
    expect(result).toContain('#world')
  })

  it('parsea emails', () => {
    const { parseDisplayText } = useTextParser()
    const result = parseDisplayText('Contact test@example.com')
    expect(result).toContain('bg-yellow-200')
    expect(result).toContain('Mail')
  })

  it('parsea en modo edición', () => {
    const { parseEditableText } = useTextParser()
    const result = parseEditableText('Hello @user')
    expect(result).toContain('text-user')
    expect(result).toContain('@user')
  })
})
