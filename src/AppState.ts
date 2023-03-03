import { defineStore } from "pinia";

type webRoute = {
    landingPage: string;
};

export const landingPage = "/";

export const useWebStore = defineStore<string, webRoute>("web", {
    state: () => ({
        /** Define route here because if not defined and get from XHR it will be race condition */
        /** WEB requests */
        landingPage: landingPage,
    }),
});

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
        postTokenLogin: "/api/post-token",
        postTokeonLogout: "/api/post-token-revoke",
        postProfile: "/api/post-update-profile",
        appConst: "/api/post-app-const",
        getAllUserPermission: "/api/get-all-user-permission",
        logAgent: "/api/post-log-agent",
        getServerLogs: "/api/get-server-logs",
        getUserList: "/api/get-user-list",
    }),
});

type permissionsDataTypes = string;

type mainStore = {
    browserSuppport: boolean;
    permissionsData: Array<permissionsDataTypes>;
};

export const useMainStore = defineStore<string, mainStore>("main", {
    state: () => ({
        /** Additional data */
        browserSuppport: true,
        permissionsData: Array<permissionsDataTypes>(),
    }),
});
