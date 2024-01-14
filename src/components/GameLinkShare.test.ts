import { mount } from '@vue/test-utils';
import GameLinkShare from './GameLinkShare.vue';
import { describe, expect, it} from 'vitest';

describe('GameLinkShare.vue', () => {
    it('renders the component correctly', async () => {
        const gameCode = 'TEST123'
        const wrapper = mount(GameLinkShare, {
            props: { gameCode }
        })
        expect(wrapper.get('a.btn-primary')).toBeTruthy();
        expect(wrapper.get('a.btn-primary').attributes('title')).toBe('Click to copy share link to clipboard');
    })
})
