// src/composables/useTextParser.ts
import { computed } from 'vue'

export function useTextParser() {
  const parseDisplayText = (text: string, forceEditMode: boolean = false): string => {
    if (forceEditMode) {
      return parseEditableText(text)
    }

    const words = text.split(/(\s+)/)

    const processedWords = words.map((word) => {
      if (word.trim().length > 0) {
        // Hashtags
        if (/^#\w+/.test(word)) {
          return `<span class="bg-purple-200 text-purple-700 px-2 py-1.5 rounded-full" title="${word}">${word}</span>`
        }
        // Menciones
        if (/^@\w+/.test(word)) {
          return `<span class="bg-green-200 text-green-700 px-2 py-1.5 rounded-full" title="${word}">${word}</span>`
        }
        // Emails
        if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(word)) {
          return `<span class="inline-flex items-center gap-1 bg-yellow-200 text-yellow-700 px-2 py-4 rounded-full h-6 align-middle" title="${word}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span class="text-lg leading-none">Mail</span>
          </span>`
        }
        // URLs
        if (/^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(word)) {
          return `<span class="inline-flex items-center gap-1 bg-blue-200 text-blue-700 px-2 py-4 rounded-full h-6 align-middle" title="${word}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span class="text-lg leading-none">Link</span>
          </span>`
        }
      }
      return word
    })

    return processedWords.join('')
  }

  const parseEditableText = (text: string): string => {
    const words = text.split(/(\s+)/)

    const processedWords = words.map((word) => {
      if (word.trim().length > 0) {
        if (/^#\w+/.test(word)) return `<span class="text-category">${word}</span>`
        if (/^@\w+/.test(word)) return `<span class="text-user">${word}</span>`
        if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(word))
          return `<span class="text-email">${word}</span>`
        if (/^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(word))
          return `<span class="text-url">${word}</span>`
      }
      return word
    })

    return processedWords.join('')
  }

  return {
    parseDisplayText,
    parseEditableText,
  }
}
