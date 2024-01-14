<script setup lang="ts">

const emit = defineEmits<{
  (e: 'change'): void
}>()

function onObserveToggle() {
  emit('change')
}
</script>

<template>
  <input type="checkbox" class="btn-check" id="observeToggle" autocomplete="off" @change="onObserveToggle">
  <label class="btn btn-outline-primary" for="observeToggle">
    <i class="bi bi-eye" title="Toggle observer mode"></i>
  </label>
</template>

<style scoped>
</style>