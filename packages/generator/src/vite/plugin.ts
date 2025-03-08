import fs from 'fs';
import { type Plugin } from 'vite';
import path from 'path';
import { processThemeContent } from 'src/core/process-theme-content.js';

export function mantineTailwindThemePlugin({
  themePath,
  outputPath,
}: {
  themePath: string;
  outputPath: string;
}): Plugin {
  let writeLock = false;

  const processFile = () => {
    if (writeLock) return;
    writeLock = true;

    fs.readFile(themePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(
          '[Vite Mantine Theme Plugin] Error reading theme file:',
          err
        );
        writeLock = false;
        return;
      }

      try {
        const updatedTheme = processThemeContent(data);

        // Write the updated theme file to outputPath
        fs.writeFile(outputPath, updatedTheme, 'utf-8', (writeErr) => {
          writeLock = false;
          if (writeErr) {
            console.error(
              '[Vite Mantine Theme Plugin] Error writing theme file:',
              writeErr
            );
          } else {
            console.log(
              '[Vite Mantine Theme Plugin] Theme file updated successfully!'
            );
          }
        });
      } catch (parseErr) {
        console.error(
          '[Vite Mantine Theme Plugin] Error processing theme file:',
          parseErr
        );
        writeLock = false;
      }
    });
  };

  return {
    name: 'vite-plugin-mantine-theme',
    enforce: 'post',
    buildStart() {
      processFile();
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
