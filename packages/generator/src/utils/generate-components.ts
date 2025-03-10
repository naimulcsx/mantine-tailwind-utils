import { getWithRestrictedProps } from '../templates/with-restricted-props.js';
import { ComponentDeclaration } from './parse-component-declarations.js';
import { getButton, getButtonStory } from '../templates/button.js';

export function generateComponents(
  componentDeclarations: ComponentDeclaration[]
) {
  const files = [
    {
      path: 'with-restricted-props.tsx',
      fileContent: getWithRestrictedProps(),
    },
    {
      path: 'Button/Button.tsx',
      fileContent: getButton({
        props: componentDeclarations[0]?.props,
        variants: componentDeclarations[0]?.variants,
        sizes: componentDeclarations[0]?.sizes,
      }),
    },
    {
      path: 'Button/Button.stories.tsx',
      fileContent: getButtonStory({
        props: componentDeclarations[0]?.props,
        variants: componentDeclarations[0]?.variants,
        sizes: componentDeclarations[0]?.sizes,
      }),
    },
  ];

  return { files };
}
