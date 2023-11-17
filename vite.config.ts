/// <reference types="vitest" />
import { defineConfig, splitVendorChunkPlugin } from "vite";
import { configDefaults } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    server: {
        host: true /* Expose to all IP */,
        hmr: {
            host: "docker.localhost" /* Set base URL for Hot Module Reload */,
        },
    },
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        splitVendorChunkPlugin(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            vue: "vue/dist/vue.esm-bundler.js",
        },
    },
    build: {
        rollupOptions: {
            output: {
                compact: true,
            },
        },
    },
    test: {
        environment: "happy-dom",
        exclude: [...configDefaults.exclude],
    },
});
