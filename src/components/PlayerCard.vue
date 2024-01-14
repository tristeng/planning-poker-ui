<script setup lang="ts">
import { PlayerState } from '../utils/model'
import { computed, PropType } from 'vue'

const props = defineProps({
  playerState: { type: PlayerState, required: true },
  playerVotes: { type: Map as PropType<Map<string, number | null> | null>, required: true },
})

const connectedClass = computed(() => {
  return props.playerState.is_connected ? 'bi bi-ethernet text-success' : 'bi bi-ethernet text-danger'
})

const votedClass = computed(() => {
  return props.playerState.has_voted ? 'bi bi-question-circle-fill text-success' : 'bi bi-question-circle-fill text-warning'
})

const voteValue = computed(() => {
  if(props.playerVotes && props.playerState.player.id in props.playerVotes) {
    // @ts-expect-error
    return props.playerVotes[props.playerState.player.id]
  }
  return 0  // null or positive integers are possible only
})

</script>

<template>
  <div class="col">
    <div class="card text-center player-card">
      <div class="card-body">
        <h5 class="card-title">{{ playerState.player.username }}</h5>
        <p class="card-text">
          <i v-if="playerState.is_observing" class="bi bi-eye-fill text-primary" title="Player is observing"></i>
          <span v-else-if="voteValue != null && voteValue > 0" class="vote-display">{{ voteValue }}</span>
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
.card-text i, .card-text span {
  font-size: 3rem;
}
</style>