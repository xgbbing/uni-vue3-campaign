import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
import { removeConsole } from './src/plugins/remove-console'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [uni(), removeConsole()],
  css: {
    preprocessorOptions: {
      scss: {
        // 取消sass废弃API的报警
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],
      },
    },
  },
  server: {
    port: 5100,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
})
