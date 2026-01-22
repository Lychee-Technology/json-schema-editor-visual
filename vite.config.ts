import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isDemoBuild = command === 'serve' || mode === 'demo';

  const plugins = [react()];

  if (!isDemoBuild) {
    plugins.push(dts({
      include: ['package/**/*'],
      outDir: 'dist',
      rollupTypes: true,
    }));
  }

  if (isDemoBuild) {
    return {
      plugins,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './package'),
        },
      },
      build: {
        outDir: 'demo-dist',
        emptyOutDir: true,
      },
    };
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './package'),
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'package/index.tsx'),
        name: 'JsonSchemaEditor',
        formats: ['es', 'umd'],
        fileName: (format) => `main.${format === 'es' ? 'js' : 'umd.js'}`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
          },
          assetFileNames: 'main.[ext]',
        },
      },
    },
  };
});
