/**
 * Game-related type definitions
 */

import { type Hand } from './mahjong';

/**
 * A mahjong problem for the quiz
 */
export interface Problem {
    /** The hand (13, 10, or 7 tiles) */
    hand: Hand;
    /** Array of correct wait tiles (1-9) */
    waits: number[];
}

/**
 * Current state of the game
 */
export type GameState = 'playing' | 'result';

/**
 * Difficulty level
 * 1: Any number of waits (easiest)
 * 2: At least 2 waits (medium)
 * 3: At least 3 waits (hardest)
 */
export type Difficulty = 1 | 2 | 3;

/**
 * Game result information
 */
export interface GameResult {
    /** Whether the answer was correct */
    isCorrect: boolean;
    /** User's selected waits */
    selectedWaits: number[];
    /** Correct waits */
    correctWaits: number[];
}
