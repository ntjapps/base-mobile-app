<script setup lang="ts">
import axios from "axios";
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { IonContent, IonPage } from "@ionic/vue";
import { useWebStore } from "@/AppRouter";
import { useSecureStore } from "@/AppState";
import CmpToast from "../Components/CmpToast.vue";

const web = useWebStore();
const secure = useSecureStore();
const router = useRouter();
const toastchild = ref<typeof CmpToast>();

const logoutFunction = async () => {
    await axios
        .post(import.meta.env.VITE_API_ENDPOINT + "/api/post-token-revoke")
        .then(() => {
            router.replace(web.landingPage);
            secure.$patch({
                apiToken: "",
            });
        })
        .catch((error) => {
            toastchild.value?.toastError(error);
        });
};

onBeforeMount(() => {
    logoutFunction();
});
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <CmpToast ref="toastchild" />
        </IonContent>
    </IonPage>
</template>
