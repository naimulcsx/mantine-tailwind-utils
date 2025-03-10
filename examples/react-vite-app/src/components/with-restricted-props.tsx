import type { ComponentType, ElementType, PropsWithChildren } from "react";

export function withRestrictedProps<
  TElementType extends ElementType,
  TOriginalProps extends object,
  TAllowedProps extends keyof TOriginalProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
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