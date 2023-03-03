<script setup lang="ts">
import { ref, defineProps } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useMainStore, useApiStore } from "@/AppState";
import axios from "axios";
import { useResponse, useError } from "@/AppAxiosResp";

import ButtonVue from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";

const api = useApiStore();
const main = useMainStore();

const props = defineProps({
    appName: {
        type: String,
        required: true,
    },
});

const username = ref("");
const password = ref("");

const postLogindata = () => {
    axios
        .post(api.postTokenLogin, {
            username: username.value,
            password: password.value,
        })
        .then((response) => {
            clearData();
            useResponse(response);
        })
        .catch((error) => {
            useError(error);
        });
};

const clearData = () => {
    username.value = "";
    password.value = "";
};
</script>

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <div class="grid content-center w-screen h-screen bg-picture">
                <div class="flex justify-center">
                    <div class="bg-white rounded-lg drop-shadow-lg">
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
                                            input-class="text-center"
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
                                <ButtonVue
                                    class="p-button-primary p-button-sm"
                                    label="Login"
                                    @click="postLogindata"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </IonContent>
    </IonPage>
</template>
