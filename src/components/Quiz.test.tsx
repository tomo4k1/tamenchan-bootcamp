import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Quiz } from './Quiz';
import * as generator from '../logic/generator';

describe('Quiz', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders a problem after loading', async () => {
        render(<Quiz difficulty={1} />);
        
        // Wait for problem to be generated
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Should show start message
        expect(screen.getByText(/準備はいい？爆速で解いてこ！/)).toBeInTheDocument();
    });

    it('displays the hand tiles', async () => {
        // Mock generateProblem to return a predictable hand
        vi.spyOn(generator, 'generateProblem').mockReturnValue({
            hand: [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9],
            waits: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        });

        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Check that hand tiles are displayed (13 tiles)
        const handSection = document.querySelector('.hand-grid');
        expect(handSection?.children).toHaveLength(13);
    });

    it('displays answer selection tiles (1-9)', async () => {
        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Should show numpad with 9 tiles
        const numpad = document.querySelector('.numpad');
        expect(numpad?.children).toHaveLength(9);
    });

    it('allows selecting wait tiles', async () => {
        const user = userEvent.setup();
        
        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Click on a tile in the numpad
        const numpadTiles = document.querySelectorAll('.numpad .tile');
        await user.click(numpadTiles[0] as Element);

        // Tile should be selected
        expect(numpadTiles[0]).toHaveClass('selected');
    });

    it('allows deselecting wait tiles', async () => {
        const user = userEvent.setup();
        
        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        const numpadTiles = document.querySelectorAll('.numpad .tile');
        
        // Click to select
        await user.click(numpadTiles[0] as Element);
        expect(numpadTiles[0]).toHaveClass('selected');
        
        // Click again to deselect
        await user.click(numpadTiles[0] as Element);
        expect(numpadTiles[0]).not.toHaveClass('selected');
    });

    it('shows correct message when answer is correct', async () => {
        const user = userEvent.setup();
        
        // Mock with a simple single-wait problem
        vi.spyOn(generator, 'generateProblem').mockReturnValue({
            hand: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
            waits: [7]
        });

        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Select the correct wait (tile 7)
        const numpadTiles = document.querySelectorAll('.numpad .tile');
        await user.click(numpadTiles[6] as Element); // 7th tile (index 6)

        // Submit answer
        const submitButton = screen.getByText(/ファイナルアンサー？/);
        await user.click(submitButton);

        // Should show correct message
        await waitFor(() => {
            expect(screen.getByText(/キャー！天才すぎ！/)).toBeInTheDocument();
        });
    });

    it('shows wrong message when answer is incorrect', async () => {
        const user = userEvent.setup();
        
        vi.spyOn(generator, 'generateProblem').mockReturnValue({
            hand: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
            waits: [7]
        });

        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Select wrong wait
        const numpadTiles = document.querySelectorAll('.numpad .tile');
        await user.click(numpadTiles[0] as Element); // Tile 1

        // Submit answer
        const submitButton = screen.getByText(/ファイナルアンサー？/);
        await user.click(submitButton);

        // Should show wrong message
        await waitFor(() => {
            expect(screen.getByText(/おっしい〜/)).toBeInTheDocument();
        });
    });

    it('shows next problem button after answer', async () => {
        const user = userEvent.setup();
        
        vi.spyOn(generator, 'generateProblem').mockReturnValue({
            hand: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
            waits: [7]
        });

        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        const numpadTiles = document.querySelectorAll('.numpad .tile');
        await user.click(numpadTiles[6] as Element);

        const submitButton = screen.getByText(/ファイナルアンサー？/);
        await user.click(submitButton);

        // Should show next problem button
        await waitFor(() => {
            expect(screen.getByText(/次の問題へ/)).toBeInTheDocument();
        });
    });

    it('loads new problem when next button is clicked', async () => {
        const user = userEvent.setup();
        
        const mockGenerateProblem = vi.spyOn(generator, 'generateProblem');
        
        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        const initialCallCount = mockGenerateProblem.mock.calls.length;

        // Answer first problem
        const numpadTiles = document.querySelectorAll('.numpad .tile');
        await user.click(numpadTiles[6] as Element);
        await user.click(screen.getByText(/ファイナルアンサー？/));

        await waitFor(() => {
            expect(screen.getByText(/次の問題へ/)).toBeInTheDocument();
        });

        // Click next problem
        await user.click(screen.getByText(/次の問題へ/));

        // Should reset to playing state
        await waitFor(() => {
            expect(screen.getByText(/準備はいい？/)).toBeInTheDocument();
        });

        // Should have called generateProblem one more time
        const finalCallCount = mockGenerateProblem.mock.calls.length;
        expect(finalCallCount).toBe(initialCallCount + 1);
    });

    it('handles error when problem generation fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        // Mock generateProblem to throw an error
        vi.spyOn(generator, 'generateProblem').mockImplementation(() => {
            throw new Error('Generation failed');
        });

        render(<Quiz />);
        
        // Should show error message
        await waitFor(() => {
            expect(screen.getByText(/エラー出ちゃった/)).toBeInTheDocument();
        });
        
        // Should show retry button
        expect(screen.getByText(/もう一度試す/)).toBeInTheDocument();
        
        // Should show error details
        expect(screen.getByText(/問題が生成できませんでした/)).toBeInTheDocument();
        
        consoleErrorSpy.mockRestore();
    });

    it('retries problem generation when retry button is clicked', async () => {
        const user = userEvent.setup();
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        const mockGenerateProblem = vi.spyOn(generator, 'generateProblem')
            .mockImplementationOnce(() => {
                throw new Error('First attempt failed');
            })
            .mockReturnValueOnce({
                hand: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
                waits: [7]
            });

        render(<Quiz />);
        
        // Wait for error to appear
        await waitFor(() => {
            expect(screen.getByText(/エラー出ちゃった/)).toBeInTheDocument();
        });
        
        // Click retry button
        const retryButton = screen.getByText(/もう一度試す/);
        await user.click(retryButton);
        
        // Should show loading message briefly
        await waitFor(() => {
            expect(screen.getByText(/問題作ってるよ〜ん/)).toBeInTheDocument();
        });
        
        // Should successfully load problem after retry
        await waitFor(() => {
            expect(screen.getByText(/準備はいい？爆速で解いてこ！/)).toBeInTheDocument();
        });
        
        // Should have called generateProblem twice
        expect(mockGenerateProblem).toHaveBeenCalledTimes(2);
        
        consoleErrorSpy.mockRestore();
    });

    it('shows decomposition when clicking on correct wait tile', async () => {
        const user = userEvent.setup();
        
        vi.spyOn(generator, 'generateProblem').mockReturnValue({
            hand: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5],
            waits: [5]
        });

        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Select correct answer
        const numpadTiles = document.querySelectorAll('.numpad .tile');
        await user.click(numpadTiles[4] as Element); // Tile 5

        // Submit answer
        await user.click(screen.getByText(/ファイナルアンサー？/));

        await waitFor(() => {
            expect(screen.getByText(/キャー！天才すぎ！/)).toBeInTheDocument();
        });

        // Click on the wait tile to show decomposition
        const waitTiles = document.querySelectorAll('.result-details .flex-row > div');
        await user.click(waitTiles[0] as Element);

        // Should show decomposition
        await waitFor(() => {
            expect(screen.getByText(/こうやってアガれるよ！/)).toBeInTheDocument();
        });
    });

    it('prevents selecting waits after game ends', async () => {
        const user = userEvent.setup();
        
        vi.spyOn(generator, 'generateProblem').mockReturnValue({
            hand: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
            waits: [7]
        });

        render(<Quiz />);
        
        await waitFor(() => {
            expect(screen.queryByText(/問題作ってるよ〜ん/)).not.toBeInTheDocument();
        });

        // Select and submit answer
        const numpadTiles = document.querySelectorAll('.numpad .tile');
        await user.click(numpadTiles[6] as Element); // Tile 7
        await user.click(screen.getByText(/ファイナルアンサー？/));

        await waitFor(() => {
            expect(screen.getByText(/次の問題へ/)).toBeInTheDocument();
        });

        // Try to click another tile after game ends
        const tile1 = numpadTiles[0] as Element;
        const hadSelectedBefore = tile1.classList.contains('selected');
        await user.click(tile1);

        // Selection should not change
        const hasSelectedAfter = tile1.classList.contains('selected');
        expect(hasSelectedAfter).toBe(hadSelectedBefore);
    });
});
