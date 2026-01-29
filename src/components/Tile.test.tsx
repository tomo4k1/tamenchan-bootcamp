import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Tile } from './Tile';

describe('Tile', () => {
    it('renders tile with correct value', () => {
        render(<Tile value={1} />);
        
        // Should display the corresponding mahjong tile character
        expect(screen.getByText('🀇')).toBeInTheDocument();
    });

    it('renders all tile values correctly', () => {
        const tileMap: Record<number, string> = {
            1: '🀇', 2: '🀈', 3: '🀉', 4: '🀊', 5: '🀋',
            6: '🀌', 7: '🀍', 8: '🀎', 9: '🀏'
        };

        for (let i = 1; i <= 9; i++) {
            const { unmount } = render(<Tile value={i} />);
            expect(screen.getByText(tileMap[i])).toBeInTheDocument();
            unmount();
        }
    });

    it('applies selected class when selected', () => {
        const { container } = render(<Tile value={1} selected={true} />);
        const tileElement = container.querySelector('.tile');
        
        expect(tileElement).toHaveClass('selected');
    });

    it('does not apply selected class when not selected', () => {
        const { container } = render(<Tile value={1} selected={false} />);
        const tileElement = container.querySelector('.tile');
        
        expect(tileElement).not.toHaveClass('selected');
    });

    it('applies correct size classes', () => {
        const { container: containerSm } = render(<Tile value={1} size="sm" />);
        const { container: containerMd } = render(<Tile value={1} size="md" />);
        const { container: containerLg } = render(<Tile value={1} size="lg" />);
        
        expect(containerSm.querySelector('.tile')).toHaveClass('tile-sm');
        expect(containerMd.querySelector('.tile')).toHaveClass('tile-md');
        expect(containerLg.querySelector('.tile')).toHaveClass('tile-lg');
    });

    it('uses medium size by default', () => {
        const { container } = render(<Tile value={1} />);
        const tileElement = container.querySelector('.tile');
        
        expect(tileElement).toHaveClass('tile-md');
    });

    it('calls onClick handler when clicked', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        
        render(<Tile value={1} onClick={handleClick} />);
        
        const tileElement = screen.getByText('🀇').parentElement;
        if (tileElement) {
            await user.click(tileElement);
        }
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not crash when onClick is not provided', async () => {
        const user = userEvent.setup();
        
        render(<Tile value={1} />);
        
        const tileElement = screen.getByText('🀇').parentElement;
        if (tileElement) {
            await user.click(tileElement);
        }
        
        // Should not throw
    });

    it('applies red color to tile value 5', () => {
        const { container } = render(<Tile value={5} />);
        const spanElement = container.querySelector('span');
        
        expect(spanElement).toHaveStyle({ color: '#D80000' });
    });

    it('does not apply red color to non-5 tiles', () => {
        const { container } = render(<Tile value={3} />);
        const spanElement = container.querySelector('span');
        
        expect(spanElement).not.toHaveStyle({ color: '#D80000' });
    });

    it('shows question mark for invalid tile value', () => {
        render(<Tile value={10} />);
        
        expect(screen.getByText('?')).toBeInTheDocument();
    });
});
