import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@build': resolve(__dirname, 'build'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
  },
});
