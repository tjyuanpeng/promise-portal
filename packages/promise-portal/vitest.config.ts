import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue'],
      dts: './__test__/types/auto-imports.d.ts',
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    Components({
      dts: './__test__/types/components.d.ts',
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
    vue(),
  ],
  test: {
    globals: true,
    pool: 'vmThreads',
    environment: 'happy-dom',
    setupFiles: ['vitest.setup.ts'],
    deps: {
      optimizer: {
        web: {
          include: ['element-plus'],
        },
      },
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
    },
  },
})
