import { shallowMount } from '@vue/test-utils';
import Home from './Home.vue';
import { describe, expect, it} from 'vitest';

describe('Home.vue tests', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(Home, { stubs: ['router-link'] });
    expect(wrapper.exists()).toBe(true);

    expect(wrapper.get('h1')).toBeTruthy();
    expect(wrapper.get('h1').text()).toBe('Planning Poker');

    // expect there to be 2 div with the col class
    expect(wrapper.findAll('div.col').length).toBe(2);
  });
});