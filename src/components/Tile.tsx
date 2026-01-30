import React from 'react';
import { type TileProps } from '../types';
import './Tile.css';

const TILE_MAP: Record<number, string> = {
    1: '🀇', 2: '🀈', 3: '🀉', 4: '🀊', 5: '🀋', 6: '🀌', 7: '🀍', 8: '🀎', 9: '🀏'
};

export const Tile: React.FC<TileProps> = ({ value, onClick, selected, size = 'md' }) => {
    const tileLabel = `${value}の牌${selected ? '（選択中）' : ''}`;
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
        }
    };
    
    return (
        <div
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className={`tile tile-${size} ${selected ? 'selected' : ''}`}
            role={onClick ? 'button' : 'img'}
            tabIndex={onClick ? 0 : undefined}
            aria-label={tileLabel}
            aria-pressed={onClick ? selected : undefined}
        >
            <span style={{ color: value === 5 ? '#D80000' : 'inherit' }}>
                {TILE_MAP[value] || '?'}
            </span>
        </div>
    );
};
