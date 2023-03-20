<script setup lang="ts">
import {
    IonApp,
    IonRouterOutlet,
    useBackButton,
    useIonRouter,
} from "@ionic/vue";
import { App } from "@capacitor/app";

import CmpAppSet from "./views/Components/CmpAppSet.vue";

const ionRouter = useIonRouter();

useBackButton(-1, () => {
    if (!ionRouter.canGoBack()) {
        App.exitApp();
    }
});
</script>

<template>
    <IonApp>
        <CmpAppSet />
        <IonRouterOutlet />
    </IonApp>
</template>
