<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Deck } from '../utils/model'
import { createGame, fetchDecks } from '../utils/api'
import { getOrCreatePlayer, setGameCode } from '../stores/cookies'

const router = useRouter()
const decks = ref(Array<Deck>())
const gameName = ref('')
const username = ref('')
const deckId = ref(1)

onMounted(() => {
  fetchDecks().then(resp => decks.value = resp)

  const player = getOrCreatePlayer()
  if(player.username.length > 0) {
    username.value = player.username
  }
})

function onCreate() {
  const player = getOrCreatePlayer(username.value)
  createGame(gameName.value, deckId.value, player).then(resp => {
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
    <div class="mb-3">
      <button type="submit" class="btn btn-primary">Create</button>
    </div>
  </form>
</template>

<style scoped>
</style>
