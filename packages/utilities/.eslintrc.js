module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.,
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module'
  },
  ignorePatterns: [
    '/lib/**/*' // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/no-unresolved': 0,
    indent: ['error', 2],
    'comma-dangle': [1, 'never'],
    eqeqeq: [2, 'always'],
    'max-len': [1, { code: 100, tabWidth: 2, ignoreComments: true, ignoreTemplateLiterals: true }],
    'no-empty': [1, { allowEmptyCatch: true }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': [1, { ignoreRestArgs: true }],
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-unused-vars': [1, { varsIgnorePattern: '^_' }],
    'no-trailing-spaces': 1,
    'sort-imports': [
      0,
      {
        allowSeparatedGroups: true,
        ignoreCase: true,
        memberSyntaxSortOrder: ['multiple', 'single', 'none', 'all']
      }
    ],
    radix: 0,
    'import/no-unresolved': [
      2,
      {
        ignore: ['\\.svg$', '\\.png$', '\\.jpg$']
      }
    ],
    'import/order': [
      1,
      {
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index'],
          'object',
          'type'
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true
        },
        warnOnUnassignedImports: true
      }
    ]
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // // use <root>/path/to/folder/tsconfig.json
        // project: 'path/to/folder',

        // // Multiple tsconfigs (Useful for monorepos)

        // // use a glob pattern
        // project: 'packages/*/tsconfig.json',

        // // use an array
        // project: ['packages/module-a/tsconfig.json', 'packages/module-b/tsconfig.json'],

        // // use an array of glob patterns
        // project: ['packages/*/tsconfig.json', 'other-packages/*/tsconfig.json']
      }
    }
  }
}
