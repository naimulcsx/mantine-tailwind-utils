import { generateTailwindClasses } from "./generate-tailwind-classes.js";
import { parseComponentDeclarations } from "./parse-component-declarations.js";

export function processThemeContent(content: string): string {
  try {
    const parsedStyles = parseComponentDeclarations(content);
    const componentClassNames: Record<string, Record<string, string>> = {};

    // Group styles by component
    parsedStyles.forEach(({ target, classNames, component, ...conditions }) => {
      if (!component) {
        console.warn(
          "[Mantine Theme Processor] Skipping style, no component type found."
        );
        return;
      }

      if (!componentClassNames[component]) {
        componentClassNames[component] = {};
      }

      const key = target;
      const classNameString = generateTailwindClasses([
        { target, classNames, component, ...conditions },
      ]);

      if (!componentClassNames[component][key]) {
        componentClassNames[component][key] = classNameString;
      } else {
        componentClassNames[component][key] += ` ${classNameString}`;
      }
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
        "s"
      );

      updatedContent = updatedContent.replace(
        componentRegex,
        `$1${classNamesString}`
      );
    });

    return updatedContent;
  } catch (error) {
    console.error(
      "[Mantine Theme Processor] Error processing theme content:",
      error
    );
    return content; // Return original content on error
  }
}
