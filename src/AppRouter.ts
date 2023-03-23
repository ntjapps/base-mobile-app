export const landingPage = "/";
export const dashboardPage = "/dashboard";
export const editProfilePage = "/edit-profile";

import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { defineStore } from "pinia";
import { authGuard, guestGuard } from "./AppGuard";

const routes: Array<RouteRecordRaw> = [
    {
        path: landingPage,
        name: "Landing Page",
        component: () => import("@/views/AuthPages/PgLogin.vue"),
        meta: { requiresGuest: true },
    },
    {
        path: dashboardPage,
        name: "Dashboard",
        component: () => import("@/views/DashboardPages/PgDashboard.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: editProfilePage,
        name: "Edit Profile",
        component: () => import("@/views/DashboardPages/PgProfile.vue"),
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        authGuard(to, from, next);
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
        guestGuard(to, from, next);
    } else {
        next();
    }
});

export const useWebStore = defineStore("web", {
    state: () => ({
        /** Define route here because if not defined and get from XHR it will be race condition */
        /** WEB requests */
        landingPage: landingPage,
        dashboardPage: dashboardPage,
        editProfilePage: editProfilePage,
    }),
});

export default router;
