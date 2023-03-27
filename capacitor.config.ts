import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const config: CapacitorConfig = {
    appId: "io.ionic.starter",
    appName: "base-mobile-app",
    webDir: "dist",
    bundledWebRuntime: false,
    server: {
        hostname: process.env.VITE_HOSTNAME,
    },
    plugins: {
        Keyboard: {
            resize: KeyboardResize.None,
        },
    },
};

export default config;
