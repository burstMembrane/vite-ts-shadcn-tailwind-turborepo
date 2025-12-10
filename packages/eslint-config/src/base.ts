import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";
import prettierConfig from "eslint-config-prettier";

export const baseConfig = defineConfig(
  // Global ignores must be in their own config object
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/.next/**",
      "**/build/**",
      "**/*.config.{js,ts,mjs,mts,cjs,cts}",
      "**/eslint.config.{js,ts,mjs,mts,cjs,cts}",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          projectService: true,
        },
      },
    },
    rules: {
      // TypeScript strict rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],

      // Import rules
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-default-export": "error",

      // Code style rules
      "arrow-body-style": ["error", "as-needed"],
      "no-return-await": ["error"],
      "object-shorthand": ["error"],
      "no-unneeded-ternary": ["error"],
      "prefer-template": ["error"],
      "no-empty": ["error", { allowEmptyCatch: true }],

      // Unicorn rules
      "unicorn/filename-case": [
        "error",
        { cases: { camelCase: true, pascalCase: true, kebabCase: true } },
      ],

      // Disabled rules
      "@typescript-eslint/no-namespace": "off",
    },
  },
  // Allow default exports in TypeScript declaration files (ambient module declarations)
  {
    files: ["**/*.d.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  // Disable type-aware rules for JavaScript files
  {
    ...tseslint.configs.disableTypeChecked,
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
  },
  // Disable ESLint rules that conflict with Prettier (must be last)
  prettierConfig
);
