// src/types/textTypes.ts
export interface TextMetadata {
  rawText: string
  categories: string[]
  users: string[]
  emails: string[]
  urls: string[]
}

export interface ParsedTextResult {
  html: string
  metadata: TextMetadata
}

export type TextParser = {
  parseText: (text: string) => ParsedTextResult
  extractMetadata: (text: string) => TextMetadata
}
