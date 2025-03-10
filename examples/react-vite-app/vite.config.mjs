/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(async () => {
  // Uncomment the lines when you want to use the plugin
  // const { mantineTailwindThemePlugin } = await import(
  //   '@mantine-tailwind-utils/generator'
  // );

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
      // mantineTailwindThemePlugin({
      //   themePath: './src/styles/theme.ts',
      //   outputPath: './src/styles/theme.gen.ts',
      //   components: {
      //     generate: true,
      //     outputDir: './src/components',
      //     stories: false,
      //   },
      // }),
      react(),
      tailwindcss(),
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
