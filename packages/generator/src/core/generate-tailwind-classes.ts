import { parseComponentDeclarations } from './parse-component-declarations.js';

export function generateTailwindClasses(
  styles: ReturnType<typeof parseComponentDeclarations>
): string {
  return styles
    .flatMap(({ styles }) =>
      styles.map(({ variant, size, classNames, disabled, active, order }) => {
        const selectorParts: string[] = [];

        if (variant) {
          selectorParts.push(`[data-variant='${variant}']`);
        }

        if (size) {
          selectorParts.push(`[data-size='${size}']`);
        }

        if (disabled) {
          selectorParts.push(`[data-disabled='true']`);
        }

        if (active) {
          selectorParts.push(`[data-active='true']`);
        }

        if (order) {
          selectorParts.push(`[data-order='${order}']`);
        }

        const selector =
          selectorParts.length > 0
            ? `[&${selectorParts.join('&&')}]`
            : undefined;

        return classNames
          .map((className) =>
            selector ? `${selector}:${className}` : className
          )
          .join(' ');
      })
    )
    .join(' ');
}
