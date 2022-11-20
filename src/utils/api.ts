import axios from 'axios'
import { Deck, Player } from './model';

// allow host and port to be overridden by an env variable
const hostAndPort = import.meta.env.VITE_API_HOST || '127.0.0.1:8000'

function buildUrl(path: string, protocol: string = 'http'): string {
  return `${protocol}://${hostAndPort}/api/${path}`
}

/**
 * Fetches the available decks
 * @returns {Array<Deck>}
 */
async function fetchDecks(): Promise<Array<Deck>> {
  console.log(buildUrl('decks'))
  const resp = await axios.get(buildUrl('decks'))
  return resp.data
}

/**
 * Fetches a deck by its ID
 * @param id - the numeric ID for the deck
 * @returns {Deck}
 */
async function fetchDeck(id: number): Promise<Deck> {
  const resp = await axios.get(buildUrl(`decks/${id}`))
  return resp.data
}

/**
 * Creates a new game and joins it
 * @param gameName - the name of the game
 * @param deckId - the selected deck for this game
 * @param player - the player creating the game
 * @returns {string} - the unique code for this game
 */
async function createGame(gameName: string, deckId: number, player: Player): Promise<string> {
  // create the game
  const resp = await axios.post(buildUrl('game'), { name: gameName, deck_id: deckId})
  const code: string = resp.data.code

  // and join the newly created game - the person that creates the game is automatically set to the game admin
  await joinGame(code, player)
  return code
}

/**
 * Joins an existing game
 * @param code - the code to the existing game
 * @param player - the player wishing to join the game
 * @returns {string} - the game code
 */
async function joinGame(code: string, player: Player): Promise<string> {
  const resp = await axios.post(buildUrl(`join/${code}`), { id: player.id, username: player.username })
  console.debug(resp.data)  // the response returns the player object
  return code
}

export { buildUrl, fetchDecks, fetchDeck, createGame, joinGame }