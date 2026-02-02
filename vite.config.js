import { defineConfig } from 'vite'
import path from 'path-browserify'

export default defineConfig({
  base: '/desktop-portfolio/',
  resolve: {
    alias: {
      'path': 'path-browserify',
      'node:path': 'path-browserify',
    },
  },
  build: {
    rollupOptions: {
      external: ['fsevents'],
    },
  },
})
