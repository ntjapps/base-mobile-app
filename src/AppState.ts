import axios from "axios";
import Echo from "laravel-echo";
import { defineStore } from "pinia";
import { supportedBrowsers } from "@/ts/browser";
import { MenuItem } from "primevue/menuitem";
import { useLocalStorage } from "@vueuse/core";
import { Device } from "@capacitor/device";

export const useApiStore = defineStore("api", {
    state: () => ({
        /** API request */
        postTokenLogin: import.meta.env.VITE_API_ENDPOINT + "/api/post-token",
        postTokenLogout:
            import.meta.env.VITE_API_ENDPOINT + "/api/post-token-revoke",
        postProfile:
            import.meta.env.VITE_API_ENDPOINT + "/api/post-update-profile",
        appConst: import.meta.env.VITE_API_ENDPOINT + "/api/post-app-const",
        getAllUserPermission:
            import.meta.env.VITE_API_ENDPOINT + "/api/get-all-user-permission",
        logAgent: import.meta.env.VITE_API_ENDPOINT + "/api/post-log-agent",
        getServerLogs:
            import.meta.env.VITE_API_ENDPOINT + "/api/get-server-logs",
        getUserList: import.meta.env.VITE_API_ENDPOINT + "/api/get-user-list",
    }),
});

interface MenuItemExtended extends MenuItem {
    key: string;
    label: string;
    icon?: string;
    url?: string;
    command?: () => void;
    items?: Array<MenuItemExtended>;
}

export const useMainStore = defineStore("main", {
    state: () => ({
        /** Additional data */
        appName: import.meta.env.VITE_APP_NAME,
        appVersion: import.meta.env.VITE_APP_VERSION,
        appBypassUpdate:
            import.meta.env.VITE_APP_BYPASS_UPDATE == true ? true : false,
        userName: "",
        userId: "",
        browserSuppport: true,
        menuItems: Array<MenuItemExtended>(),
        deviceId: "",
        deviceName: "",
        deviceModel: "",
        devicePlatform: "",
        turnstileToken: "",
    }),

    actions: {
        /** Get Constant */
        init() {
            const api = useApiStore();
            axios
                .post(api.appConst)
                .then((response) => {
                    this.$patch({
                        appName: response.data.appName,
                    });
                    this.$patch({
                        userName: response.data.userName,
                    });
                    this.$patch({
                        menuItems: JSON.parse(response.data.menuItems),
                    });
                })
                .catch((error) => {
                    console.error(error.response.data);
                });
        },

        browserSuppportCheck() {
            const api = useApiStore();
            /**
             * Test if browser is compatible
             */
            if (!supportedBrowsers.test(navigator.userAgent)) {
                this.$patch({ browserSuppport: false });
                axios.post(api.logAgent);
            } else {
                this.$patch({ browserSuppport: true });
            }
        },

        async spaCsrfToken() {
            /**
             * Get new CSRF Token set everytime app is created
             */
            axios
                .get(import.meta.env.VITE_API_ENDPOINT + "/sanctum/csrf-cookie")
                .then(() => {
                    console.log("csrf cookie init");
                });
        },

        async deviceIdGet(): Promise<string> {
            /**
             * Get device id
             */
            const info = await Device.getId();
            this.$patch({ deviceId: info.identifier });
            return info.identifier;
        },

        async deviceNameGet(): Promise<Array<string>> {
            /**
             * Get device name
             */
            const info = await Device.getInfo();
            if (typeof info.name === "undefined") {
                info.name = "Frontend Base App";
            }
            this.$patch({ deviceName: info.name });
            this.$patch({ deviceModel: info.model });
            this.$patch({ devicePlatform: info.platform });

            return [info.name, info.model, info.platform];
        },
    },
});

export const useEchoStore = defineStore("echo", {
    state: () => ({
        laravelEcho: new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? "mt1",
            wsHost: import.meta.env.VITE_PUSHER_HOST
                ? import.meta.env.VITE_PUSHER_HOST
                : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
            wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
            wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
            forceTLS:
                (import.meta.env.VITE_PUSHER_SCHEME ?? "https") === "https",
            enabledTransports: ["ws", "wss"],
            authEndpoint:
                import.meta.env.VITE_API_ENDPOINT + "/api/broadcasting/auth",
            auth: {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${useSecureStore().apiToken}`,
                },
            },
        }),
    }),
});

export const useSecureStore = defineStore("secure", {
    state: () => {
        return {
            apiToken: useLocalStorage("apiToken", ""),
        };
    },

    actions: {
        async isAuth() {
            const api = useApiStore();
            const main = useMainStore();
            let result = false;

            if (localStorage.getItem("apiToken") !== "") {
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${localStorage.getItem("apiToken")}`;
            } else {
                axios.defaults.headers.common["Authorization"] = `Bearer`;
                return false;
            }

            await main.spaCsrfToken();
            await axios
                .post(api.appConst)
                .then((response) => {
                    result = response.data.isAuth;
                    if (!result) {
                        this.$patch({
                            apiToken: "",
                        });
                    }
                })
                .catch(() => {
                    result = false;
                    this.$patch({
                        apiToken: "",
                    });
                });
            return result;
        },
    },
});
