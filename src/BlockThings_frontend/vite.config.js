import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import excludeDid from './excludeDid'

export default defineConfig({
  plugins: [
    react(),
    excludeDid()
  ],
  build: {
    rollupOptions: {
      // Explicitly tell Rollup to ignore .did files
      onwarn(warning, warn) {
        // Ignore specific warnings
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.source?.endsWith('.did')) {
          return;
        }
        warn(warning);
      },
    },
  },
  resolve: {
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    // Explicitly ignore .did files in the resolver
    preserveSymlinks: true,
  }
});