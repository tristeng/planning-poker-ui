import { mount } from '@vue/test-utils';
import CardSelector from './CardSelector.vue';
import { describe, expect, it } from 'vitest';
import { Card, Deck } from '../utils/model';

describe('CardSelector', () => {
    const cards: Array<Card> = [
        new Card('1/2', 0.5),
        new Card('1', 1),
        new Card('2', 2),
        new Card('3', 3),
        new Card('5', 5),
        new Card('8', 8),
        new Card('13', 13),
        new Card('?', 100),
    ];

    const deck = new Deck(1, 'Fibonacci', cards);

    it('renders the component correctly', async () => {
        const wrapper = mount(CardSelector, { props: { deck } });
        expect(wrapper.exists()).toBe(true);

        // ensure the number of cards in the deck matches what's in the deck
        const cardElements = wrapper.findAll('#deck-cards a');
        expect(cardElements.length).toBe(deck.cards.length);

        // iterate over the cardElements and ensure the text matches the card label and the data-card-value attribute matches the card value
        cardElements.forEach((cardElement, index) => {
            expect(cardElement.text()).toBe(deck.cards[index].label);
            expect(cardElement.attributes('data-card-value')).toBe(`${deck.cards[index].value}`);
        });
    });

    it('emits the selected card value when a card is clicked', async () => {
        const wrapper = mount(CardSelector, { props: { deck } });

        const cardElements = wrapper.findAll('#deck-cards a');
        expect(cardElements.length).toBe(deck.cards.length);

        // make sure that no cards have the active class applied to them
        expect(wrapper.findAll('#deck-cards a.active').length).toBe(0);

        // click the card at index 2 (which also has value 2)
        await cardElements[2].trigger('click');
        expect(wrapper.emitted('voted')[0][0]).toStrictEqual(deck.cards[2].value);

        // also verify that that only a single card has the active class applied to it
        const activeCardElements = wrapper.findAll('#deck-cards a.active');
        expect(activeCardElements.length).toBe(1);

        // verify that the active card has the correct value
        expect(activeCardElements[0].attributes('data-card-value')).toBe(`${deck.cards[2].value}`);
    });
});
