//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    ignores: ['src/features/shared/components/ui/*'],
  },
  ...tanstackConfig,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
    },
  },
]

//TODO check this lint error:
/* Parsing error: ESLint was configured to run on `<tsconfigRootDir>/src/config/env.d.ts` using `parserOptions.project`: <tsconfigRootDir>/tsconfig.json
However, that TSConfig does not include this file. Either:
- Change ESLint's list of included files to not include this file
- Change that TSConfig to include this file
- Create a new TSConfig that includes this file and include it in your parserOptions.project
See the typescript-eslint docs for more info: https://tseslint.com/none-of-those-tsconfigs-include-this-file */
