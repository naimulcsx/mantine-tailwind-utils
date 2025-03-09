import { describe, it, expect } from 'vitest';
import { generateComponents } from '../core/generate-components.js';
import { parseComponentDeclarations } from '../core/parse-component-declarations.js';
const normalize = (str: string) => {
  return str.replace(/\n/g, '').replace(/\s+/g, ' ');
};

const expected = [
  `
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary"],
      description: "Button variant style",
    },
    size: {
      control: { type: "select" },
      options: ["sm"],
      description: "Button size",
    },
    fullWidth: {
      control: { type: "boolean" },
      description: "Button full width",
    },
    loading: {
      control: { type: "boolean" },
      description: "Button loading",
    },
    children: {
      control: "text",
      description: "Button content",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Button story
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Primary Button",
  },
};

// SizeSm Button story
export const SizeSm: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Size Sm Button",
  },
};

// Loading Button story
export const Loading: Story = {
  args: {
    loading: true,
    children: "Loading Button",
  },
};

// FullWidth Button story
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: "Full Width Button",
  },
};

// Disabled Button story
export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "sm",
    disabled: true,
    children: "Disabled Button",
  },
};
`,
];

describe('generate-stories', () => {
  it('should generate story for the button component', () => {
    const content = `
    /**
     * @component Button
     * @props fullWidth | loading
     *
     * @target root @size sm [ h-[42px] ]
     * @target root @variant primary [ bg-red-500 hover:bg-red-900 focus:outline-none focus-within:ring-2 focus-within:ring-yellow-500 text-xl ]
     */
    `;
    const componentDeclarations = parseComponentDeclarations(content);
    const result = generateComponents(componentDeclarations);

    expect(normalize(result.stories[0].fileContent)).toBe(
      normalize(expected[0])
    );
  });
});
