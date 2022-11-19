<script setup lang="ts">
import { PlayerState } from '../utils/model'
import { computed } from 'vue'

const props = defineProps({
  playerState: { type: PlayerState, required: true },
})

const connectedClass = computed(() => {
  return props.playerState.is_connected ? 'bi bi-ethernet text-success' : 'bi bi-ethernet text-danger'
})

const votedClass = computed(() => {
  return props.playerState.has_voted ? 'bi bi-question-circle-fill text-success' : 'bi bi-question-circle-fill text-warning'
})

</script>

<template>
  <div class="col">
    <div class="card text-center player-card">
      <div class="card-body">
        <h5 class="card-title">{{ playerState.player.username }}</h5>
        <p class="card-text">
          <i v-if="playerState.is_observing" class="bi bi-eye-fill text-primary" title="Player is observing"></i>
          <i v-else :class="votedClass"></i>
        </p>
      </div>
      <div class="card-footer">
        <i :class="connectedClass" title="Connection Status"></i>
        <i v-if="playerState.is_admin" class="bi bi-person-fill-lock text-primary" title="The game admin"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-card {
  max-width: 150px;
}
.card-text i {
  font-size: 3rem;
}
</style>