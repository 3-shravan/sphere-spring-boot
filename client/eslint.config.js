import js from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import unicorn from "eslint-plugin-unicorn"
import globals from "globals"

export default [
  { ignores: ["dist", "dev-dist", "node_modules"] },
  // ---------------- JS ----------------
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      unicorn,
    },
    rules: {
      ...js.configs.recommended.rules,
      "unicorn/filename-case": [
        "warn",
        {
          cases: {
            kebabCase: true,
            pascalCase: false,
          },
        },
      ],
    },
  },

  // ---------------- JSX ----------------
  {
    files: ["**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      unicorn,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      "unicorn/filename-case": [
        "error",
        {
          cases: {
            pascalCase: true,
          },
        },
      ],

      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/prop-types": "off",
      "react/no-unknown-property": ["error", { ignore: ["svg"] }],
    },
  },

  // ---------------- TS ----------------
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      unicorn,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      "unicorn/filename-case": ["error", { cases: { camelCase: false, kebabCase: true } }],
    },
  },

  // ---------------- TSX ----------------
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      "@typescript-eslint": tsPlugin,
      unicorn,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      "unicorn/filename-case": ["error", { cases: { pascalCase: true } }],
    },
  },

  // ---------------- HOOKS (JS/TS) ----------------
  {
    files: ["**/use*.{js,jsx,ts,tsx}"],
    rules: {
      "unicorn/filename-case": ["error", { case: "camelCase" }],
    },
  },

  // ---------------- index files ----------------
  {
    files: ["**/index.{js,jsx,ts,tsx}"],
    rules: {
      "unicorn/filename-case": "off",
    },
  },
]
