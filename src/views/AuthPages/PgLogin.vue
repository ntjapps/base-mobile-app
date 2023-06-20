<script setup lang="ts">
import axios from "axios";

import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useApiStore, useMainStore, useSecureStore } from "@/AppState";
import { useWebStore } from "@/AppRouter";

import CmpTurnstile from "../Components/CmpTurnstile.vue";
import CmpToast from "../Components/CmpToast.vue";
import CmpLayoutNoHeader from "../Components/CmpLayoutNoHeader.vue";

import InputText from "primevue/inputtext";
import Password from "primevue/password";
import ProgressSpinner from "primevue/progressspinner";

const web = useWebStore();
const api = useApiStore();
const main = useMainStore();
const { turnstileToken, deviceId, deviceName, deviceModel, devicePlatform } =
    storeToRefs(main);

const secure = useSecureStore();
const router = useRouter();
const toastchild = ref<typeof CmpToast>();

const username = ref("");
const password = ref("");
const loading = ref(false);
const turnchild = ref<typeof CmpTurnstile>();

const postLogindata = async () => {
    loading.value = true;
    axios
        .post(api.postTokenLogin, {
            username: username.value,
            password: password.value,
            token: turnstileToken.value,
            device_id: deviceId.value,
            device_name: deviceName.value,
            device_model: deviceModel.value,
            device_platform: devicePlatform.value,
        })
        .then((response) => {
            clearData();
            if (response.data.status === "success") {
                secure.$patch({
                    apiToken: response.data.access_token,
                });
                toastchild.value?.toastSuccess("Login Successful");
            }
        })
        .then(() => {
            router.replace(web.dashboardPage);
        })
        .catch((error) => {
            loading.value = false;
            toastchild.value?.toastError(error);
            secure.$patch({
                apiToken: "",
            });
        });
    turnchild.value?.resetTurnstile();
};

const clearData = () => {
    username.value = "";
    password.value = "";
};
</script>

<template>
    <CmpLayoutNoHeader>
        <CmpToast ref="toastchild" />
        <div class="grid content-center w-full">
            <div class="flex justify-center">
                <div
                    v-show="!loading"
                    class="bg-white rounded-lg drop-shadow-lg"
                >
                    <div class="m-auto p-5">
                        <div class="text-center font-bold my-2.5">
                            {{ main.appName }}
                        </div>
                        <div
                            v-if="!main.browserSuppport"
                            class="text-center font-bold my-2.5"
                        >
                            <button class="btn btn-sm btn-error">
                                <i class="pi pi-times m-1" />
                                <span class="m-1">Browser Unsupported</span>
                            </button>
                        </div>
                        <div class="text-center font-bold my-2.5">
                            Login to your account
                        </div>
                        <div
                            class="flex justify-center flex-col mt-8 my-2.5 p-float-label"
                        >
                            <div class="w-full">
                                <span class="p-float-label w-full">
                                    <InputText
                                        id="username"
                                        v-model="username"
                                        class="text-center"
                                        @keyup.enter="postLogindata"
                                    />
                                    <label for="username">Username</label>
                                </span>
                            </div>
                        </div>
                        <div
                            class="flex justify-center flex-col mt-8 my-2.5 p-float-label"
                        >
                            <div class="w-full">
                                <span class="p-float-label w-full">
                                    <Password
                                        id="password"
                                        v-model="password"
                                        :feedback="false"
                                        class="text-center"
                                        @keyup.enter="postLogindata"
                                    />
                                    <label for="password">Password</label>
                                </span>
                            </div>
                        </div>
                        <div class="flex justify-center py-2.5">
                            <CmpTurnstile ref="turnchild" />
                        </div>
                        <div class="flex justify-center py-2.5">
                            <button
                                class="btn btn-primary"
                                @click="postLogindata"
                            >
                                <span class="m-1">Login</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    v-show="loading"
                    class="bg-white rounded-lg drop-shadow-lg"
                >
                    <div class="m-auto p-5">
                        <div class="text-center font-bold my-2.5">
                            <ProgressSpinner />
                        </div>
                        <div class="text-center font-bold my-2.5">Loading</div>
                    </div>
                </div>
            </div>
        </div>
    </CmpLayoutNoHeader>
</template>
