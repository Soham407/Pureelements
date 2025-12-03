/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // cartService is pure logic/db calls, node env is fine. If testing components, use jsdom.
  },
});
