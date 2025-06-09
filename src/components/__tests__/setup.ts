// tests/setup.ts
import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'

// Configura Pinia globalmente
const pinia = createPinia()
config.global.plugins = [pinia]

config.global.stubs = {
  Transition: true,
}
