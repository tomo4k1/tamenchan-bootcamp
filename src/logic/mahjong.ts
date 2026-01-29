/**
 * Mahjong Logic for Chinitsu (One Suit) Polyhedrons
 * We represent tiles as an array of numbers (1-9).
 * Since we focus on Polyhedrons (shapes), we assume one suit.
 */

// Re-export Hand type for backward compatibility
export type { Hand } from '../types';

/**
 * Check if the hand (must be 14 tiles usually) is a winning hand (4 sets + 1 pair).
 * Doesn't check for yaku (roles), acts as pure shape matcher.
 * Also checks for Chiitoitsu (7 pairs).
 */
export function isWinningHand(tiles: number[]): boolean {
    if (tiles.length % 3 !== 2) return false;

    const counts = getTileCounts(tiles);

    // 1. Check Chiitoitsu (Seven Pairs) - only if 14 tiles
    if (tiles.length === 14) {
        if (checkChiitoitsu(counts)) return true;
    }

    // 2. Standard Form (4 sets + 1 pair)
    // Iterate all possible pairs
    for (let i = 1; i <= 9; i++) {
        if (counts[i] >= 2) {
            // Try using i as the pair
            counts[i] -= 2;
            if (canFormSets(counts, (tiles.length - 2) / 3)) {
                return true;
            }
            counts[i] += 2; // backtrack
        }
    }

    return false;
}

/**
 * Recursive function to check if remaining tiles form sets (Triplets or Sequences)
 * @param counts array of tile counts (1-indexed, size 10)
 * @param setsNeeded number of sets remaining to find
 */
function canFormSets(counts: number[], setsNeeded: number): boolean {
    if (setsNeeded === 0) return true;

    // Find first tile that exists
    let first = -1;
    for (let i = 1; i <= 9; i++) {
        if (counts[i] > 0) {
            first = i;
            break;
        }
    }

    if (first === -1) return true; // Should be covered by setsNeeded check, but safety

    // Try Triplet (Koutsu)
    if (counts[first] >= 3) {
        counts[first] -= 3;
        if (canFormSets(counts, setsNeeded - 1)) return true;
        counts[first] += 3;
    }

    // Try Sequence (Shuntsu)
    if (first <= 7 && counts[first + 1] > 0 && counts[first + 2] > 0) {
        counts[first]--;
        counts[first + 1]--;
        counts[first + 2]--;
        if (canFormSets(counts, setsNeeded - 1)) return true;
        counts[first]++;
        counts[first + 1]++;
        counts[first + 2]++;
    }

    return false;
}

function checkChiitoitsu(counts: number[]): boolean {
    // Must have 7 distinct pairs
    let pairCount = 0;
    for (let i = 1; i <= 9; i++) {
        if (counts[i] === 2) pairCount++;
        else if (counts[i] !== 0) return false; // In strict 7 pairs, can't have 4 of a kind? Actually 4 of a kind is usually treated as 2 pairs in some rules, but standard is 7 distinct pairs usually? 
        // Actually standard mahjong: 4 same tiles can be 2 pairs? usually no.
        // Simplifying: 7 pairs means exactly 7 types of tiles with count 2.
    }
    return pairCount === 7;
}

function getTileCounts(tiles: number[]): number[] {
    const counts = Array(10).fill(0);
    for (const t of tiles) {
        if (t >= 1 && t <= 9) counts[t]++;
    }
    return counts;
}

/**
 * Returns an array of tiles that complete the hand.
 * @param hand 13 tiles (or 10, 7)
 */
export function getWaits(hand: number[]): number[] {
    const waits: number[] = [];
    const counts = getTileCounts(hand);

    // You can't have more than 4 of a tile in total in a hand (14 tiles).
    // So validation: checking if adding a tile exceeds 4 is important for realistic checks,
    // but theoretically for pure shape, we just check if it forms a win.
    // However, in a real game, if you have 4 of '1', you can't wait on '1'.

    for (let i = 1; i <= 9; i++) {
        // Optimization: If we already have 4 of this tile, it's impossible to draw/win on it physically.
        if (counts[i] === 4) continue;

        const testHand = [...hand, i];
        if (isWinningHand(testHand)) {
            waits.push(i);
        }
    }
    return waits;
}

/**
 * Sorts hand for display
 */
export function sortHand(hand: number[]): number[] {
    return [...hand].sort((a, b) => a - b);
}

/**
 * Decomposes a winning hand into sets and a pair.
 * Returns an array of groups (e.g., [[1,1], [2,3,4], ...]).
 * Returns empty array if not a winning hand.
 * @param hand 13 tiles (or 10, 7)
 * @param winTile The tile that completes the hand
 */
export function getWinningDecomposition(hand: number[], winTile: number): number[][] {
    const fullHand = [...hand, winTile].sort((a, b) => a - b);
    const counts = getTileCounts(fullHand);

    // 1. Check Chiitoitsu specific decomposition
    if (fullHand.length === 14 && checkChiitoitsu(counts)) {
        const pairs: number[][] = [];
        for (let i = 1; i <= 9; i++) {
            if (counts[i] === 2) pairs.push([i, i]);
        }
        return pairs;
    }

    // 2. Standard Form Decomposition
    for (let i = 1; i <= 9; i++) {
        if (counts[i] >= 2) {
            // Try i as pair
            counts[i] -= 2;
            const groups: number[][] = [[i, i]];

            const result = decomposeSets(counts, (fullHand.length - 2) / 3);
            if (result) {
                return groups.concat(result);
            }

            counts[i] += 2; // backtrack
        }
    }

    return [];
}

/**
 * Recursive helper to find sets and return them
 */
function decomposeSets(counts: number[], setsNeeded: number): number[][] | null {
    if (setsNeeded === 0) return [];

    // Find first tile
    let first = -1;
    for (let i = 1; i <= 9; i++) {
        if (counts[i] > 0) {
            first = i;
            break;
        }
    }
    if (first === -1) return [];

    // Try Triplet
    if (counts[first] >= 3) {
        counts[first] -= 3;
        const res = decomposeSets(counts, setsNeeded - 1);
        if (res) {
            return [[first, first, first], ...res];
        }
        counts[first] += 3;
    }

    // Try Sequence
    if (first <= 7 && counts[first + 1] > 0 && counts[first + 2] > 0) {
        counts[first]--;
        counts[first + 1]--;
        counts[first + 2]--;
        const res = decomposeSets(counts, setsNeeded - 1);
        if (res) {
            return [[first, first + 1, first + 2], ...res];
        }
        counts[first]++;
        counts[first + 1]++;
        counts[first + 2]++;
    }

    return null;
}
