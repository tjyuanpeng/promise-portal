import { resolve } from 'path'
import { execSync } from 'child_process'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import vpvepi from 'vite-plugin-vue-element-plus-icon'

const commitHash = execSync('git rev-parse --short HEAD').toString()

// https://vitejs.dev/config/
export default defineConfig({
  base: '/assets-mobile-fe/',
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [
    {
      name: 'inject',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { src: '/api/config.js' },
          },
          {
            tag: 'script',
            attrs: { src: '//res.wx.qq.com/open/js/jweixin-1.6.0.js' },
          },
        ]
      },
    },
    vue(),
    vueJsx(),
    Pages({
      dirs: 'src/pages',
      extensions: ['vue'],
      exclude: ['**/components/*.vue'],
    }),
    Layouts({
      defaultLayout: 'normal',
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router': ['useRouter', 'useRoute'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/**/*.store.ts'],
    }),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [VantResolver()],
    }),
    vpvepi(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 9001,
    proxy: {
      '^/(api|cubeassetsapi)': {
        target: 'https://xcdevportal.cube.lenovo.com/',
        // target: 'https://xcsitportal.cube.lenovo.com/',
        changeOrigin: true,
      },
    },
  },
})
