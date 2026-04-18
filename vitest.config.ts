import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), viteReact()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
