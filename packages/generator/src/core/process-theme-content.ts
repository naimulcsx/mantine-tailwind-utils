import { generateTailwindClasses } from './generate-tailwind-classes.js';
import { parseComponentDeclarations } from './parse-component-declarations.js';

export function processThemeContent(content: string): string {
  try {
    const parsedComponents = parseComponentDeclarations(content);
    const componentClassNames: Record<string, Record<string, string>> = {};

    // Process each component
    parsedComponents.forEach(({ component, styles }) => {
      if (!componentClassNames[component]) {
        componentClassNames[component] = {};
      }

      // Process each style for the component
      styles.forEach(({ target, classNames, ...conditions }) => {
        const key = target;
        const classNameString = generateTailwindClasses([
          { component, styles: [{ target, classNames, ...conditions }] },
        ]);

        if (!componentClassNames[component][key]) {
          componentClassNames[component][key] = classNameString;
        } else {
          componentClassNames[component][key] += ` ${classNameString}`;
        }
      });
    });

    let updatedContent = content;

    // Update each component's classNames separately
    Object.keys(componentClassNames).forEach((component) => {
      const classNamesString = JSON.stringify(
        componentClassNames[component],
        null,
        2
      );

      // Use a more specific regex pattern to target only the classNames of the current component
      const componentRegex = new RegExp(
        `(${component}:\\s*${component}\\.extend\\([^)]*classNames:\\s*)\\{[^}]*\\}`,
        's'
      );

      updatedContent = updatedContent.replace(
        componentRegex,
        `$1${classNamesString}`
      );
    });

    return updatedContent;
  } catch (error) {
    console.error(
      '[Mantine Theme Processor] Error processing theme content:',
      error
    );
    return content; // Return original content on error
  }
}
