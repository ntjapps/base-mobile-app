<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CmpFooter from "./CmpFooter.vue";
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true" :scroll-y="true" class="hide-scroll-bar">
            <div class="flex flex-col min-h-full bg-color">
                <div class="content-child-container-center">
                    <slot />
                </div>
                <CmpFooter />
            </div>
        </IonContent>
    </IonPage>
</template>
