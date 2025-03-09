import { describe, it, expect } from 'vitest';
import { generateComponents } from '../core/generate-components.js';

const expected = [
  `
import type { ComponentType, PropsWithChildren } from "react";

export function withRestrictedProps<
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
`,
  `
import type { ComponentType, PropsWithChildren } from "react";
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from "@mantine/core";
export function withRestrictedProps<
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

interface ButtonOverrides {
  variant?: "primary";
  size?: "sm";
}

export const Button = withRestrictedProps<
  MantineButtonProps,
  "fullWidth" | "loading" | "leftSection" | "rightSection" | "variant" | "size",
  ButtonOverrides
>("Button", MantineButton);
`,
];

describe('generateComponents', () => {
  it('should generate the default file', () => {
    const content = ``;

    const result = generateComponents(content);

    expect(result).toBe(expected[0]);
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
    expect(result).toBe(expected[1]);
  });
});
