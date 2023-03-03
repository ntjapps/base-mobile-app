import "@/ts/bootstrap";
import { createApp, App } from "vue";
import { createPinia, Pinia } from "pinia";
const pinia: Pinia = createPinia();
import PrimeVue from "primevue/config";

import { IonicVue } from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/** Application spec css */
import "@/css/app.scss";

/** Vue router needed for navigation menu */
import router from "./router";
import BaseApp from "./BaseApp.vue";

/** Primevue Globals */
import DialogService from "primevue/dialogservice";

// Mount Application Instances
const MainApp: App<Element> = createApp(BaseApp)
    .use(IonicVue)
    .use(router)
    .use(pinia)
    .use(PrimeVue)
    .use(DialogService);

/** Global Composenent / Page Registration */
import CmpAppSet from "@/views/Components/CmpAppSet.vue";
MainApp.component("CmpAppSet", CmpAppSet);

router.isReady().then(() => {
    MainApp.mount("#app");
});
