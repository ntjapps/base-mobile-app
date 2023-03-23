import axios from "axios";
import { defineStore } from "pinia";
import { supportedBrowsers } from "@/ts/browser";
import { MenuItem } from "primevue/menuitem";
import { useLocalStorage } from "@vueuse/core";

export const useApiStore = defineStore("api", {
    state: () => ({
        /** API request */
        postTokenLogin: import.meta.env.VITE_API_ENDPOINT + "/api/post-token",
        postTokeonLogout:
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
        browserSuppport: true,
        permissionsData: Array<string>(),
        menuItems: Array<MenuItemExtended>(),
        appName: import.meta.env.VITE_APP_NAME,
        deviceName: "Frontend Base App",
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
                        menuItems: JSON.parse(response.data.menuItems),
                    });
                    /** Send response data to after init function & if user authenticated */
                    if (response.data.isAuth) {
                        this.authInit();
                    }
                })
                .catch((error) => {
                    console.error(error.response.data);
                });
        },

        authInit() {
            const api = useApiStore();
            const main = useMainStore();
            axios
                .post(api.getAllUserPermission)
                .then((response) => {
                    main.$patch({ permissionsData: response.data });
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

        spaCsrfToken() {
            /**
             * Get new CSRF Token set everytime app is created
             */
            axios.get("/sanctum/csrf-cookie").then(() => {
                console.log("csrf cookie init");
            });
        },
    },
});

export const useSecureStore = defineStore("secure", {
    state: () => {
        return {
            apiToken: useLocalStorage("apiToken", ""),
        };
    },

    getters: {
        isAuth: async (state) => {
            const api = useApiStore();
            let result = false;
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${state.apiToken}`;
            await axios
                .post(api.appConst)
                .then((response) => {
                    result = response.data.isAuth;
                })
                .catch(() => {
                    result = false;
                });
            return result;
        },
    },
});
