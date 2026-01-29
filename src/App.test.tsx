import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from './App';

describe('App', () => {
    it('renders start screen initially', () => {
        render(<App />);
        
        expect(screen.getByText(/タメンチャン/)).toBeInTheDocument();
        expect(screen.getByText(/ブートキャンプ/)).toBeInTheDocument();
        expect(screen.getByText(/多面張の待ち、瞬殺できる？/)).toBeInTheDocument();
    });

    it('displays difficulty selection buttons', () => {
        render(<App />);
        
        expect(screen.getByText(/初級 \(全種\)/)).toBeInTheDocument();
        expect(screen.getByText(/中級 \(2面以上\)/)).toBeInTheDocument();
        expect(screen.getByText(/上級 \(3面以上\)/)).toBeInTheDocument();
    });

    it('allows selecting difficulty level', async () => {
        const user = userEvent.setup();
        
        render(<App />);
        
        const easyButton = screen.getByText(/初級 \(全種\)/);
        const mediumButton = screen.getByText(/中級 \(2面以上\)/);
        
        // Default should show hard (3) in start button
        expect(screen.getByText(/Start Training \(上級\)/)).toBeInTheDocument();
        
        // Click medium
        await user.click(mediumButton);
        expect(screen.getByText(/Start Training \(中級\)/)).toBeInTheDocument();
        
        // Click easy
        await user.click(easyButton);
        expect(screen.getByText(/Start Training \(初級\)/)).toBeInTheDocument();
    });

    it('starts game when start button is clicked', async () => {
        const user = userEvent.setup();
        
        render(<App />);
        
        const startButton = screen.getByText(/Start Training/);
        await user.click(startButton);
        
        // Should transition to game screen
        await waitFor(() => {
            expect(screen.queryByText(/タメンチャン/)).not.toBeInTheDocument();
            expect(screen.getByText(/← Back to Home/)).toBeInTheDocument();
        });
    });

    it('returns to home screen when back button is clicked', async () => {
        const user = userEvent.setup();
        
        render(<App />);
        
        // Start game
        const startButton = screen.getByText(/Start Training/);
        await user.click(startButton);
        
        await waitFor(() => {
            expect(screen.getByText(/← Back to Home/)).toBeInTheDocument();
        });
        
        // Click back
        const backButton = screen.getByText(/← Back to Home/);
        await user.click(backButton);
        
        // Should return to start screen
        await waitFor(() => {
            expect(screen.getByText(/タメンチャン/)).toBeInTheDocument();
            expect(screen.getByText(/ブートキャンプ/)).toBeInTheDocument();
        });
    });

    it('passes difficulty to Quiz component', async () => {
        const user = userEvent.setup();
        
        render(<App />);
        
        // Select easy difficulty
        const easyButton = screen.getByText(/初級 \(全種\)/);
        await user.click(easyButton);
        
        // Start game
        const startButton = screen.getByText(/Start Training \(初級\)/);
        await user.click(startButton);
        
        await waitFor(() => {
            expect(screen.queryByText(/タメンチャン/)).not.toBeInTheDocument();
        });
        
        // Quiz should be rendered (we can verify by checking for quiz-specific elements)
        await waitFor(() => {
            expect(screen.queryByText(/準備はいい？/)).toBeInTheDocument();
        });
    });

    it('complete game flow: select difficulty, start, play, back to home', async () => {
        const user = userEvent.setup();
        
        render(<App />);
        
        // 1. Select medium difficulty
        await user.click(screen.getByText(/中級 \(2面以上\)/));
        
        // 2. Start game
        await user.click(screen.getByText(/Start Training \(中級\)/));
        
        // 3. Verify game started
        await waitFor(() => {
            expect(screen.getByText(/← Back to Home/)).toBeInTheDocument();
        });
        
        // 4. Go back to home
        await user.click(screen.getByText(/← Back to Home/));
        
        // 5. Verify back at home
        await waitFor(() => {
            expect(screen.getByText(/タメンチャン/)).toBeInTheDocument();
        });
        
        // 6. Difficulty should be preserved
        expect(screen.getByText(/Start Training \(中級\)/)).toBeInTheDocument();
    });
});
