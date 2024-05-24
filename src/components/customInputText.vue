<template>
    <div class="input-container">
        <InputText
            :id="name"
            v-model.trim="inputValue"
            :placeholder="placeholder"
            :name="name"
            :aria-describedby="`${name}-help`"
            :invalid="!!errorMessage"
            @blur="handleBlur"
            @change="handleChange"
        />
        <span v-show="errorMessage && meta.touched" :id="`${name}-help`" class="input-help">{{ errorMessage }}</span>
    </div>
</template>
<script setup lang="ts">
import { toRef } from "vue"
import { useField } from "vee-validate"
import InputText from 'primevue/inputtext';

const props = defineProps({
    placeholder: {
        type: String,
        default: undefined
    },
    name: {
        type: String,
        required: true
    }
})

const name = toRef(props, "name")
const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange,
    meta
} = useField(name, undefined, {
    initialValue: ''
})
</script>



<style scoped lang="scss">

.input-container {
    display: flex;
    flex-direction: column;
}

</style>