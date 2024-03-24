import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

const config: CapacitorConfig = {
    appId: "com.ntj125app.base-mobile",
    appName: "base-mobile-app",
    server: {
        hostname: "base-mobile-app.localhost",
    },
    webDir: "dist",
    bundledWebRuntime: false,
    plugins: {
        Keyboard: {
            resize: KeyboardResize.None,
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
    },
};

export default config;
