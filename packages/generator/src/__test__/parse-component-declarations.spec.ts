import { describe, it, expect } from 'vitest';
import { parseComponentDeclarations } from '../core/parse-component-declarations.js';

describe('parseComponentDeclarations', () => {
  it('should throw an error if the component is declared twice', () => {
    const source = `
    /**
     * @component Button
     * @component Anchor
     * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
     */
    `;
    expect(() => parseComponentDeclarations(source)).toThrow(
      'Duplicate component declaration'
    );
  });

  it('should throw an error if the component is unknown', () => {
    const source = `
    /**
     * @component InvalidComponent
     * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
     */
    `;
    expect(() => parseComponentDeclarations(source)).toThrow(
      'Invalid component type: InvalidComponent'
    );
  });

  it('should parse an empty @target line', () => {
    const source = `
    /**
     * @component Button
     * @target root [ ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: undefined,
            size: undefined,
            classNames: [],
          },
        ],
      },
    ]);
  });

  it('should parse a valid @target line', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary [ text-2xl font-bold rounded-md ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: undefined,
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should parse with both variant and size', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: 'lg',
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should parse with only size', () => {
    const source = `
    /**
     * @component Button
     * @target root @size lg [ text-2xl font-bold rounded-md ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: undefined,
            size: 'lg',
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should parse it any order', () => {
    const source = `
    /**
     * @component Button
     * @target root @size lg @variant primary [ text-2xl font-bold rounded-md ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: 'lg',
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should throw an error if the classnames are not wrapped in [ ]', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @size lg text-2xl font-bold rounded-md
     */
    `;
    expect(() => parseComponentDeclarations(source)).toThrow(
      'Classnames must be wrapped in [ ]'
    );
  });

  it('should parse multiple @target lines', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
     * @target root @variant secondary @size sm [ text-lg font-bold rounded-md ]
     * @target root @variant tertiary [ bg-red-100 ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: 'lg',
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
          {
            target: 'root',
            variant: 'secondary',
            size: 'sm',
            classNames: ['text-lg', 'font-bold', 'rounded-md'],
          },
          {
            target: 'root',
            variant: 'tertiary',
            size: undefined,
            classNames: ['bg-red-100'],
          },
        ],
      },
    ]);
  });

  it('should parse with different components', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
     */

    /**
     * @component Anchor
     * @target root @variant primary @size lg [ text-2xl underline ]
     */

    /**
     * @component Text
     * @target root @variant primary @size lg [ text-lg ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: 'lg',
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
      {
        component: 'Anchor',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: 'lg',
            classNames: ['text-2xl', 'underline'],
          },
        ],
      },
      {
        component: 'Text',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: 'lg',
            classNames: ['text-lg'],
          },
        ],
      },
    ]);
  });

  it("should parse if it's a part of the code", () => {
    const source = `
      import { createTheme } from '@mantine/core';

      const theme = createTheme({});

      /**
       * @component Button
       * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
       */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            size: 'lg',
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should parse disabled as a part of the code', () => {
    const source = `
    /**
     * @component Button
     * @target root @disabled [ text-2xl font-bold rounded-md ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            disabled: true,
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should parse disabled state with variants', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @disabled [ text-2xl font-bold rounded-md ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            disabled: true,
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should parse active state with variants', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @active [ text-2xl font-bold rounded-md ]
     */
    `;
    const result = parseComponentDeclarations(source);
    expect(result).toEqual([
      {
        component: 'Button',
        styles: [
          {
            target: 'root',
            variant: 'primary',
            active: true,
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });

  it('should parse active state with variants', () => {
    const source = `
  /**
   * @component Button
   * @props fullWidth | loading | leftSection | rightSection
   * 
   * @target root @variant primary @active [ text-2xl font-bold rounded-md ]
   */
  `;

    expect(parseComponentDeclarations(source)).toEqual([
      {
        component: 'Button',
        props: ['fullWidth', 'loading', 'leftSection', 'rightSection'],
        styles: [
          {
            target: 'root',
            variant: 'primary',
            active: true,
            classNames: ['text-2xl', 'font-bold', 'rounded-md'],
          },
        ],
      },
    ]);
  });
});
