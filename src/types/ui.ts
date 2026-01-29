/**
 * UI-related type definitions
 */

/**
 * Tile display size
 */
export type TileSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Tile component
 */
export interface TileProps {
    /** Tile value (1-9) */
    value: number;
    /** Click handler */
    onClick?: () => void;
    /** Whether the tile is selected */
    selected?: boolean;
    /** Display size of the tile */
    size?: TileSize;
}

/**
 * Props for the Quiz component
 */
export interface QuizProps {
    /** Difficulty level (1-3) */
    difficulty?: number;
}

/**
 * Message types for UI feedback
 */
export type MessageType = 'start' | 'correct' | 'wrong' | 'loading';

/**
 * Collection of gal-style messages
 */
export interface GalMessages {
    start: string;
    correct: string;
    wrong: string;
    loading: string;
}
