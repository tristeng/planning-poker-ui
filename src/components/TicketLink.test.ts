import { mount } from '@vue/test-utils'
import TicketLink from './TicketLink.vue'
import { describe, expect, it} from 'vitest'

describe('TicketLink.vue', () => {
    it('renders the ticket link if non empty', () => {
        const link = 'https://someurl.com/tickets/123'
        const wrapper = mount(TicketLink, {
            props: { link }
        })
        expect(wrapper.find('a').exists()).toBe(true)
        expect(wrapper.find('a').attributes('href')).toBe('https://someurl.com/tickets/123')
    })

    it('does not render if the ticket link is empty', () => {
        const wrapper = mount(TicketLink, {
            props: { link: '' }
        })
        expect(wrapper.find('a').exists()).toBe(false)
    })
})