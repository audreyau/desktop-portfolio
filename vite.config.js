import { defineConfig } from 'vite'

export default defineConfig({
  base: '/desktop-portfolio/',
  build: {
    rollupOptions: {
      external: ['fsevents'], 
    }
  },
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
})
