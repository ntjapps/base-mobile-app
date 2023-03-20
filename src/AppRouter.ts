const landingPage = "/";
const dashboardPage = "/dashboard";

import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";

const routes: Array<RouteRecordRaw> = [
    {
        path: landingPage,
        name: "Landing Page",
        component: () => import("@/views/AuthPages/PgLogin.vue"),
    },
    {
        path: dashboardPage,
        name: "Dashboard",
        component: () => import("@/views/DashboardPages/PgDashboard.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

type webRoute = {
    landingPage: string;
    dashboardPage: string;
};

export const useWebStore = defineStore<string, webRoute>("web", {
    state: () => ({
        /** Define route here because if not defined and get from XHR it will be race condition */
        /** WEB requests */
        landingPage: landingPage,
        dashboardPage: dashboardPage,
    }),
});

export default router;
