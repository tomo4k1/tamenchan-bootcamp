import { describe, it, expect } from 'vitest';
import { getWaits, getWinningDecomposition } from './mahjong';

describe('Mahjong Logic', () => {
    it('detects standard Chuuren Poutou waits (9-sided wait)', () => {
        // 1112345678999 -> waits 1-9
        const hand = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9];
        const waits = getWaits(hand);
        expect(waits).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('detects simple ryanmen wait', () => {
        // 2345 -> 1 set (234) + 5 (wait 5) OR 2 + 345 (wait 2).
        // Wait 2, 5.
        const hand = [2, 3, 4, 5];
        expect(getWaits(hand)).toEqual([2, 5]);
    });

    it('detects sanmenchan (3-sided wait)', () => {
        // 23456 + 88 (7 tiles) -> 1, 4, 7
        // 23456 is a shape that waits 1-4-7 when associated with a pair.
        const hand = [2, 3, 4, 5, 6, 8, 8];
        expect(getWaits(hand)).toEqual([1, 4, 7]);
    });

    it('detects complex shape', () => {
        // 1112224567888
        // Found waits: 3, 4, 6, 7, 9
        const hand = [1, 1, 1, 2, 2, 2, 4, 5, 6, 7, 8, 8, 8];
        expect(getWaits(hand)).toEqual([3, 4, 6, 7, 9]);
    });

    it('detects ryanpeikou/chiitoitsu overlap', () => {
        // 11 22 33 44 55 66 7 -> wait 1, 4, 7
        // This shape is both potentially Chiitoitsu (waiting 7) AND standard form (waiting 1,4,7).
        const hand = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
        expect(getWaits(hand)).toEqual([1, 4, 7]);
    });

    describe('getWinningDecomposition', () => {
        it('decomposes a simple hand', () => {
            // 111 234 567 888 9 + 9 (pair)
            const hand = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 9];
            const decomp = getWinningDecomposition(hand, 9);
            expect(decomp).toHaveLength(5); // 4 sets + 1 pair
            expect(decomp).toEqual(expect.arrayContaining([
                [1, 1, 1],
                [2, 3, 4],
                [5, 6, 7],
                [8, 8, 8],
                [9, 9]
            ]));
        });

        it('decomposes Seven Pairs', () => {
            // 11 22 33 44 55 66 7 + 7
            const hand = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7];
            const decomp = getWinningDecomposition(hand, 7);
            expect(decomp).toHaveLength(7); // 7 pairs
            expect(decomp.every(group => group.length === 2)).toBe(true);
        });
    });
});
