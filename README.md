# TypeScript Project

A modern TypeScript project template with strict type checking and best practices.

## Prerequisites

- Node.js (v14 or later)
- npm (v7 or later) or yarn

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Build the project**

```bash
npm run build
```

3. **Run the application**

```bash
npm start
```

## Development

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Build and run the application
- `npm test` - Run tests (configure your test framework as needed)

## Project Structure

```
.
├── src/                    # Source files
│   └── index.ts            # Entry point
├── dist/                   # Compiled output (generated)
├── node_modules/           # Dependencies (generated)
├── .gitignore             # Git ignore file
├── package.json            # Project configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## TypeScript Configuration

This project uses strict TypeScript configuration with the following key settings:

- Target: ES2020
- Module: CommonJS
- Strict mode: Enabled
- Source maps: Enabled
- Declaration files: Enabled

## License

MIT
