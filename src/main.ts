import "@/ts/bootstrap";
import "@/ts/scss";

import { createApp, App } from "vue";
import { createPinia, Pinia } from "pinia";
const pinia: Pinia = createPinia();
import PrimeVue from "primevue/config";

import PrimeTailwind from "./presets/custom";
import * as Sentry from "@sentry/capacitor";
import * as SentrySibling from "@sentry/vue";

import { IonicVue } from "@ionic/vue";

/** Vue router needed for navigation menu */
import router from "./AppRouter";
import BaseApp from "./BaseApp.vue";

/** Primevue Globals */
import DialogService from "primevue/dialogservice";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

/** Sentry iniitialization */
Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: process.env.npm_package_version,
    dist: "1",
    integrations: [
        new SentrySibling.BrowserTracing({
            // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost", import.meta.env.VITE_APP_HOST, import.meta.env.VITE_API_ENDPOINT],
            routingInstrumentation: SentrySibling.vueRouterInstrumentation(router),
        }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, //  Capture 10% of the transactions
    },
    SentrySibling.init,
);

// Mount Application Instances
const MainApp: App<Element> = createApp(BaseApp)
    .use(IonicVue)
    .use(router)
    .use(pinia)
    .use(PrimeVue, {
        unstyled: true,
        pt: PrimeTailwind,
        ptOptions: { mergeProps: true },
    })
    .use(DialogService)
    .use(ToastService)
    .directive("tooltip", Tooltip);

/** Global Composenent / Page Registration */
import CmpAppSet from "@/views/Components/CmpAppSet.vue";
MainApp.component("CmpAppSet", CmpAppSet);

router.isReady().then(() => {
    MainApp.mount("#app");
});
