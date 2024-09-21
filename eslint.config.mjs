import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react'; // Corrected import for CommonJS

// Extract rules if needed
const { configs: reactConfigs } = pluginReact;

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...reactConfigs.flat.recommended, // Adjusted to properly use the recommended config from react
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
