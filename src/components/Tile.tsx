import React from 'react';
import { type TileProps } from '../types';
import './Tile.css';

const TILE_MAP: Record<number, string> = {
    1: '🀇', 2: '🀈', 3: '🀉', 4: '🀊', 5: '🀋', 6: '🀌', 7: '🀍', 8: '🀎', 9: '🀏'
};

export const Tile: React.FC<TileProps> = ({ value, onClick, selected, size = 'md' }) => {
    return (
        <div
            onClick={onClick}
            className={`tile tile-${size} ${selected ? 'selected' : ''}`}
        >
            <span style={{ color: value === 5 ? '#D80000' : 'inherit' }}>
                {TILE_MAP[value] || '?'}
            </span>
        </div>
    );
};
