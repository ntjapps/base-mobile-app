import { useSecureStore } from "./AppState";
import type { NavigationGuard } from "vue-router";
import { landingPage, dashboardPage } from "./AppRouter";

export const authGuard: NavigationGuard = (to, from, next) => {
    const secure = useSecureStore();

    if (secure.isAuth) {
        next();
    } else {
        next(landingPage);
    }
};

export const guestGuard: NavigationGuard = (to, from, next) => {
    const secure = useSecureStore();

    if (!secure.isAuth) {
        next();
    } else {
        next(dashboardPage);
    }
};
