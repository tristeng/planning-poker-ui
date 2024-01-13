import { Card, Deck, Player, Game, PlayerState, GameState, MessageType, GenericMessage, RoundState } from './model';
import { describe, expect, it } from 'vitest';

describe('model.ts', () => {
    describe('Card', () => {
        it('should create a new Card instance', () => {
            const card = new Card('Ace', 1);
            expect(card.label).toBe('Ace');
            expect(card.value).toBe(1);
        });
    });

    describe('Deck', () => {
        it('should create a new Deck instance', () => {
            const cards = [new Card('Ace', 1), new Card('King', 13)];
            const deck = new Deck(1, 'Standard', cards);
            expect(deck.id).toBe(1);
            expect(deck.name).toBe('Standard');
            expect(deck.cards).toEqual(cards);
        });
    });

    describe('Player', () => {
        it('should create a new Player instance with a generated id', () => {
            const player = new Player('John');
            expect(player.username).toBe('John');
            expect(player.id).toBeDefined();
        });

        it('should create a new Player instance with a provided id', () => {
            const player = new Player('John', '123');
            expect(player.username).toBe('John');
            expect(player.id).toBe('123');
        });
    });

    describe('Game', () => {
        it('should create a new Game instance', () => {
            const game = new Game('Poker', 1, 'ABC');
            expect(game.name).toBe('Poker');
            expect(game.deck_id).toBe(1);
            expect(game.code).toBe('ABC');
        });
    });

    describe('PlayerState', () => {
        it('should create a new PlayerState instance', () => {
            const player = new Player('John');
            const playerState = new PlayerState(player, true, false, false, true);
            expect(playerState.player).toBe(player);
            expect(playerState.is_connected).toBe(true);
            expect(playerState.is_admin).toBe(false);
            expect(playerState.is_observing).toBe(false);
            expect(playerState.has_voted).toBe(true);
        });
    });

    describe('GameState', () => {
        it('should create a new GameState instance', () => {
            const game = new Game('Poker', 1, 'ABC');
            const playerStates = new Map<string, PlayerState>();
            const ticketUrl = 'https://example.com';
            const roundState = 'INIT';
            const gameState = new GameState(game, playerStates, ticketUrl, roundState);
            expect(gameState.game).toBe(game);
            expect(gameState.player_states).toBe(playerStates);
            expect(gameState.ticket_url).toBe(ticketUrl);
            expect(gameState.round_state).toBe(roundState);
        });
    });

    describe('GenericMessage', () => {
        it('should create a new GenericMessage instance', () => {
            const type = 'SUBMITVOTE';
            const payload = { vote: 5 };
            const message = new GenericMessage(type, payload);
            expect(message.type).toBe(type);
            expect(message.payload).toBe(payload);
        });
    });
});
