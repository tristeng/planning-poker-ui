<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { GameState } from '../utils/model'

const props = defineProps({
    gameState: { type: GameState, required: true },
})

const elapsedMS = ref(0)  // elapsed time in milliseconds
const timer = ref(0)  // handle to the timer callback
const roundStart = ref(Date.now())  // time the round started

// convert from minutes to milliseconds
const maximum = props.gameState.game.game_settings.round_timer_settings !== undefined ? props.gameState.game.game_settings.round_timer_settings.maximum * 60 * 1000 : 0
const warning = props.gameState.game.game_settings.round_timer_settings !== undefined ? props.gameState.game.game_settings.round_timer_settings.warning * 60 * 1000 : 0

const progress = computed<number>(() => {
    if(props.gameState.game.game_settings.round_timer_settings === undefined) {
        return 0
    }

    if(elapsedMS.value >= maximum) {
        clearInterval(timer.value)  // stop the timer
        return 100
    }

    return elapsedMS.value / maximum * 100
})

const progressClass = computed<string>(() => {
    if(props.gameState.game.game_settings.round_timer_settings === undefined) {
        return 'progress-bar'
    }

    if(elapsedMS.value < warning) {
        return 'progress-bar bg-success'
    } else if(elapsedMS.value < maximum) {
        return 'progress-bar bg-warning'
    } else {
        return 'progress-bar bg-danger'
    }
})

const countdownValue = computed<string>(() => {
    if(props.gameState.game.game_settings.round_timer_settings === undefined) {
        return ''
    }

    const remaining = maximum - elapsedMS.value
    if(remaining <= 0) {
        return '00:00'
    }
    const minutes = Math.floor(remaining / 1000 / 60)
    const seconds = Math.floor((remaining - minutes * 1000 * 60) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

onMounted(() => {
    if(props.gameState.game.game_settings.round_timer_settings !== undefined) {
        if(props.gameState.round_start !== undefined) {
            roundStart.value = Date.parse(props.gameState.round_start)
            elapsedMS.value = Date.now() - roundStart.value
        } else {
            roundStart.value = Date.now()
        }

        // start the timer
        timer.value = setInterval(() => {
            elapsedMS.value = Date.now() - roundStart.value
        }, 1000)
    }
})

</script>

<template>
    <div class="round-timer">
        <div class="progress">
            <div id="round-timer-progress-bar" :class="progressClass" role="progressbar" :style="{ width: progress + '%'}" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">{{ countdownValue }}</div>
        </div>
    </div>
</template>
  
<style scoped>
.round-timer {
    margin: 0.5rem 0;
}
</style>