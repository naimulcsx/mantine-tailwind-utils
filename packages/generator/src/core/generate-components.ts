import { parseComponentDeclarations } from './parse-component-declarations.js';

export function generateComponents(content: string) {
  const parsedComponents = parseComponentDeclarations(content);

  let file = getImports(parsedComponents.map(({ component }) => component));

  file += getWithRestrictedProps();

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
        file += getButton({ props, variants, sizes });
        break;
    }
  });

  return file;
}

const getImports = (components: string[]) => {
  return `
import type { ComponentType, PropsWithChildren } from "react";
${components
  .map(
    (component) =>
      `import { ${component} as Mantine${component}, type ${component}Props as Mantine${component}Props } from "@mantine/core";`
  )
  .join('\n')}
`;
};

const getWithRestrictedProps = () => {
  return `export function withRestrictedProps<
  TOriginalProps extends object,
  TAllowedProps extends keyof TOriginalProps,
  TOverrideProps extends Partial<Record<TAllowedProps, any>> = {}
>(
  componentName: string,
  Component: ComponentType<TOriginalProps>,
  defaultProps: Partial<Pick<TOriginalProps, TAllowedProps>> = {}
) {
  function RestrictedComponent(
    props: PropsWithChildren<
      Omit<Pick<TOriginalProps, TAllowedProps>, keyof TOverrideProps> &
        TOverrideProps & { className?: string }
    >
  ) {
    return <Component {...(defaultProps as TOriginalProps)} {...props} />;
  }

  RestrictedComponent.displayName = componentName;

  return RestrictedComponent;
}
`;
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

  // Create the interface with variant and size if they exist
  let interfaceContent = 'interface ButtonOverrides {';

  // Add variant property if variants exist
  if (variants && variants.length > 0) {
    const variantTypes = variants.map((v) => `"${v}"`).join(' | ');
    interfaceContent += `\n  variant?: ${variantTypes};`;
    props?.push('variant');
  }

  // Add size property if sizes exist
  if (sizes && sizes.length > 0) {
    const sizeTypes = sizes.map((s) => `"${s}"`).join(' | ');
    interfaceContent += `\n  size?: ${sizeTypes};`;
    props?.push('size');
  }

  interfaceContent += '\n}';

  // Create the restricted props list from the props array
  const restrictedProps =
    props && props.length > 0
      ? props.map((prop) => `"${prop}"`).join(' | ')
      : '""'; // Empty string if no props

  // Generate the component export
  const componentExport = `
export const Button = withRestrictedProps<
  MantineButtonProps,
  ${restrictedProps},
  ButtonOverrides
>("Button", MantineButton);
`;

  // Combine interface and component export
  return `${interfaceContent}

${componentExport}`;
};
