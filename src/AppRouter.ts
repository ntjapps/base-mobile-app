const landingPage = "/";

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";

const routes: Array<RouteRecordRaw> = [
    {
        path: landingPage,
        name: "Landing Page",
        component: () => import("@/views/AuthPages/LandingPg.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

type webRoute = {
    landingPage: string;
};

export const useWebStore = defineStore<string, webRoute>("web", {
    state: () => ({
        /** Define route here because if not defined and get from XHR it will be race condition */
        /** WEB requests */
        landingPage: landingPage,
    }),
});

export default router;
