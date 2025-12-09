import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unicornPlugin from "eslint-plugin-unicorn";

export const baseConfig = defineConfig(
  // Global ignores must be in their own config object
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/.next/**",
      "**/build/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
    },
    rules: {
      // TypeScript strict rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],

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
  // Allow default exports in config files
  {
    files: ["**/*.config.{js,ts,mjs,mts,cjs,cts}"],
    rules: {
      "import/no-default-export": "off",
    },
  },
);
