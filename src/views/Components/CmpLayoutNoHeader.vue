<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import CmpFooter from "./CmpFooter.vue";
import CmpToast from "./CmpToast.vue";
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true" :scroll-y="true">
            <div class="flex h-full">
                <div class="content-child-container-center my-auto">
                    <CmpToast ref="toastchild" />
                    <slot />
                    <CmpFooter />
                </div>
            </div>
        </IonContent>
    </IonPage>
</template>
