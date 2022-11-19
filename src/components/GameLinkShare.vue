<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
})

const joinUrl = computed(() => `${window.location.origin}/game/join/${props.code}`)

function onCopyLink() {
  navigator.clipboard.writeText(joinUrl.value).then(() => console.log('Share link copied'))
}
</script>

<template>
  <a class="btn btn-primary" href="#" role="button" aria-label="share" title="Click to copy share link to clipboard" @click.prevent="onCopyLink">
    <i class="bi bi-share"></i>
  </a>
</template>

<style scoped>
</style>