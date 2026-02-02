//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
}

export default config
