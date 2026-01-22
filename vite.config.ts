import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode }) => {
  const isLibBuild = mode === 'lib';

  const plugins: PluginOption[] = [react()];
  const resolve = {
    alias: {
      '@': path.resolve(__dirname, './package'),
    },
  };

  if (!isLibBuild) {
    return {
      base: './',
      plugins,
      resolve,
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
    };
  }

  const dtsPlugin = dts({
    include: ['package/**/*'],
    outDir: 'dist',
    rollupTypes: true,
  });

  if (Array.isArray(dtsPlugin)) {
    plugins.push(...dtsPlugin);
  } else {
    plugins.push(dtsPlugin);
  }

  return {
    plugins,
    resolve,
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
