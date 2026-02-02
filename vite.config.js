import { defineConfig } from 'vite'

export default defineConfig({
  base: '/desktop-portfolio/',
  build: {
    rollupOptions: {
      external: ['fsevents']
    }
  },
  optimizeDeps: {
    exclude: ['fsevents']
  }
})