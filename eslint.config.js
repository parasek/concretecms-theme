import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier/flat";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        ignores: ["dist/**", "build/**"],
    },
];
