import { useSecureStore } from "./AppState";
import type { NavigationGuard } from "vue-router";
import { landingPage, dashboardPage } from "./AppRouter";

export const authGuard: NavigationGuard = async (to, from, next) => {
    const secure = useSecureStore();
    const isAuth = await secure.isAuth();

    if (isAuth) {
        next();
    } else {
        next(landingPage);
    }
};

export const guestGuard: NavigationGuard = async (to, from, next) => {
    const secure = useSecureStore();
    const isAuth = await secure.isAuth();

    if (!isAuth) {
        next();
    } else {
        next(dashboardPage);
    }
};
