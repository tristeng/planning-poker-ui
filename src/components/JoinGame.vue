<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { joinGame } from '../utils/api'
import { useRoute, useRouter } from 'vue-router'
import { getOrCreatePlayer } from '../stores/cookies'

const route = useRoute()
const router = useRouter()
const username = ref('')
const code = ref('')

function onJoin(_: Event) {
  const player = getOrCreatePlayer(username.value)
  joinGame(code.value, player).then(resp => console.debug(resp))
  router.push(`/game/play/${code.value}`)
}

onMounted(() => {
  // the params getter can be a string array or just a string - we'll only use it as string, but type check to make TS
  // happy
  if(Array.isArray(route.params.code)) {
    if(route.params.code.length > 0) {
      code.value = route.params.code[0]
    }
  } else {
    code.value = route.params.code
  }

  const player = getOrCreatePlayer()
  if(player.username.length > 0) {
    username.value = player.username
  }
})
</script>

<template>
  <h2>Join Game</h2>
  <form @submit.prevent="onJoin">
    <div class="mb-3">
      <label for="username" class="form-label">Your Name</label>
      <input type="text" class="form-control" id="username" required maxlength="100" v-model="username"/>
    </div>
    <div class="mb-3">
      <label for="code" class="form-label">Game Code</label>
      <input type="text" class="form-control" id="code" required maxlength="100" v-model="code" />
    </div>
    <div class="mb-3">
      <button type="submit" class="btn btn-primary">Join</button>
    </div>
  </form>
</template>

<style scoped>
</style>
