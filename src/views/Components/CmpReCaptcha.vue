<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose } from "vue";

const props = defineProps({
    captchaSiteKey: {
        type: String,
        required: true,
    },
});

const widgetId = ref<string | number>(0);

const emit = defineEmits(["verify"]);

const init = () => {
    if (window.grecaptcha && widgetId.value == null) {
        console.log("grecaptcha init");
        return (widgetId.value = window.grecaptcha.render("recaptcha", {
            sitekey: props.captchaSiteKey,
            badge: "inline",
            size: "invisible",
            callback: (response: unknown) => {
                emit("verify", response);
                reset();
            },
        }));
    } else {
        console.log("grecaptcha exec");
        window.grecaptcha.execute(widgetId.value);
    }
};

const reset = () => {
    window.grecaptcha.reset(widgetId.value);
};

const execute = () => {
    init();
};

defineExpose({
    execute,
    reset,
});
</script>

<template>
    <div id="recaptcha"></div>
</template>
