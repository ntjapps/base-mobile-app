<script setup lang="ts">
import { onBeforeMount } from "vue";
import axios from "axios";
import { useMainStore, useApiStore } from "@/AppState";

import { supportedBrowsers } from "@/browser";

import DynamicDialog from "primevue/dynamicdialog";

const main = useMainStore();
const api = useApiStore();

const init = () => {
    /** Get Constant */
    axios
        .post(api.appConst)
        .then((response) => {
            /** Send response data to after init function & if user authenticated */
            if (response.data.isAuth) {
                authInit();
            }
        })
        .catch((error) => {
            console.error(error.response.data);
        });
};

const authInit = () => {
    axios
        .post(api.getAllUserPermission)
        .then((response) => {
            main.$patch({ permissionsData: response.data });
        })
        .catch((error) => {
            console.error(error.response.data);
        });
};

const logAgent = () => {
    axios.post(api.logAgent);
};

onBeforeMount(() => {
    /** Init all constant */
    init();

    /**
     * Test if browser is compatible
     */
    if (!supportedBrowsers.test(navigator.userAgent)) {
        main.$patch({ browserSuppport: false });
        logAgent();
    } else {
        main.$patch({ browserSuppport: true });
    }
});
</script>

<template>
    <DynamicDialog />
</template>
