import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: '8900',
  },
  resolve:{
    alias:{
      "@": path.resolve(__dirname, './src'),
    }
  },
  build: {
    outDir: 'dist',
  }
});
