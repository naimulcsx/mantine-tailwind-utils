import { promises as fs } from 'fs';
import { type Plugin } from 'vite';
import path from 'path';
import { processThemeContent } from '../core/process-theme-content.js';
import { generateComponents } from '../core/generate-components.js';
import { parseComponentDeclarations } from '../core/parse-component-declarations.js';

export function mantineTailwindThemePlugin({
  themePath,
  outputPath,
  components,
}: {
  themePath: string;
  outputPath: string;
  components?:
    | false
    | {
        generate: true;
        outputDir: string;
        stories?: boolean;
      }
    | {
        generate: false;
      };
}): Plugin {
  let writeLock = false;

  const processFile = async () => {
    if (writeLock) return;
    writeLock = true;

    try {
      const sourceThemeContent = await fs.readFile(themePath, 'utf-8');

      const componentDeclarations =
        parseComponentDeclarations(sourceThemeContent);

      const updatedThemeContent = processThemeContent(
        sourceThemeContent,
        componentDeclarations
      );

      // Write theme file
      await fs.writeFile(outputPath, updatedThemeContent, 'utf-8');

      // Write Component Files + Stories
      if (components && components.generate) {
        try {
          let { files } = generateComponents(componentDeclarations);

          if (!components.stories) {
            files = files.filter((file) => !file.path.endsWith('.stories.tsx'));
          }

          for (const file of files) {
            const dir = path.dirname(file.path);
            if (dir !== '.') {
              await fs.mkdir(path.join(components.outputDir, dir), {
                recursive: true,
              });
            }
            await fs.writeFile(
              path.join(components.outputDir, file.path),
              file.fileContent,
              'utf-8'
            );
          }
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
