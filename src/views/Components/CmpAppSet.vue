<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useMainStore, useSecureStore } from "@/AppState";

import DynamicDialog from "primevue/dynamicdialog";

const main = useMainStore();

onBeforeMount(() => {
    main.init();
});
</script>

<template>
    <DynamicDialog />
</template>
