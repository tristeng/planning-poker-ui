import { v4 as uuidv4 } from 'uuid'

class Card {
  constructor(public label: string, public value: Number) {
    this.label = label
    this.value = value
  }
}

class Deck {
  constructor(public id: Number, public cards: Array<Card>) {
    this.id = id
    this.cards = cards
  }
}

class Player {
  constructor(public username: string, public id: string = uuidv4()) {
    this.id = id
    this.username = username
  }
}

class Game {
  constructor(public name: string, public deck_id: number, public code: string) {
    this.name = name
    this.deck_id = deck_id
    this.code = code
  }
}

class PlayerState {
  constructor(public player: Player, public is_connected: boolean, public is_admin: boolean,
              public is_observing: boolean, public has_voted: boolean) {
    this.player = player
    this.is_connected = is_connected
    this.is_admin = is_admin
    this.is_observing = is_observing
    this.has_voted = has_voted
  }
}

class GameState {
  constructor(public game: Game, public player_states: Map<String, PlayerState>) {
    this.game = game
    this.player_states = player_states
  }
}

enum MessageType {
  // client messages
  SUBMITVOTE = "SUBMITVOTE",  // submits a vote for the current story
  OBSERVE = "OBSERVE",  // puts client into observation mode (no voting)
  SYNC = "SYNC",  // requests game state

  // admin-only messages, in addition to above
  RESET = "RESET",  // resets the game - everyone's votes are cleared, in preparation for the next story
  REVEAL = "REVEAL",  // reveals all the cards

  // server messages to a single client
  STATE = "STATE",  // sends out the current game state - useful if the client becomes out-of-sync or has just joined

  // broadcast messages
  CONNECTED = "CONNECTED",  // broadcasts that a player has joined
  DISCONNECTED = "DISCONNECTED",  // broadcasts that a player has left
  PLAYERVOTED = "PLAYERVOTED",  // broadcasts that a particular player has submitted their vote
  RESETGAME = "RESETGAME",  // tells clients to reset the game
  REVEALGAME = "REVEALGAME",  // tells clients to show votes - vote data is sent with this message
  OBSERVING = "OBSERVING",  // tells clients that a particular player is observing and won't be voting
}

type MessageTypeStrings = keyof typeof MessageType

class GenericMessage<Payload> {
  constructor(public type: MessageTypeStrings, public payload: Payload) {
    this.type = type
    this.payload = payload
  }
}

export { Card, Deck, Player, Game, PlayerState, GameState, MessageType, GenericMessage }
