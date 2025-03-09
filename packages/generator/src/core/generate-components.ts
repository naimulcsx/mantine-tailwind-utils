import { getCompiledTemplate } from '../templates/get-template.js';
import { parseComponentDeclarations } from './parse-component-declarations.js';

export function generateComponents(content: string) {
  const parsedComponents = parseComponentDeclarations(content);

  let fileContent = getImports(
    parsedComponents.map(({ component }) => component)
  );

  fileContent += getUtils();

  const stories: Array<{ component: string; fileContent: string }> = [];

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
        fileContent += `\n${getButton({ props, variants, sizes })}\n`;
        stories.push({
          component,
          fileContent: getButtonStory({ props, variants, sizes }),
        });
        break;
    }
  });

  return {
    fileContent,
    stories,
  };
}

const getImports = (components: string[]) => {
  const template = getCompiledTemplate('imports');
  return template({ components });
};

const getUtils = () => {
  const template = getCompiledTemplate('utils');
  return template({});
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

const getButtonStory = ({
  props,
  variants,
  sizes,
}: {
  props?: string[];
  variants?: string[];
  sizes?: string[];
}) => {
  // Get the compiled template
  const template = getCompiledTemplate('button.stories');

  // Default values if not provided
  variants = variants || [];
  sizes = sizes || [];
  props = props || [];

  // Create story variants based on available variants and sizes
  const stories = [];

  // Default size and variant for stories
  const defaultSize = sizes.length > 0 ? sizes[0] : undefined;
  const defaultVariant = variants.length > 0 ? variants[0] : undefined;

  // Generate stories for each variant (keeping default size)
  if (variants.length > 0) {
    for (const variant of variants) {
      // Convert to PascalCase for story name
      const storyName = variant.charAt(0).toUpperCase() + variant.slice(1);

      stories.push({
        name: storyName,
        args: {
          variant: `"${variant}"`,
          size: defaultSize ? `"${defaultSize}"` : undefined,
          children: `"${storyName} Button"`,
        },
      });
    }
  }

  // Generate stories for each size (keeping default variant)
  if (sizes.length > 0) {
    for (const size of sizes) {
      const sizeName = size.charAt(0).toUpperCase() + size.slice(1);
      stories.push({
        name: `Size${sizeName}`,
        args: {
          variant: defaultVariant ? `"${defaultVariant}"` : undefined,
          size: `"${size}"`,
          children: `"Size ${sizeName} Button"`,
        },
      });
    }
  }

  // If no stories were generated, add a default story
  if (stories.length === 0) {
    stories.push({
      name: 'Default',
      args: {
        children: '"Button"',
      },
    });
  }

  const hasLoading = props.includes('loading');
  const hasFullWidth = props.includes('fullWidth');

  // Loading prop
  if (hasLoading) {
    stories.push({
      name: 'Loading',
      args: {
        loading: 'true',
        children: '"Loading Button"',
      },
    });
  }

  if (hasFullWidth) {
    stories.push({
      name: 'FullWidth',
      args: {
        fullWidth: 'true',
        children: '"Full Width Button"',
      },
    });
  }

  // Add a disabled story using the default variant and size
  stories.push({
    name: 'Disabled',
    args: {
      variant: defaultVariant ? `"${defaultVariant}"` : undefined,
      size: defaultSize ? `"${defaultSize}"` : undefined,
      disabled: 'true',
      children: '"Disabled Button"',
    },
  });

  // Prepare data for template
  const data = {
    componentName: 'Button',
    variants: variants.map((v) => `"${v}"`),
    sizes: sizes.map((s) => `"${s}"`),
    hasVariants: variants.length > 0,
    hasSizes: sizes.length > 0,
    stories: stories,
    hasFullWidth,
    hasLoading,
  };

  return template(data);
};
