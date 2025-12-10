import { defineConfig } from "eslint/config";
import { baseConfig } from "./base.ts";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
export const reactConfig = defineConfig(
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  pluginJsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        React: true,
        JSX: true,
      },
    },
    settings: {
      react: {
        version: "19.0.0",
      },
    },
    rules: {
      // React specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/anchor-is-valid": "off",
    },
  }
);
