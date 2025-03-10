import { Button, createTheme } from '@mantine/core';

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        size: 'sm',
      },
      classNames: {
        /**
         * @component Button
         * @props loading
         *
         * @target root [ rounded-md ]
         *
         * @target root @size sm [ h-[38px] ]
         * @target root @size md [ h-[44px] ]
         * @target root @size lg [ h-[50px] ]
         * @target root @size xl [ h-[56px] ]
         *
         * @target root @variant primary [ bg-red-500 hover:bg-red-900 focus:outline-none focus-within:ring-2 focus-within:ring-yellow-500 ]
         */
      },
    }),
  },
});

export default theme;
