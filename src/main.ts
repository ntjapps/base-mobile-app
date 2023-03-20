import "@/ts/bootstrap";
import { createApp, App, watch } from "vue";
import { createPinia, Pinia } from "pinia";
const pinia: Pinia = createPinia();
import PrimeVue from "primevue/config";

import { IonicVue } from "@ionic/vue";
import { Preferences } from "@capacitor/preferences";

/** Vue router needed for navigation menu */
import router from "./AppRouter";
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

watch(
    pinia.state,
    (state) => {
        Preferences.set({
            key: "secureStore",
            value: JSON.stringify(state.secure),
        });
    },
    { deep: true }
);

/** Global Composenent / Page Registration */
import CmpAppSet from "@/views/Components/CmpAppSet.vue";
MainApp.component("CmpAppSet", CmpAppSet);

router.isReady().then(() => {
    MainApp.mount("#app");
});
