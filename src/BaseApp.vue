<script setup lang="ts">
import {
    IonApp,
    IonRouterOutlet,
    useBackButton,
    useIonRouter,
} from "@ionic/vue";
import { ref, onBeforeMount, onMounted } from "vue";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";

import CmpAppSet from "./views/Components/CmpAppSet.vue";

const ionRouter = useIonRouter();
const appShow = ref(false);

const showSplashScreen = async () => {
    await SplashScreen.show({
        autoHide: true,
        showDuration: 2000,
        fadeInDuration: 0,
    });
};

useBackButton(-1, () => {
    if (!ionRouter.canGoBack()) {
        App.exitApp();
    }
});

onBeforeMount(() => {
    if (Capacitor.isNativePlatform()) {
        showSplashScreen();
    }
});

onMounted(() => {
    appShow.value = true;
});
</script>

<template>
    <IonApp v-show="appShow">
        <CmpAppSet />
        <IonRouterOutlet />
    </IonApp>
</template>
