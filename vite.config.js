// https://vitejs.dev/guide/build.html#library-mode
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // 生成される assets を相対パスにする
  build: {
    target: 'esnext', // to use top-level await
  },
})
