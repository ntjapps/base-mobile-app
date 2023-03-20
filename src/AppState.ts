import { Preferences } from "@capacitor/preferences";
import { defineStore } from "pinia";

type apiRoute = {
    postTokenLogin: string;
    postTokeonLogout: string;
    postProfile: string;
    appConst: string;
    getAllUserPermission: string;
    logAgent: string;
    getServerLogs: string;
    getUserList: string;
};

export const useApiStore = defineStore<string, apiRoute>("api", {
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

type permissionsDataTypes = string;

type mainStore = {
    browserSuppport: boolean;
    permissionsData: Array<permissionsDataTypes>;
    appName: string;
    deviceName: string;
    turnstileToken: string;
};

export const useMainStore = defineStore<string, mainStore>("main", {
    state: () => ({
        /** Additional data */
        browserSuppport: true,
        permissionsData: Array<permissionsDataTypes>(),
        appName: "Base App",
        deviceName: "Frontend Base App",
        turnstileToken: "",
    }),
});

type secureStore = {
    apiToken: string;
};

export const useSecureStore = defineStore<string, secureStore>("secure", {
    state: () => {
        return {
            apiToken: "",
        };
    },
});
