import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import { UserConfig } from 'vite'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      setupFiles: './src/components/__tests__/setup.ts',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        include: ['src/**/*.{vue,ts}'],
        exclude: ['src/main.ts', 'src/__tests__/**', '**/*.d.ts', 'src/components/icons/*.vue'],
        thresholds: {
          lines: 85,
          functions: 85,
          branches: 85,
          statements: 85,
        },
      },
    },
  }) as UserConfig,
)
