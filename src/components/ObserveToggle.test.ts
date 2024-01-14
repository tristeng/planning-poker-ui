import { shallowMount } from '@vue/test-utils'
import ObserveToggle from './ObserveToggle.vue'
import { describe, expect, it} from 'vitest'

describe('ObserveToggle.vue', () => {
    it('renders the toggle button', () => {
        const wrapper = shallowMount(ObserveToggle)
        expect(wrapper.exists()).toBe(true)

        // ensure there is a single i element with class bi-eye
        expect(wrapper.findAll('i.bi-eye').length).toBe(1)
    })

    it('emits an event when the button is clicked', async () => {
        const wrapper = shallowMount(ObserveToggle)

        // click the checkbox input and make sure the change event is emitted
        await wrapper.get('#observeToggle').trigger('change')
        expect(wrapper.emitted('change')).toBeTruthy()
    })
})