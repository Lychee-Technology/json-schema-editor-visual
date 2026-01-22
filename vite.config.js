import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const plugins = [react()];

export default defineConfig(({ command, mode }) => {
  const isDemoBuild = command === 'serve' || mode === 'demo';

  if (isDemoBuild) {
    return {
      plugins,
      build: {
        outDir: 'demo-dist',
        emptyOutDir: true
      }
    };
  }

  return {
    plugins,
    build: {
      lib: {
        entry: path.resolve(__dirname, 'package/index.tsx'),
        name: 'schema',
        formats: ['umd']
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom'
        ],
        output: {
          entryFileNames: 'main.js',
          assetFileNames: 'main.[ext]',
          globals: {
            react: 'React',
            'react-dom': 'ReactDom'
          }
        }
      }
    }
  };
});
