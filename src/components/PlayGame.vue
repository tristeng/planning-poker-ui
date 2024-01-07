<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrCreatePlayer } from '../stores/cookies'
import { buildUrl, fetchDeck } from '../utils/api'
import { Deck, Game, GameState, GenericMessage, MessageType, Player, PlayerState, RoundState } from '../utils/model'
import CardSelector from './CardSelector.vue'
import GameLinkShare from './GameLinkShare.vue'
import PlayerCard from './PlayerCard.vue'
import ObserveToggle from './ObserveToggle.vue'
import AdminControls from './AdminControls.vue'
import TicketLink from './TicketLink.vue'

const route = useRoute()
const router = useRouter()
const player = ref<Player>(getOrCreatePlayer())
const code = ref('')
const deck = ref<Deck>(new Deck(0, "", []))
const gameState = ref(new GameState(new Game('', 0, ''), new Map<String, PlayerState>(), '',
    RoundState.INIT))
const currentTicketLink = ref('')
const cardSelector = ref<InstanceType<typeof CardSelector> | null>(null)
const isStarted = ref(false)
const playerVotes = ref<Map<string, number | null> | null>(null)
const errorMessage = ref('')

let ws: WebSocket | undefined = undefined

const isObserving = computed(() => {
  if(player.value.id in gameState.value.player_states) {
    // @ts-expect-error
    return gameState.value.player_states[player.value.id].is_observing
  }
  return false
})

const isAdmin = computed(() => {
  if(player.value.id in gameState.value.player_states) {
    // @ts-expect-error
    const playerState: PlayerState = gameState.value.player_states[player.value.id]
    return playerState.is_admin
  }
  return false
})

const avgVote = computed(() => {
  let sum = 0
  let count = 0
  let currVote = 0
  if(playerVotes.value != null) {
    for(let k in playerVotes.value) {
      // @ts-expect-error
      currVote = playerVotes.value[k]
      if(currVote != null) {
        sum += currVote
        count++
      }
    }
  }

  if(count > 0) {
    return Math.round(((sum / count) + Number.EPSILON) * 100) / 100
  }

  return null
})

const playerStateList = computed(() => {
  const playerStates = []
  for(const k in gameState.value.player_states) {
    // @ts-expect-error
    playerStates.push(gameState.value.player_states[k])
  }
  return playerStates
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
      errorMessage.value = `Game with code '${code.value}' no longer exists!`
      break
    case 4001:
      // means user attempted to join a game they haven't registered for yet, push them to the join page and append the
      // game code if there was one
      router.push(`/game/join/${code.value}`)
      break
    default:
      console.log(`Websocket closed with code ${event.code}`)
  }
}

function onWsError(event: Event) {
  console.error('Encountered a WebSocket error!')
  console.error(event)
  errorMessage.value = 'A WebSocket error occurred - please check the error log in your browser'
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
      currentTicketLink.value = gameState.value.ticket_url

      // fetch the deck - all players will get an initial game state message upon connecting
      fetchDeck(gameStateMsg.payload.game.deck_id).then(resp => {
        deck.value.id = gameStateMsg.payload.game.deck_id
        deck.value.cards = resp.cards
      })

      isStarted.value = gameStateMsg.payload.round_state != RoundState.INIT;
      break
    case MessageType.RESETGAME:
      const resetGameMsg: GenericMessage<string> = rawData
      currentTicketLink.value = resetGameMsg.payload
      for(let key in gameState.value.player_states) {
        // @ts-expect-error
        gameState.value.player_states[key].has_voted = false
      }
      isStarted.value = true
      cardSelector.value?.clearVote()
      playerVotes.value = null
      break
    case MessageType.REVEALGAME:
      const revealGameMsg: GenericMessage<Map<string, number | null>> = rawData
      playerVotes.value = revealGameMsg.payload
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
  ws?.close(1000)
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

function onObserveToggle() {
  const observeMsg = new GenericMessage<Player>(MessageType.OBSERVE, player.value)
  ws?.send(JSON.stringify(observeMsg))
}

function onReset(link: String | null) {
  const resetMessage = new GenericMessage<String | null>(MessageType.RESET, link)
  ws?.send(JSON.stringify(resetMessage))
}

function onReveal() {
  const revealMsg = new GenericMessage<String>(MessageType.REVEAL, '')
  ws?.send(JSON.stringify(revealMsg))
}

function onErrorMsgDismiss() {
  errorMessage.value = ''
}
</script>

<template>
  <h5>{{ gameState.game.name }} Room</h5>
  <div class="container-fluid info-bar">
    <div class="row">
      <div class="col d-flex justify-content-end align-items-center">
        <div class="btn-group" role="group">
          <ObserveToggle @change="onObserveToggle"/>
          <GameLinkShare :code="code" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="errorMessage" class="container-fluid">
    <div class="alert alert-danger alert-dismissible show" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="onErrorMsgDismiss"></button>
    </div>
  </div>
  <div class="container-fluid info-bar">
    <AdminControls v-if="isAdmin" @reset="onReset" @reveal="onReveal"/>
    <TicketLink v-else :link="currentTicketLink"/>
  </div>
  <div v-if="avgVote" class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-center align-items-center">
      <div class="alert alert-success" role="alert">
        <strong>Average Estimate:</strong> {{ avgVote }}
      </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row">
      <PlayerCard v-for="v in playerStateList" :player-state="v" :player-votes="playerVotes"/>
    </div>
  </div>
  <div v-if="isStarted && !isObserving" class="container-fluid">
    <CardSelector :deck="deck" @voted="onVoted" ref="cardSelector"/>
  </div>
</template>

<style scoped>
form, .info-bar {
  margin-bottom: 10px;
}
</style>