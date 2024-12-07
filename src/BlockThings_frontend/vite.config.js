import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      // Add this to handle .did files
      external: (id) => id.endsWith('.did'),
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    // Optional: Add a plugin to handle .did files
    {
      name: 'did-file-handler',
      resolveId(source) {
        if (source.endsWith('.did')) {
          return { id: source, external: true };
        }
      }
    }
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
      // Optional: Add an alias for .did files
      {
        find: /\.did$/,
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        )
      }
    ],
  },
});