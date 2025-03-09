import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import { parseComponentDeclarations } from './parse-component-declarations.js';

export function generateComponents(content: string) {
  const parsedComponents = parseComponentDeclarations(content);

  let file = getImports(parsedComponents.map(({ component }) => component));

  file += getUtils();

  parsedComponents.forEach(({ component, props, styles }) => {
    const variants: string[] = [];
    const sizes: string[] = [];

    styles.forEach(({ variant, size }) => {
      if (variant && !variants.includes(variant)) {
        variants.push(variant);
      }
      if (size && !sizes.includes(size)) {
        sizes.push(size);
      }
    });

    switch (component) {
      case 'Button':
        file += `\n${getButton({ props, variants, sizes })}\n`;
        break;
    }
  });

  return file;
}

const getImports = (components: string[]) => {
  const template = getCompiledTemplate('imports');
  return template({ components });
};

const getUtils = () => {
  const template = getCompiledTemplate('utils');
  return template({});
};

const getCompiledTemplate = (templateName: string) => {
  const templatePath = path.resolve(
    __dirname,
    '../templates',
    `${templateName}.hbs`
  );
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  return Handlebars.compile(templateSource);
};

const getButton = ({
  props,
  variants,
  sizes,
}: {
  props?: string[];
  variants?: string[];
  sizes?: string[];
}) => {
  props = props || [];

  // Add variant and size to props if they exist
  if (variants?.length) props.push('variant');
  if (sizes?.length) props.push('size');

  // Get the compiled template
  const template = getCompiledTemplate('button');

  // Prepare data for template
  const data = {
    hasVariants: variants && variants.length > 0,
    variantTypes: variants?.map((v) => `"${v}"`).join(' | '),
    hasSizes: sizes && sizes.length > 0,
    sizeTypes: sizes?.map((s) => `"${s}"`).join(' | '),
    restrictedProps:
      props.length > 0 ? props.map((prop) => `"${prop}"`).join(' | ') : '""',
  };

  return template(data);
};
