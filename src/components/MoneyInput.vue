<script setup>
import { computed, useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
    modelValue: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

function formatFromNumber(value) {
    if (value === null || value === undefined || isNaN(value)) return ''

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

function parseFromInput(value) {
    const digits = value.replace(/\D/g, '')
    if (!digits) return null
    return Number(digits) / 100
}

const displayValue = computed({
    get() {
        return formatFromNumber(props.modelValue)
    },
    set(rawValue) {
        emit('update:modelValue', parseFromInput(rawValue))
    }
})
</script>

<template>
    <input v-bind="attrs" type="text" v-model="displayValue" inputmode="numeric" />
</template>
