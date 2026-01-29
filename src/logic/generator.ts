import { getWaits } from './mahjong';
import { type Problem } from '../types';

// Re-export Problem type for backward compatibility
export type { Problem } from '../types';

/**
 * Generates a random Mahjong problem (Chinitsu shape).
 * @param tileCount Number of tiles in hand (7, 10, 13)
 * @param minWaits Minimum number of wait types (for difficulty)
 * @returns Problem object with hand and correct waits
 */
export function generateProblem(tileCount: 7 | 10 | 13 = 13, minWaits: number = 1): Problem {
    let attempts = 0;
    const maxAttempts = 10000;

    while (attempts < maxAttempts) {
        attempts++;
        const hand = generateRandomHand(tileCount);

        // Sort for display (and consistency)
        hand.sort((a, b) => a - b);

        const waits = getWaits(hand);

        // Filter by minimum waits for difficulty
        if (waits.length >= minWaits) {
            return { hand, waits };
        }
    }

    throw new Error(`Failed to generate a valid problem with >= ${minWaits} waits.`);
}

function generateRandomHand(count: number): number[] {
    const hand: number[] = [];
    // Bag of tiles: 4 of each 1-9
    const bag: number[] = [];
    for (let i = 1; i <= 9; i++) {
        for (let j = 0; j < 4; j++) bag.push(i);
    }

    // Shuffle/Splice
    for (let i = 0; i < count; i++) {
        if (bag.length === 0) break;
        const index = Math.floor(Math.random() * bag.length);
        const tile = bag.splice(index, 1)[0];
        hand.push(tile);
    }

    return hand;
}
