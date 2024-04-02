import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

process.env = { ...process.env, ...loadEnv("", process.cwd()) };

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
                manualChunks: {
                    vendor: [
                        "vue",
                        "vue-router",
                        "axios",
                        "pinia",
                        "pusher-js",
                    ],
                },
            },
        },
    },
});
