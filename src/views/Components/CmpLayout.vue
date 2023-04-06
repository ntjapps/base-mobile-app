<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CmpHeader from "./CmpHeader.vue";
import CmpFooter from "./CmpFooter.vue";
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <div class="content-container bg-slate-200">
                <CmpHeader />
                <div class="content-child-container">
                    <slot />
                </div>
                <CmpFooter />
            </div>
        </IonContent>
    </IonPage>
</template>
