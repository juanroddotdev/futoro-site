import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/futoro-site/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  // Add this to help with module resolution
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core', 'gsap']
  },
  // Add this to help with build issues
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  // Add font file handling
  assetsInclude: ['**/*.ttf', '**/*.woff', '**/*.woff2'],
  publicDir: 'public'
})
