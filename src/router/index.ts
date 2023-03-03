import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

import { landingPage } from "@/AppState";

const routes: Array<RouteRecordRaw> = [
    {
        path: landingPage,
        name: "Landing Page",
        component: () => import("@/views/AuthPages/PgLogin.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
