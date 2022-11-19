import { useCookies } from 'vue3-cookies'
import { Player } from '../utils/model'

const { cookies } = useCookies()

/**
 * Attempts to fetch the user from the cookie store or creates a new user if they don't exist, and updates the cookie
 * store with the player
 * @param username - the player username - omit if you just wish to fetch the player
 * @returns the player object
 */
function getOrCreatePlayer(username: string = ''): Player {
  let player: Player;
  if(cookies.isKey('player')) {
    const data = cookies.get('player')
    // @ts-expect-error
    player = new Player(data.username, data.id)  // library auto converts to/from JSON, but typing is incorrect :(
    if(username.length > 0) {
      player.username = username
    }
  } else {
    player = new Player(username)
  }

  // update the cookie
  // @ts-expect-error
  cookies.set('player', { id: player.id, username: player.username }, '28d')
  return player
}

/**
 * Sets the game code as a cookie parameter
 * @param code - the game code
 */
function setGameCode(code: string) {
  cookies.set('gameCode', code)
}

/**
 * Fetches the current game code
 * @returns the current game code or an empty string if none exists
 */
function getGameCode(): string {
  if(cookies.isKey('gameCode')) {
    return cookies.get('gameCode')
  }
  return ''
}

export { getOrCreatePlayer, setGameCode, getGameCode }