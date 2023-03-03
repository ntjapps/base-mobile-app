<script setup lang="ts">
import { ref, computed, onBeforeMount } from "vue";
import axios from "axios";
import { useResponse, useError } from "@/AppAxiosResp";

import { useApiStore, useMainStore } from "@/AppState";

import ButtonVue from "primevue/button";
import TieredMenu from "primevue/tieredmenu";

interface MenuItem {
    label: string;
    icon?: string;
    url?: string;
    command?: () => void;
    items?: Array<MenuItem>;
}

const api = useApiStore();
const main = useMainStore();

const logoutSubmit = () => {
    axios
        .post(api.postTokeonLogout)
        .then((response) => {
            useResponse(response);
        })
        .catch((error) => {
            useError(error);
        });
};

const standardMenuItems = ref<Array<MenuItem>>([
    /** Standard Responsibility */
    {
        label: "Logout",
        icon: "pi pi-power-off",
        command: () => {
            logoutSubmit();
        },
    },
]);

const rootMenuItems = ref<Array<MenuItem>>([
    /** Permission SU */
    {
        label: "Server Systems",
        items: [],
    },
]);

const showMenu = computed(() => {
    let menu = standardMenuItems.value;

    /** Use Concat not push because we create new array / merge 2 array, not pushing object of array into existing array */
    if (main.permissionsData?.includes("root")) {
        menu = menu.concat(rootMenuItems.value);
    }

    return menu;
});

const menu = ref<TieredMenu>();

const toggleMenu = (event: Event) => {
    if (menu.value !== undefined) {
        menu.value.toggle(event);
    }
};

onBeforeMount(() => {
    /** Ticking status for pusher */
    //setInterval(() => {
    //    this.pusherState = window.Echo.connector.pusher.connection.state;
    //    let EchoStatusElement = document.getElementById("EchoStatus");
    //    if (EchoStatusElement !== null) {
    //        switch (this.pusherState) {
    //            case "connecting":
    //                EchoStatusElement.className =
    //                    "pi pi-spin pi-spinner echo-connect-loading";
    //                break;
    //            case "connected":
    //                EchoStatusElement.className =
    //                    "pi pi-circle-fill echo-connect-connected";
    //                break;
    //            case "unavailable":
    //                EchoStatusElement.className =
    //                    "pi pi-circle-fill echo-connect-failed";
    //                break;
    //            case "failed":
    //                EchoStatusElement.className =
    //                    "pi pi-circle-fill echo-connect-failed";
    //                break;
    //            case "disconnected":
    //                EchoStatusElement.className =
    //                    "pi pi-spin pi-spinner echo-connect-loading";
    //                break;
    //            default:
    //                EchoStatusElement.className =
    //                    "pi pi-spin pi-spinner echo-connect-loading";
    //        }
    //    }
    //}, 1000);
});
</script>

<template>
    <div class="sticky top-0 w-full z-50 drop-shadow-xl">
        <div class="bg-indigo-800 py-3 px-5 flex flex-row">
            <div class="flex flex-row w-full">
                <ButtonVue
                    type="button"
                    icon="pi pi-bars"
                    label="Menu"
                    class="p-button-sm"
                    @click.prevent="toggleMenu"
                />
                <TieredMenu ref="menu" :model="showMenu" :popup="true" />
            </div>

            <div class="flex flex-row-reverse w-full">
                <div
                    v-if="main.browserSuppport"
                    class="flex flex-row-reverse w-full mt-1 mb-1"
                >
                    <!--button
                        id="EchoStatus"
                        class="pi pi-spin pi-spinner echo-connect-loading"
                    ></!--button>-->
                </div>
                <div
                    v-if="!main.browserSuppport"
                    class="flex flex-row-reverse w-full mt-1 mb-1"
                >
                    <ButtonVue
                        class="p-button-sm p-button-danger"
                        label="Browser Unsupported"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
