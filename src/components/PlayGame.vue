<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrCreatePlayer } from '../stores/cookies'
import { buildUrl, fetchDeck } from '../utils/api'
import { Deck, Game, GameState, GenericMessage, MessageType, Player, PlayerState } from '../utils/model'
import CardSelector from './CardSelector.vue'
import GameLinkShare from './GameLinkShare.vue'
import PlayerCard from './PlayerCard.vue'

const route = useRoute()
const router = useRouter()
const player = ref<Player>(getOrCreatePlayer())
const code = ref('')
const deck = ref<Deck>(new Deck(0, []))
const gameState = ref<GameState>(new GameState(new Game('', 0, ''), new Map<String, PlayerState>()))

let ws: WebSocket | undefined = undefined

const isObserving = computed(() => {
  if(player.value.id in gameState.value.player_states) {
    // @ts-expect-error
    return gameState.value.player_states[player.value.id].is_observing
  }
  return false
})

function onWsOpen(event: Event) {
  console.log(`Successfully joined game with ID '${code.value}'`)
  console.debug(event)
}

function onWsClose(event: CloseEvent) {
  console.log(`Websocket closed`)
  console.debug(event)

  switch (event.code) {
    case 4000:
      // TODO: means user tried to join a game that no longer exists - display an error message
      break
    case 4001:
      // means user attempted to join a game they haven't registered for yet, push them to the join page
      router.push('/game/join')
      break
    default:
      console.log(`Websocket closed with code ${event.code}`)
  }
}

function onWsError(event: Event) {
  console.error('Encountered a WebSocket error!')
  console.error(event)
  // TODO: display an error message
}

function onWsMessage(event: MessageEvent) {
  console.debug(event)
  const rawData = JSON.parse(event.data)
  const data: GenericMessage<Map<string, any>> = rawData
  switch (data.type) {
    case MessageType.CONNECTED:
      const playerStateMsg: GenericMessage<PlayerState> = rawData
      // @ts-expect-error
      gameState.value.player_states[playerStateMsg.payload.player.id] = playerStateMsg.payload
      break
    case MessageType.DISCONNECTED:
    case MessageType.PLAYERVOTED:
    case MessageType.OBSERVING:
      const playerMsg: GenericMessage<Player> = rawData
      onPlayerMessage(playerMsg)
      break
    case MessageType.STATE:
      const gameStateMsg: GenericMessage<GameState> = rawData
      gameState.value = gameStateMsg.payload

      // fetch the deck - all players will get an initial game state message upon connecting
      fetchDeck(gameStateMsg.payload.game.deck_id).then(resp => {
        deck.value.id = gameStateMsg.payload.game.deck_id
        deck.value.cards = resp.cards
      })
      break
    default:
      console.log(data)
  }
}

onMounted(() => {
  if(Array.isArray(route.params.code)) {
    if(route.params.code.length > 0) {
      code.value = route.params.code[0]
    }
  } else {
    code.value = route.params.code
  }

  ws = new WebSocket(buildUrl(`ws/${player.value.id}/${code.value}`, 'ws'))
  ws.addEventListener('open', onWsOpen)
  ws.addEventListener('close', onWsClose)
  ws.addEventListener('error', onWsError)
  ws.addEventListener('message', onWsMessage)
})

onUnmounted(() => {
  ws?.close(1001)
})

function onVoted(value: Number) {
  const votedMsg = new GenericMessage<Number>(MessageType.SUBMITVOTE, value)
  ws?.send(JSON.stringify(votedMsg))
}

function onPlayerMessage(playerMsg: GenericMessage<Player>) {
  // @ts-expect-error
  const playerState: PlayerState = gameState.value.player_states[playerMsg.payload.id]
  switch (playerMsg.type) {
    case MessageType.DISCONNECTED:
      playerState.is_connected = false
      playerState.is_observing = false
      playerState.has_voted = false
      break
    case MessageType.PLAYERVOTED:
      playerState.has_voted = true
      break
    case MessageType.OBSERVING:
      playerState.is_observing = !playerState.is_observing
      break
  }
}

function requestSync() {
  const syncMsg = new GenericMessage<Number>(MessageType.SYNC, 0)
  ws?.send(JSON.stringify(syncMsg))
}

function onObserveToggle() {
  const observeMsg = new GenericMessage<Player>(MessageType.OBSERVE, player.value)
  ws?.send(JSON.stringify(observeMsg))
}
</script>

<template>
  <h2>Planning Poker Room</h2>
  <h5>{{ gameState.game.name }} </h5>
  <div class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-center align-items-center">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="observeToggle" @change="onObserveToggle">
          <label class="form-check-label" for="observeToggle">Observe</label>
        </div>
      </div>
      <div class="col d-flex justify-content-sm-center align-items-center">
          <button type="button" class="btn btn-primary" title="Re-sync game state with server" @click.prevent="requestSync()">
            <i class="bi bi-arrow-repeat"></i>
          </button>
      </div>
      <div class="col d-flex justify-content-center">
        <GameLinkShare :code="code" />
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <PlayerCard v-for="v in gameState.player_states" :player-state="v"/>
    </div>
  </div>
  <div v-if="!isObserving" class="container-fluid">
    <CardSelector :deck="deck" @voted="onVoted"/>
  </div>
</template>

<style scoped>
form {
  padding-bottom: 10px;
}
</style>