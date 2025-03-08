import { describe, it, expect } from 'vitest';
import { processThemeContent } from '../core/process-theme-content.js';

const sources = [
  `
import { Button, createTheme } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: {
        /**
         * @component Button
         *
         * @target root @variant primary [ bg-red-800 text-lg ]
         * @target root @variant primary @size xl [ bg-blue-500 text-2xl ]
         */
      },
    }),
  },
});

export default theme;
`,
  `
import { Button, createTheme, Text } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: {
        /**
         * @component Button
         *
         * @target root @variant primary [ bg-red-800 text-lg ]
         * @target root @variant primary @size xl [ bg-blue-500 text-2xl ]
         */
      },
    }),
    Text: Text.extend({
      classNames: {
        /**
         * @component Text
         *
         * @target root @size sm [ text-12px ]
         */
      },
    }),
  },
});

export default theme;
`,
  `
import { Anchor, Button, createTheme, Text } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: {
        /**
         * @component Button
         *
         * @target root @variant primary [ bg-red-800 text-lg ]
         * @target root @variant primary @size xl [ bg-blue-500 text-2xl ]
         */
      },
    }),
    Text: Text.extend({
      classNames: {
        /**
         * @component Text
         *
         * @target root @size sm [ text-12px ]
         */
      },
    }),
    Anchor: Anchor.extend({
      classNames: {
        root: "my-custom-class",
      },
    }),
  },
});

export default theme;
`,
];

const expected = [
  `
import { Button, createTheme } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: {
  "root": "[&[data-variant='primary']]:bg-red-800 [&[data-variant='primary']]:text-lg [&[data-variant='primary']&&[data-size='xl']]:bg-blue-500 [&[data-variant='primary']&&[data-size='xl']]:text-2xl"
},
    }),
  },
});

export default theme;
`,
  `
import { Button, createTheme, Text } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: {
  "root": "[&[data-variant='primary']]:bg-red-800 [&[data-variant='primary']]:text-lg [&[data-variant='primary']&&[data-size='xl']]:bg-blue-500 [&[data-variant='primary']&&[data-size='xl']]:text-2xl"
},
    }),
    Text: Text.extend({
      classNames: {
  "root": "[&[data-size='sm']]:text-12px"
},
    }),
  },
});

export default theme;
`,
  `
import { Anchor, Button, createTheme, Text } from "@mantine/core";

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: {
  "root": "[&[data-variant='primary']]:bg-red-800 [&[data-variant='primary']]:text-lg [&[data-variant='primary']&&[data-size='xl']]:bg-blue-500 [&[data-variant='primary']&&[data-size='xl']]:text-2xl"
},
    }),
    Text: Text.extend({
      classNames: {
  "root": "[&[data-size='sm']]:text-12px"
},
    }),
    Anchor: Anchor.extend({
      classNames: {
        root: "my-custom-class",
      },
    }),
  },
});

export default theme;
`,
];

describe('processThemeContent', () => {
  it('should process the theme content', () => {
    const result = processThemeContent(sources[0]!);
    expect(result).toBe(expected[0]!);
  });

  it('should process the theme content with multiple components', () => {
    const result = processThemeContent(sources[1]!);
    expect(result).toBe(expected[1]!);
  });
});
