<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Deck, RoundTimerSettings } from '../utils/model'
import { createGame, fetchDecks } from '../utils/api'
import { getOrCreatePlayer, setGameCode } from '../stores/cookies'

const router = useRouter()
const decks = ref(Array<Deck>())
const gameName = ref('')
const username = ref('')
const deckId = ref(1)
const roundTimerEnabled = ref(true)
const roundTimerSettings = ref<RoundTimerSettings>(new RoundTimerSettings())
const errorMessage = ref('')

onMounted(() => {
  fetchDecks().then(resp => decks.value = resp)

  const player = getOrCreatePlayer()
  if(player.username.length > 0) {
    username.value = player.username
  }
})

function onCreate() {
  const player = getOrCreatePlayer(username.value)
  let settings = roundTimerEnabled.value ? roundTimerSettings.value : undefined
  if(settings !== undefined) {
    if(settings.warning >= settings.maximum) {
      errorMessage.value = 'Round timer warning value must be less than the round timer maximum.'
      return
    }
  }

  createGame(gameName.value, deckId.value, player, settings).then(resp => {
    setGameCode(resp)
    router.push(`/game/play/${resp}`)
  })
}
</script>

<template>
  <h2>Create New Game</h2>
  <form @submit.prevent="onCreate">
    <div class="mb-3">
      <label for="gameName" class="form-label">Game Name</label>
      <input type="text" class="form-control" id="gameName" required maxlength="100" v-model="gameName"/>
    </div>
    <div class="mb-3">
      <label for="adminUsername" class="form-label">Your Name</label>
      <input type="text" class="form-control" id="adminUsername" required maxlength="100" v-model="username"/>
    </div>
    <div class="mb-3">
      <label for="deck" class="form-label">Deck</label>
      <select class="form-select" aria-label="Choose Deck" v-model="deckId" id="deck">
        <option v-for="deck in decks" :value="deck.id">{{ deck.name }} ({{ deck.cards.map(x => x.label).join(', ') }})</option>
      </select>
    </div>
    <div class="form-check">
      <input v-model="roundTimerEnabled" type="checkbox" class="form-check-input" id="enableRoundTimer">
      <label class="form-check-label" for="enableRoundTimer">Enable Round Timer</label>
    </div>
    <div v-if="roundTimerEnabled" class="mb-3">
      <label for="roundTimerMaximum" class="form-label">Round Timer Maximum (minutes)</label>
      <input type="number" class="form-control" id="roundTimerMaximum" min="2" max="15" v-model="roundTimerSettings.maximum"/>
      <small class="form-text text-muted">Shows a progress bar counting up to this value and turns red if the round elapsed time exceeds this value.</small>
    </div>
    <div v-if="roundTimerEnabled" class="mb-3">
      <label for="roundTimerWarning" class="form-label">Round Timer Warning (minutes)</label>
      <input type="number" class="form-control" id="roundTimerWarning" min="1" max="14" v-model="roundTimerSettings.warning"/>
      <small class="form-text text-muted">Turns the progress bar yellow once the elapsed time exceeds this value.</small>
      <div v-if="errorMessage" class="invalid-feedback">{{ errorMessage }}</div>
    </div>
    <div class="mb-3">
      <button type="submit" class="btn btn-primary">Create</button>
    </div>
  </form>
</template>

<style scoped>
.invalid-feedback {
  display: block;
}
.form-check {
  margin-bottom: 1rem;
}
</style>
