import { parse } from 'comment-parser';
import { z } from 'zod';

const componentTypeSchema = z.enum(['Button', 'Anchor', 'Text']);

export function parseComponentDeclarations(content: string) {
  const comments = parse(content);

  const styles: {
    component: string;
    target: string;
    props?: string[];
    variant?: string;
    size?: string;
    classNames: string[];
    disabled?: boolean;
    active?: boolean;
    order?: string;
  }[] = [];

  for (const comment of comments) {
    let target: string | null = null;
    let description: string | null = null;
    let component: string | null = null;
    let props: string[] | undefined;

    for (const line of comment.source) {
      if (line.tokens.tag === '@component') {
        if (component) {
          throw new Error('Duplicate component declaration');
        }
        const result = componentTypeSchema.safeParse(line.tokens.name);
        if (!result.success) {
          throw new Error(`Invalid component type: ${line.tokens.name}`);
        }
        component = result.data;
      }

      /**
       * We've found the component type, now we need to parse the target, variant, size etc
       */
      if (component) {
        if (line.tokens.tag === '@props') {
          props = [
            line.tokens.name,
            ...line.tokens.description
              .split('|')
              .map((prop) => prop.trim())
              .filter(Boolean),
          ];
        } else if (line.tokens.tag === '@target') {
          target = line.tokens.name;
          description = line.tokens.description;
        }
      }

      /**
       * We've found the target, now we need to parse the variant, size etc
       */
      if (component && target) {
        if (!description) {
          throw new Error('Description is required when target is specified');
        }

        const parts = description.trim().split(/\s+/);
        let variant: string | undefined;
        let size: string | undefined;
        let disabled: boolean | undefined;
        let active: boolean | undefined;
        let order: string | undefined;
        let currentIndex = 0;

        // Parse @variant and @size if they exist
        while (currentIndex < parts.length) {
          const part = parts[currentIndex];

          if (part === '@variant') {
            if (currentIndex + 1 >= parts.length) {
              throw new Error('@variant must have a value');
            }
            variant = parts[currentIndex + 1];
            currentIndex += 2;
          } else if (part === '@size') {
            if (currentIndex + 1 >= parts.length) {
              throw new Error('@size must have a value');
            }
            size = parts[currentIndex + 1];
            currentIndex += 2;
          } else if (part === '@disabled') {
            disabled = true;
            currentIndex++;
          } else if (part === '@active') {
            active = true;
            currentIndex++;
          } else if (part === '@order') {
            order = parts[currentIndex + 1];
            currentIndex += 2;
          } else {
            break;
          }
        }

        // Find classnames section
        const remainingParts = parts.slice(currentIndex);

        if (
          remainingParts.length < 2 ||
          !remainingParts[0]?.startsWith('[') ||
          !remainingParts[remainingParts.length - 1]?.endsWith(']')
        ) {
          throw new Error('Classnames must be wrapped in [ ]');
        }

        // Extract classnames
        const classNames = remainingParts
          .join(' ')
          .slice(1, -1)
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        styles.push({
          component,
          target,
          props,
          variant,
          size,
          classNames,
          disabled,
          active,
          order,
        });

        target = null;
        description = null;
      }
    }
  }

  const componentsMap = new Map<
    string,
    {
      component: string;
      props?: string[];
      styles: {
        target: string;
        variant?: string;
        size?: string;
        classNames: string[];
        disabled?: boolean;
        active?: boolean;
        order?: string;
      }[];
    }
  >();

  for (const style of styles) {
    const { component, props, ...styleProps } = style;

    if (!componentsMap.has(component)) {
      componentsMap.set(component, {
        component,
        props,
        styles: [],
      });
    }

    componentsMap.get(component)?.styles.push({
      target: styleProps.target,
      variant: styleProps.variant,
      size: styleProps.size,
      classNames: styleProps.classNames,
      disabled: styleProps.disabled,
      active: styleProps.active,
      order: styleProps.order,
    });
  }

  return Array.from(componentsMap.values());
}
