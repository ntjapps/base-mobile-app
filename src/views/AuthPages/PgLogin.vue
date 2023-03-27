<script setup lang="ts">
import axios from "axios";

import { ref, defineProps } from "vue";
import { Capacitor } from "@capacitor/core";
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import { useApiStore, useMainStore, useSecureStore } from "@/AppState";
import { useWebStore } from "@/AppRouter";
import { useError } from "@/AppAxiosResp";

import CmpTurnstile from "../Components/CmpTurnstile.vue";

import ButtonVue from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import ProgressSpinner from "primevue/progressspinner";

const web = useWebStore();
const api = useApiStore();
const main = useMainStore();
const secure = useSecureStore();
const router = useRouter();

const props = defineProps({
    appName: {
        type: String,
        required: false,
        default: import.meta.env.VITE_APP_NAME,
    },
});

const username = ref("");
const password = ref("");
const loading = ref(false);
const turnchild = ref<typeof CmpTurnstile>();

const postLogindata = () => {
    loading.value = true;
    let tokenData = Capacitor.isNativePlatform()
        ? import.meta.env.VITE_CHALLENGE_MOBILE_KEY
        : main.turnstileToken;
    axios
        .post(api.postTokenLogin, {
            username: username.value,
            password: password.value,
            token: tokenData,
            device_name: main.deviceName,
        })
        .then((response) => {
            clearData();
            if (response.data.status === "success") {
                secure.$patch({
                    apiToken: response.data.access_token,
                });
            }
        })
        .then(() => {
            router.push(web.dashboardPage);
        })
        .catch((error) => {
            loading.value = false;
            useError(error);
            secure.$patch({
                apiToken: "",
            });
            turnchild.value?.resetTurnstile();
        });
};

const clearData = () => {
    turnchild.value?.resetTurnstile();
    username.value = "";
    password.value = "";
};
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <div
                class="grid content-center w-full min-h-full max-h-full bg-slate-200 object-fill bg-no-repeat bg-cover bg-center"
            >
                <div class="flex justify-center">
                    <div
                        v-show="!loading"
                        class="bg-white rounded-lg drop-shadow-lg"
                    >
                        <div class="m-auto p-5">
                            <div class="text-center font-bold my-2.5">
                                {{ props.appName }}
                            </div>
                            <div
                                v-if="!main.browserSuppport"
                                class="text-center font-bold my-2.5"
                            >
                                <ButtonVue
                                    class="p-button-sm p-button-danger"
                                    label="Browser Unsupported"
                                />
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
                                            type="text"
                                            class="text-center w-full"
                                            @keyup.enter="postLogindata"
                                        />
                                        <label class="w-full" for="username"
                                            >Username</label
                                        >
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
                                            type="text"
                                            class="w-full"
                                            input-class="w-full text-center"
                                            :feedback="false"
                                            @keyup.enter="postLogindata"
                                        />
                                        <label class="w-full" for="password"
                                            >Password</label
                                        >
                                    </span>
                                </div>
                            </div>
                            <div class="flex justify-center py-2.5">
                                <CmpTurnstile ref="turnchild" />
                            </div>
                            <div class="flex justify-center py-2.5">
                                <ButtonVue
                                    class="p-button-primary p-button-sm"
                                    label="Login"
                                    @click="postLogindata"
                                />
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
                            <div class="text-center font-bold my-2.5">
                                Loading
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </IonContent>
    </IonPage>
</template>
