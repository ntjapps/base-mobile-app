<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CmpHeader from "./CmpHeader.vue";
import CmpFooter from "./CmpFooter.vue";
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <CmpHeader />
            <div class="flex flex-col min-h-fit content-start">
                <slot />
            </div>
            <CmpFooter />
        </IonContent>
    </IonPage>
</template>

<style scoped lang="scss">
@import "@/css/app.scss";
</style>
