<script setup lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from "@ionic/vue";
import { ref, onBeforeMount, onMounted } from "vue";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Toast } from "@capacitor/toast";
import { SplashScreen } from "@capacitor/splash-screen";

import CmpAppSet from "./views/Components/CmpAppSet.vue";

const ionRouter = useIonRouter();
const appShow = ref(false);
const exitFlag = ref(false);

const showSplashScreen = async () => {
    await SplashScreen.show({
        autoHide: true,
        showDuration: 1000,
        fadeInDuration: 0,
    });
};

const exitAppToast = async () => {
    if (exitFlag.value) {
        exitFlag.value = false;
        App.exitApp();
    }

    await Toast.show({
        text: "Tekan sekali lagi untuk keluar",
        duration: "short",
    });

    exitFlag.value = true;

    setTimeout(() => {
        exitFlag.value = false;
    }, 2000);
};

App.addListener("backButton", () => {
    if (ionRouter.canGoBack()) {
        ionRouter.back();
    } else if (Capacitor.isNativePlatform()) {
        exitAppToast();
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
