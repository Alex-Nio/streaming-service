import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }]
  },
  build: {
    chunkSizeWarningLimit: 600
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/app/styles/scss/imports.scss";`
      }
    }
  },
  plugins: [
    vue(),
    svgLoader()
  ]
});
