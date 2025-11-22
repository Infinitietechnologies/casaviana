import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Plugin + rules to catch missing/unresolved imports.
  {
    plugins: ["import"],
    rules: {
      // Treat unresolved imports as errors.
      "import/no-unresolved": ["error", { commonjs: true, caseSensitive: false }],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
        }
      }
    }
  }
]);

export default eslintConfig;
