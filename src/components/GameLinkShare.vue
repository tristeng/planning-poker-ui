<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
})

const joinUrl = computed(() => `${window.location.origin}/game/join/${props.code}`)

function onCopyLink() {
  // TODO: update for older browsers?
  navigator.clipboard.writeText(joinUrl.value).then(() => console.log('Share link copied'))
}
</script>

<template>
  <form class="row row-cols-lg-auto w-100" @submit.prevent="onCopyLink">
    <div class="w-75">
      <input type="text" class="form-control" readonly :value="joinUrl" @click="onCopyLink" title="Click to copy share link to clipboard">
    </div>
    <div>
      <button type="submit" class="btn btn-primary" aria-label="share" title="Click to copy share link to clipboard"><i class="bi bi-share"></i></button>
    </div>
  </form>
</template>

<style scoped>
</style>