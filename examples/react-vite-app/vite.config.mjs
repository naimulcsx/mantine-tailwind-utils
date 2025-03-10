/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { mantineTailwindThemePlugin } from '@mantine-tailwind-utils/generator';

export default defineConfig(() => {
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/examples/react-vite-app',
    server: {
      port: 4200,
      host: 'localhost',
    },
    preview: {
      port: 4300,
      host: 'localhost',
    },
    plugins: [
      tailwindcss(),
      mantineTailwindThemePlugin({
        themePath: './src/styles/theme.ts',
        outputPath: './src/styles/theme.gen.ts',
        components: {
          generate: true,
          outputDir: './src/components',
          stories: false,
        },
      }),
      react(),
    ],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
