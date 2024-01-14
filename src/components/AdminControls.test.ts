import { mount } from '@vue/test-utils';
import AdminControls from './AdminControls.vue';
import { describe, expect, it } from 'vitest';

describe('AdminControls', () => {
    it('renders correctly', async () => {
        const wrapper = mount(AdminControls);
        expect(wrapper.exists()).toBe(true);

        // the start button text should be at its default
        const button = wrapper.get('[type="submit"]');
        expect(button.text()).toBe('Start Round');

        // once the start button is clicked, we expect the button text to change
        await wrapper.get('form').trigger('submit.prevent');
        expect(button.text()).toBe('Reveal Cards');

        // it should toggle back to its original if submitted again
        await wrapper.get('form').trigger('submit.prevent');
        expect(button.text()).toBe('Start Round');
    });

    it('emits a reset event when the round is not in progress and the start button is clicked', async () => {
        const wrapper = mount(AdminControls);

        await wrapper.get('form').trigger('submit.prevent');

        // an optional URL can be passed during a reset event, but by default it will be null
        expect(wrapper.emitted('reset')[0][0]).toBeNull();
    });

    it('emits a URL with the reset event when a round is not in progress and the submit button is clicked', async () => {
        const wrapper = mount(AdminControls);

        // add the ticket URL
        await wrapper.get('#ticketLink').setValue('https://example.com');

        await wrapper.get('form').trigger('submit.prevent');

        // an optional URL can be passed during a reset event, but by default it will be null
        expect(wrapper.emitted('reset')[0][0]).toStrictEqual('https://example.com');
    });
});
