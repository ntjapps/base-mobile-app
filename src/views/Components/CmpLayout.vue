<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CmpHeader from "./CmpHeader.vue";
import CmpFooter from "./CmpFooter.vue";
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <CmpHeader />
            <div
                class="flex flex-col min-h-content -my-0.5 content-start bg-slate-200"
            >
                <slot />
            </div>
            <CmpFooter />
        </IonContent>
    </IonPage>
</template>
