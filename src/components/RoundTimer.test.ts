import { mount } from '@vue/test-utils'
import RoundTimer from './RoundTimer.vue'
import { describe, expect, it} from 'vitest'
import { Game, GameState, GameSettings, RoundTimerSettings, RoundState, PlayerState } from '../utils/model'

describe('RoundTimer', () => {
    it('renders the round timer correctly', () => {
        const gameSettings = new GameSettings(new RoundTimerSettings())
        const game = new Game('Software', 1, 'ABC', gameSettings)
        const gameState = new GameState(game, new Map<String, PlayerState>(), 'https://some-url.com', RoundState.INIT, undefined)
        const wrapper = mount(RoundTimer, { props: { gameState } })
        const progressBarElem = wrapper.get('div#round-timer-progress-bar')

        expect(progressBarElem.text()).toBe('05:00')
        expect(progressBarElem.classes()).toContain('bg-success')
    })
})
