import { Button, createTheme } from '@mantine/core';

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        size: 'sm',
      },
      classNames: {
  "root": "rounded-md [&[data-size='sm']]:h-[38px] [&[data-size='md']]:h-[44px] [&[data-size='lg']]:h-[50px] [&[data-size='xl']]:h-[56px] [&[data-variant='primary']]:bg-red-500 [&[data-variant='primary']]:hover:bg-red-900 [&[data-variant='primary']]:focus:outline-none [&[data-variant='primary']]:focus-within:ring-2 [&[data-variant='primary']]:focus-within:ring-gray-500"
},
    }),
  },
});

export default theme;
