import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, expect, it, afterEach } from 'vitest';
import { buildUrl, fetchDecks, fetchDeck, createGame, joinGame } from './api';
import { Deck, Player } from './model';

const mock = new MockAdapter(axios);

describe('API utility functions', () => {
  afterEach(() => {
    mock.reset();
  });

  it('buildUrl constructs the correct URL', () => {
    expect(buildUrl('decks')).toBe('http://127.0.0.1:8000/api/decks');
    expect(buildUrl('ws', 'ws')).toBe('ws://127.0.0.1:8000/api/ws');
  });

  it('fetchDecks makes a GET request and returns a list of decks', async () => {
    const decks: Deck[] = [{ id: 1, name: 'Test Deck', cards: [] }];
    mock.onGet('http://127.0.0.1:8000/api/decks').reply(200, decks);

    const result = await fetchDecks();
    expect(result).toEqual(decks);
  });

  it('fetchDeck makes a GET request and returns a single deck', async () => {
    const deck: Deck = { id: 1, name: 'Test Deck', cards: [] };
    mock.onGet('http://127.0.0.1:8000/api/decks/1').reply(200, deck);

    const result = await fetchDeck(1);
    expect(result).toEqual(deck);
  });

  it('createGame makes a POST request with player data and returns a game code', async () => {
    const gameName = 'Test Game';
    const deckId = 1;
    const player: Player = { id: '1', username: 'Test Player' };
    const gameCode = 'TEST123';

    mock.onPost('http://127.0.0.1:8000/api/game').reply(200, { code: gameCode });
    mock.onPost(`http://127.0.0.1:8000/api/join/${gameCode}`).reply(200, player);

    const result = await createGame(gameName, deckId, player);
    expect(result).toEqual(gameCode);
  });

  it('joinGame makes a POST request with player data and game code, and returns the game code', async () => {
    const gameCode = 'TEST123';
    const player: Player = { id: '1', username: 'Test Player' };

    mock.onPost(`http://127.0.0.1:8000/api/join/${gameCode}`).reply(200, player);

    const result = await joinGame(gameCode, player);
    expect(result).toEqual(gameCode);
  });
});