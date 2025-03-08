# Mantine Tailwind Generator

A utility package that bridges Mantine UI and Tailwind CSS, making them work seamlessly together with less-efforts.

## Features

- Define component styles using JSDoc-like comments
- Vite plugin for automatic theme generation
- More comming...

## Installation

```bash
npm install @mantine-tailwind-utils/generator
```

## Usage

### Vite Plugin

Add the plugin to your `vite.config.js` or `vite.config.ts`:

```javascript
import { defineConfig } from 'vite';
import { mantineTailwindThemePlugin } from '@mantine-tailwind-utils/generator';
import tailwindcss from '@tailwindcss/vite';
// other imports...

export default defineConfig({
  plugins: [
    mantineTailwindThemePlugin({
      themePath: './app/styles/theme.ts',
      outputPath: './app/styles/theme.gen.ts',
    }),
    tailwindcss(),
    // other plugins...
  ],
});
```

### Configuration Options

The `mantineTailwindThemePlugin` accepts the following options:

- `themePath`: Path to your Mantine theme configuration file
- `outputPath`: Path where the generated Tailwind-compatible theme will be saved

### Tailwind Configuration

In your `tailwind.config.js`, you can use the generated theme:

```javascript
import { theme } from './app/styles/theme.gen.ts';

export default {
  // Your Tailwind configuration
  theme: {
    extend: {
      colors: theme.colors,
      // Other theme extensions
    },
  },
  // Rest of your Tailwind config
};
```

## Development

This project uses [Nx](https://nx.dev) as a build system.

### Building

```bash
nx build generator
```

### Running Tests

```bash
nx test generator
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
