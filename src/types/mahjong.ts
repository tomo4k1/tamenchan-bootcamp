/**
 * Mahjong-related type definitions
 */

/**
 * A hand is represented as an array of tile values (1-9)
 */
export type Hand = number[];

/**
 * Tile values in Chinitsu (one suit) range from 1 to 9
 */
export type TileValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Array representing count of each tile (1-indexed, size 10)
 * Index 0 is unused, indices 1-9 represent counts of tiles 1-9
 */
export type TileCounts = number[];

/**
 * A group in a winning hand (either a set or a pair)
 * - Pair: [n, n]
 * - Triplet (Koutsu): [n, n, n]
 * - Sequence (Shuntsu): [n, n+1, n+2]
 */
export type SetGroup = number[];

/**
 * A complete winning hand decomposition
 * Array of groups (4 sets + 1 pair for standard, or 7 pairs for Chiitoitsu)
 */
export type WinningDecomposition = SetGroup[];
