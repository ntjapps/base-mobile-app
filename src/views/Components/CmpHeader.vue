<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useMainStore } from "@/AppState";

import TieredMenu from "primevue/tieredmenu";

const main = useMainStore();

const menu = ref<TieredMenu>();

const toggleMenu = (event: Event) => {
    if (menu.value !== undefined) {
        menu.value.toggle(event);
    }
};

onBeforeMount(() => {
    main.init();
});
</script>

<template>
    <div class="header-container">
        <div class="bg-indigo-800 py-3 px-5 flex flex-row">
            <div class="flex flex-row w-full">
                <button class="btn" @click.prevent="toggleMenu">
                    <i class="pi pi-bars m-1" />
                    <span class="m-1">Menu</span>
                </button>
                <TieredMenu ref="menu" :model="main.menuItems" :popup="true" />
            </div>

            <div class="flex flex-row-reverse w-full">
                <div
                    v-if="main.browserSuppport"
                    class="flex flex-row-reverse w-full my-auto"
                ></div>
                <div
                    v-if="!main.browserSuppport"
                    class="flex flex-row-reverse w-full my-auto"
                >
                    <button class="btn btn-sm btn-error">
                        <i class="pi pi-times m-1" />
                        <span class="m-1">Browser Unsupported</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
