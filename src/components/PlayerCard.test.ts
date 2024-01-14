import { mount } from '@vue/test-utils'
import PlayerCard from './PlayerCard.vue'
import { Player, PlayerState } from '../utils/model'
import { describe, expect, it} from 'vitest'

describe('PlayerCard.vue', () => {
    // admin player is connected, is admin, is observing, and has not voted
    const admin = new Player('Admin')
    const adminState = new PlayerState(admin, true, true, true, false)

    // alice is connected, is not admin, is not observing, and has not voted
    const alice = new Player('Alice')
    const aliceState = new PlayerState(alice, true, false, false, false)

    // bob is not connected, is not admin, is not observing, and has voted
    const bob = new Player('Bob')
    const bobState = new PlayerState(bob, false, false, false, true)

    it('renders for the admin user', async () => {
        // admin player is connected, is admin, is observing, and has not voted
        const wrapper = mount(PlayerCard, {
            props: { playerState: adminState, playerVotes: null }
        })

        // check that the h5 element has the username
        expect(wrapper.find('h5').text()).toBe(admin.username)

        // check the states
        expect(wrapper.vm.connectedClass).toBe('bi bi-ethernet text-success')  // connected
        expect(wrapper.find('i.bi-person-fill-lock').exists()).toBe(true)  // admin'))
        expect(wrapper.find('i.bi-eye-fill').exists()).toBe(true)  // observing
        expect(wrapper.find('span.vote-display').exists()).toBe(false)  // vote never shows for observing
    })

    it('renders for the alice user', async () => {
        // alice is connected, is not admin, is not observing, and has not voted
        const wrapper = mount(PlayerCard, {
            props: { playerState: aliceState, playerVotes: null }
        })

        // check that the h5 element has the username
        expect(wrapper.find('h5').text()).toBe(alice.username)

        // check the states
        expect(wrapper.vm.connectedClass).toBe('bi bi-ethernet text-success')  // connected
        expect(wrapper.find('i.bi-person-fill-lock').exists()).toBe(false)  // not admin'))
        expect(wrapper.find('i.bi-eye-fill').exists()).toBe(false)  // not observing
        expect(wrapper.find('span.vote-display').exists()).toBe(false)  // no vote value
        expect(wrapper.vm.votedClass).toBe('bi bi-question-circle-fill text-warning')  // has not voted
    })

    it('renders for the bob user', async () => {
        // bob is not connected, is not admin, is not observing, and has voted with a value of 5
        const wrapper = mount(PlayerCard, {
            props: { playerState: bobState, playerVotes: { [bob.id]: 5 } }
        })

        // check that the h5 element has the username
        expect(wrapper.find('h5').text()).toBe(bob.username)

        // check the states
        expect(wrapper.vm.connectedClass).toBe('bi bi-ethernet text-danger')  // not connected
        expect(wrapper.find('i.bi-person-fill-lock').exists()).toBe(false)  // not admin'))
        expect(wrapper.find('i.bi-eye-fill').exists()).toBe(false)  // not observing
        expect(wrapper.find('span.vote-display').exists()).toBe(true)  // no vote value
        expect(wrapper.find('span.vote-display').text()).toBe('5')  // vote value
    })

    // it('renders the vote value if the player has voted', async () => {
    //     const playerState = new PlayerState(/* initialize with your data */)
    //     playerState.has_voted = true
    //     const playerVotes = new Map() // initialize with your data
    //     playerVotes.set(playerState.player.id, 5)
    //     const wrapper = mount(PlayerCard, {
    //         props: { playerState, playerVotes }
    //     })
    //     expect(wrapper.find('.vote-display').text()).toBe('5')
    // })
})