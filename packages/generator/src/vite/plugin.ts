import { promises as fs } from 'fs';
import { type Plugin } from 'vite';
import path from 'path';
import { processThemeContent } from '../core/process-theme-content.js';
import { generateComponents } from '../core/generate-components.js';

export function mantineTailwindThemePlugin({
  themePath,
  outputPath,
  components,
}: {
  themePath: string;
  outputPath: string;
  components?:
    | {
        enabled: true;
        outputPath: string;
      }
    | {
        enabled: false;
      };
}): Plugin {
  let writeLock = false;

  const processFile = async () => {
    if (writeLock) return;
    writeLock = true;

    try {
      const data = await fs.readFile(themePath, 'utf-8');
      const updatedTheme = processThemeContent(data);

      // Write components file if enabled
      if (components && components.enabled) {
        try {
          const componentsFile = generateComponents(data);
          await fs.writeFile(components.outputPath, componentsFile, 'utf-8');
          console.log(
            '[Vite Mantine Theme Plugin] Components file updated successfully!'
          );
        } catch (writeErr) {
          console.error(
            '[Vite Mantine Theme Plugin] Error writing components file:',
            writeErr
          );
        }
      }

      // Write theme file
      await fs.writeFile(outputPath, updatedTheme, 'utf-8');
      console.log(
        '[Vite Mantine Theme Plugin] Theme file updated successfully!'
      );
    } catch (err) {
      console.error(
        '[Vite Mantine Theme Plugin] Error processing theme file:',
        err
      );
    } finally {
      writeLock = false;
    }
  };

  return {
    name: 'vite-plugin-mantine-theme',
    enforce: 'post',
    async buildStart() {
      await processFile();
    },
    configureServer(server) {
      server.watcher.add(themePath);
      server.watcher.on('change', (filePath) => {
        const normalizedFilePath = path.resolve(filePath);
        const absoluteThemePath = path.resolve(themePath);
        if (normalizedFilePath === absoluteThemePath) {
          processFile();
        }
      });
    },
  };
}
