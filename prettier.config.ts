import { type Config } from 'prettier'

const config: Config = {
  bracketSameLine: true,
  jsxSingleQuote: true,
  objectWrap: 'collapse',
  plugins: ['prettier-plugin-tailwindcss'],
  semi: false,
  singleQuote: true,
  tailwindAttributes: ['ui'],
  tailwindFunctions: ['tw', 'cva', 'cx'],
  tailwindStylesheet: './src/index.css',
}

export default config
