import { describe, it, expect } from 'vitest';
import { parseComponentDeclarations } from '../utils/parse-component-declarations.js';
import { generateTailwindClasses } from '../utils/generate-tailwind-classes.js';

describe('generateTailwindClasses', () => {
  it('should generate classes for empty @target line', () => {
    const source = `
    /**
     * @component Button
     * @target root [ ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe('');
  });

  it('should generate classes for a valid @target line with variant', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-variant='primary']]:text-2xl [&[data-variant='primary']]:font-bold [&[data-variant='primary']]:rounded-md"
    );
  });

  it('should generate classes with both variant and size', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-variant='primary']&&[data-size='lg']]:text-2xl [&[data-variant='primary']&&[data-size='lg']]:font-bold [&[data-variant='primary']&&[data-size='lg']]:rounded-md"
    );
  });

  it('should generate classes with only size', () => {
    const source = `
    /**
     * @component Button
     * @target root @size lg [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-size='lg']]:text-2xl [&[data-size='lg']]:font-bold [&[data-size='lg']]:rounded-md"
    );
  });

  it('should generate classes with attributes in any order', () => {
    const source = `
    /**
     * @component Button
     * @target root @size lg @variant primary [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-variant='primary']&&[data-size='lg']]:text-2xl [&[data-variant='primary']&&[data-size='lg']]:font-bold [&[data-variant='primary']&&[data-size='lg']]:rounded-md"
    );
  });

  it('should generate classes for multiple @target lines', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @size lg [ text-2xl font-bold rounded-md ]
     * @target root @variant secondary @size sm [ text-lg font-bold rounded-md ]
     * @target root @variant tertiary [ bg-red-100 ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-variant='primary']&&[data-size='lg']]:text-2xl [&[data-variant='primary']&&[data-size='lg']]:font-bold [&[data-variant='primary']&&[data-size='lg']]:rounded-md " +
        "[&[data-variant='secondary']&&[data-size='sm']]:text-lg [&[data-variant='secondary']&&[data-size='sm']]:font-bold [&[data-variant='secondary']&&[data-size='sm']]:rounded-md " +
        "[&[data-variant='tertiary']]:bg-red-100"
    );
  });

  it('should generate classes with disabled state', () => {
    const source = `
    /**
     * @component Button
     * @target root @disabled [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-disabled='true']]:text-2xl [&[data-disabled='true']]:font-bold [&[data-disabled='true']]:rounded-md"
    );
  });

  it('should generate classes with disabled state and variants', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @disabled [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-variant='primary']&&[data-disabled='true']]:text-2xl [&[data-variant='primary']&&[data-disabled='true']]:font-bold [&[data-variant='primary']&&[data-disabled='true']]:rounded-md"
    );
  });

  it('should generate classes with active state and variants', () => {
    const source = `
    /**
     * @component Button
     * @target root @variant primary @active [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe(
      "[&[data-variant='primary']&&[data-active='true']]:text-2xl [&[data-variant='primary']&&[data-active='true']]:font-bold [&[data-variant='primary']&&[data-active='true']]:rounded-md"
    );
  });

  it('should correctly generate classes with no variants and sizes', () => {
    const source = `
    /**
     * @component Button
     * @target root [ text-2xl font-bold rounded-md ]
     */
    `;
    const parsed = parseComponentDeclarations(source);
    const result = generateTailwindClasses(parsed);
    expect(result).toBe('text-2xl font-bold rounded-md');
  });
});
