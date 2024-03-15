<script setup lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true" :scroll-y="true">
            <slot />
        </IonContent>
    </IonPage>
</template>
