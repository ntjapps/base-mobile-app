module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-recommended",
        "plugin:prettier/recommended",
        "eslint:recommended",
        "@vue/typescript/recommended",
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        parser: "@typescript-eslint/parser",
    },
    env: {
        node: true,
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "vue/no-deprecated-slot-attribute": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)",
                "**/tests/unit/**/*.spec.{j,t}s?(x)",
            ],
            env: {
                jest: true,
            },
        },
    ],
};
