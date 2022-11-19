<script setup lang="ts">
import { computed, ref } from 'vue'

const inProgress = ref(false)
const link = ref('')

const buttonText = computed(() => inProgress.value ? 'Reveal Cards' : 'Start Round')

const emit = defineEmits<{
  (e: 'reset', value: String | null): void
  (e: 'reveal'): void
}>()

function onSubmit() {
  if(inProgress.value) {
    emit('reveal')
    link.value = ''
  } else {
    emit('reset', link.value && link.value.length > 0 ? link.value : null)
  }
  inProgress.value = !inProgress.value
}
</script>

<template>
  <form class="row row-cols-lg-auto align-items-center" @submit.prevent="onSubmit">
    <div class="col w-75">
      <label class="visually-hidden" for="ticketLink">Ticket Link</label>
      <div class="input-group">
        <div class="input-group-text"><i class="bi bi-link"></i></div>
        <input type="url" class="form-control" id="ticketLink" placeholder="Ticket Link" v-model="link" autocomplete="off">
      </div>
    </div>
    <div class="col">
      <button type="submit" class="btn btn-primary">{{ buttonText }}</button>
    </div>
  </form>
</template>

<style scoped>
</style>