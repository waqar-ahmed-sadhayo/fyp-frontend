import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    // The default "forks" pool times out spawning worker processes in this
    // environment (Windows, sandboxed) — "threads" is faster and reliable here.
    pool: 'threads',
  },
})
