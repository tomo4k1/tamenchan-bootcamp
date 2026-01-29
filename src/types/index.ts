/**
 * Central export point for all type definitions
 */

// Mahjong-related types
export type { Hand, TileValue, TileCounts, SetGroup, WinningDecomposition } from './mahjong';

// Game-related types
export type { Problem, GameState, Difficulty, GameResult } from './game';

// UI-related types
export type { TileSize, TileProps, QuizProps, MessageType, GalMessages } from './ui';
