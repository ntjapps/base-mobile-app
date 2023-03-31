<script setup lang="ts">
import { onMounted } from "vue";
import { useMainStore } from "@/AppState";

import DynamicDialog from "primevue/dynamicdialog";

const main = useMainStore();

onMounted(() => {
    main.init();
});
</script>

<template>
    <DynamicDialog />
</template>
