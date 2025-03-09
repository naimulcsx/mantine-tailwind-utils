import { describe, it, expect } from 'vitest';
import { generateComponents } from '../core/generate-components.js';

const expected = [
  `
import type { ComponentType, ElementType, PropsWithChildren } from "react";

export function withRestrictedProps<
  TElementType extends ElementType,
  TOriginalProps extends object,
  TAllowedProps extends keyof TOriginalProps,
  TOverrideProps extends Partial<Record<TAllowedProps, any>> = {}
>(
  displayName: string,
  Component: ComponentType<TOriginalProps>,
  defaultProps: Partial<Pick<TOriginalProps, TAllowedProps>> = {}
) {
  function RestrictedComponent(
    props: PropsWithChildren<
      Omit<Pick<TOriginalProps, TAllowedProps>, keyof TOverrideProps> &
        TOverrideProps &
        React.ComponentPropsWithoutRef<TElementType>
    >
  ) {
    return <Component {...(defaultProps as TOriginalProps)} {...props} />;
  }

  RestrictedComponent.displayName = displayName;

  return RestrictedComponent;
}
`,
  `
import type { ComponentType, ElementType, PropsWithChildren } from "react";
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from "@mantine/core";
export function withRestrictedProps<
  TElementType extends ElementType,
  TOriginalProps extends object,
  TAllowedProps extends keyof TOriginalProps,
  TOverrideProps extends Partial<Record<TAllowedProps, any>> = {}
>(
  displayName: string,
  Component: ComponentType<TOriginalProps>,
  defaultProps: Partial<Pick<TOriginalProps, TAllowedProps>> = {}
) {
  function RestrictedComponent(
    props: PropsWithChildren<
      Omit<Pick<TOriginalProps, TAllowedProps>, keyof TOverrideProps> &
        TOverrideProps &
        React.ComponentPropsWithoutRef<TElementType>
    >
  ) {
    return <Component {...(defaultProps as TOriginalProps)} {...props} />;
  }

  RestrictedComponent.displayName = displayName;

  return RestrictedComponent;
}

interface ButtonOverrides {
  variant?: "primary";
  size?: "sm";
}

export const Button = withRestrictedProps<
  "button",
  MantineButtonProps,
  "fullWidth" | "loading" | "leftSection" | "rightSection" | "variant" | "size",
  ButtonOverrides
>("Button", MantineButton);
`,
];

const normalize = (str: string) => {
  return str.replace(/\n/g, '').replace(/\s+/g, ' ');
};

describe('generateComponents', () => {
  it('should generate the default file', () => {
    const content = ``;

    const result = generateComponents(content);

    expect(normalize(result)).toBe(normalize(expected[0]));
  });

  it('should generate the button component', () => {
    const content = `
    /**
     * @component Button
     * @props fullWidth | loading | leftSection | rightSection
     *
     * @target root @size sm [ h-[42px] ]
     * @target root @variant primary [ bg-red-500 hover:bg-red-900 focus:outline-none focus-within:ring-2 focus-within:ring-yellow-500 text-xl ]
     */
    `;
    const result = generateComponents(content);
    expect(normalize(result)).toBe(normalize(expected[1]));
  });
});
