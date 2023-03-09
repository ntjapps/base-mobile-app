<script setup lang="ts">
import axios from "axios";
import { onBeforeMount } from "vue";
import { useError } from "@/AppAxiosResp";
import { useRouter } from "vue-router";
import { useWebStore } from "@/AppRouter";
import { useSecureStore } from "@/AppState";

const web = useWebStore();
const secure = useSecureStore();
const router = useRouter();

const logoutFunction = async () => {
    await axios
        .post(import.meta.env.VITE_API_ENDPOINT + "/api/post-token-revoke")
        .then(() => {
            router.push(web.landingPage);
            secure.$patch({
                apiToken: "",
            });
        })
        .catch((error) => {
            useError(error);
        });
};

onBeforeMount(() => {
    logoutFunction();
});
</script>

<template>
    <div></div>
</template>
