import { withRestrictedProps } from "../with-restricted-props";
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from "@mantine/core";

interface ButtonOverrides {
  variant?: "primary";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = withRestrictedProps<
  "button",
  MantineButtonProps,
  "loading" | "variant" | "size",
  ButtonOverrides
>("Button", MantineButton);