<script setup lang="ts">
const props = defineProps({
  link: { type: String, required: true },
})
</script>

<template>
  <div v-if="props.link && props.link.length > 0" class="text-center">
    <label class="form-label">Current Ticket</label>
    <a :href="props.link" title="Link to current ticket" target="_blank">{{ props.link }} <i class="bi bi-box-arrow-up-right"></i></a>
  </div>
</template>

<style scoped>
.form-label {
  margin-right: 10px;
  font-weight: bold;
}
</style>