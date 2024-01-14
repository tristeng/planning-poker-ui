import { getOrCreatePlayer, setGameCode, getGameCode, cookies } from './cookies'
import { Player } from '../utils/model'
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue3-cookies', () => {
    return {
        useCookies: vi.fn(() => {
            return {
                cookies: {
                    isKey: vi.fn(),
                    get: vi.fn(),
                    set: vi.fn(),
                }
            }
        }),
    }
})

describe('cookies', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('getOrCreatePlayer', () => {
        it('should return an existing player from the cookie store', () => {
            const isKeySpy = vi.spyOn(cookies, 'isKey').mockReturnValue(true)
            // @ts-expect-error - the cookies library auto converts to/from JSON, but typing is incorrect :(
            const getSpy = vi.spyOn(cookies, 'get').mockReturnValue({'id': 'some-uuid', 'username': 'JohnDoe'})
            const setSpy = vi.spyOn(cookies, 'set')

            const player: Player = getOrCreatePlayer()
            expect(player.id).toBe('some-uuid')
            expect(player.username).toBe('JohnDoe')
            expect(isKeySpy).toHaveBeenCalledWith('player')
            expect(getSpy).toHaveBeenCalledWith('player')
            expect(setSpy).toHaveBeenCalledOnce()

            // we should be able to overwrite the username, but the existing unique ID should be the same
            const player2: Player = getOrCreatePlayer('JaneDoe')
            expect(player2.id).toBe('some-uuid')
            expect(player2.username).toBe('JaneDoe')
        })

        it('should create a new player and update the cookie store', () => {
            // test when the player doesn't exist in the cookie store
            const isKeySpy = vi.spyOn(cookies, 'isKey').mockReturnValue(false)
            const getSpy = vi.spyOn(cookies, 'get')
            const setSpy = vi.spyOn(cookies, 'set')

            const player: Player = getOrCreatePlayer('JaneDoe')
            expect(player.id).toBeDefined()
            expect(player.username).toBe('JaneDoe')
            expect(isKeySpy).toHaveBeenCalledWith('player')
            expect(getSpy).not.toHaveBeenCalled()
            expect(setSpy).toHaveBeenCalledOnce()
        })
    })

    describe('setGameCode', () => {
        it('should set the game code as a cookie parameter', () => {
            const setSpy = vi.spyOn(cookies, 'set')

            setGameCode('ABC123')
            expect(setSpy).toHaveBeenCalledWith('gameCode', 'ABC123')
        })
    })

    describe('getGameCode', () => {
        it('should fetch the current game code from the cookie store', () => {
            const isKeySpy = vi.spyOn(cookies, 'isKey').mockReturnValue(true)
            const getSpy = vi.spyOn(cookies, 'get').mockReturnValue('ABC123')

            const gameCode: string = getGameCode()
            expect(gameCode).toBe('ABC123')
            expect(isKeySpy).toHaveBeenCalledWith('gameCode')
            expect(getSpy).toHaveBeenCalledWith('gameCode')
        })

        it('should return an empty string if no game code exists in the cookie store', () => {
            const isKeySpy = vi.spyOn(cookies, 'isKey').mockReturnValue(false)
            const getSpy = vi.spyOn(cookies, 'get')

            const gameCode: string = getGameCode()
            expect(gameCode).toBe('')
            expect(isKeySpy).toHaveBeenCalledWith('gameCode')
            expect(getSpy).not.toHaveBeenCalled()
        })
    })
})
