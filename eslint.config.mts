import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'eslint.config.mjs',
			'./*.ts',
			'./*.mjs',
			'./*.js',
			'./*.mts',
			'./node_modules/*',
			'./public/*',
			'./.next/*',
			'./.husky/*',
			'./marscode/*',
			'./.qodo/*',
			'./src/components/ui/*',
			'./src/server-mock/server.js',
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: 'module',
			ecmaVersion: 'latest',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		// extends: ['next', 'prettier'],
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-misused-promises': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
		},
	},
);