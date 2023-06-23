<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CmpHeader from "./CmpHeader.vue";
import CmpFooter from "./CmpFooter.vue";
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true" :scroll-y="true">
            <div class="flex flex-col h-full">
                <CmpHeader />

                <div class="content-child-container-center my-auto">
                    <slot />
                    <CmpFooter />
                </div>
            </div>
        </IonContent>
    </IonPage>
</template>
