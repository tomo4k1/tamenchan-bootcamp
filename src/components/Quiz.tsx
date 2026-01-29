import React, { useState, useEffect } from 'react';
import { generateProblem } from '../logic/generator';
import { getWinningDecomposition } from '../logic/mahjong';
import { type Problem, type GalMessages, type GameState } from '../types';
import { Tile } from './Tile';
import './Quiz.css';

const GAL_MESSAGES: GalMessages = {
    start: "準備はいい？爆速で解いてこ！🔥",
    correct: "キャー！天才すぎ！💖 その調子！",
    wrong: "おっしい〜💦 でも次は絶対イケるし！",
    loading: "問題作ってるよ〜ん⏳"
};

export const Quiz: React.FC<{ difficulty?: number }> = ({ difficulty = 3 }) => {
    const [problem, setProblem] = useState<Problem | null>(null);
    const [selectedWaits, setSelectedWaits] = useState<number[]>([]);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [isCorrect, setIsCorrect] = useState(false);
    const [message, setMessage] = useState(GAL_MESSAGES.start);
    const [decomposition, setDecomposition] = useState<number[][] | null>(null);

    useEffect(() => {
        loadProblem();
    }, []);

    const loadProblem = () => {
        try {
            const p = generateProblem(13, difficulty); // Default to hard mode (13 tiles)
            setProblem(p);
            setSelectedWaits([]);
            setDecomposition(null);
            setGameState('playing');
            setMessage(GAL_MESSAGES.start);
        } catch (e) {
            console.error(e);
            setMessage("エラー出ちゃった🥺 リロードして！");
        }
    };

    const toggleWait = (num: number) => {
        if (gameState !== 'playing') return;
        setSelectedWaits(prev =>
            prev.includes(num)
                ? prev.filter(n => n !== num)
                : [...prev, num].sort((a, b) => a - b)
        );
    };

    const checkAnswer = () => {
        if (!problem) return;

        // Sort logic handled in toggleWait, but ensure purity
        const userAns = [...selectedWaits].sort((a, b) => a - b);
        const correctAns = problem.waits;

        const isMatch = JSON.stringify(userAns) === JSON.stringify(correctAns);

        setIsCorrect(isMatch);
        setGameState('result');
        setMessage(isMatch ? GAL_MESSAGES.correct : GAL_MESSAGES.wrong);
    };

    if (!problem) return <div className="loading">{GAL_MESSAGES.loading}</div>;

    return (
        <div className="quiz-container">
            {/* Hand Display */}
            <div className="hand-section glass-panel">
                <div className="hand-grid">
                    {problem.hand.map((val, idx) => (
                        <Tile key={`${idx}-${val}`} value={val} size="md" />
                    ))}
                </div>
            </div>

            {/* Message / Feedback */}
            <div className="message-area">
                <h2 className={`message-text ${gameState === 'result' ? (isCorrect ? 'neon-text' : 'wrong-text') : ''}`}>
                    {message}
                </h2>
            </div>

            {/* Answer Inputs (1-9) */}
            <div className="answer-section">
                <p className="instruction">待ち牌を全部選んで！👇</p>
                <div className="numpad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <Tile
                            key={num}
                            value={num}
                            selected={selectedWaits.includes(num)}
                            onClick={() => toggleWait(num)}
                            size="sm"
                        />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="action-area">
                {gameState === 'playing' ? (
                    <button className="gal-btn primary" onClick={checkAnswer}>
                        ファイナルアンサー？ ✨
                    </button>
                ) : (
                    <button className="gal-btn secondary" onClick={loadProblem}>
                        次の問題へ 🚀
                    </button>
                )}
            </div>

            {/* Result Overlay (If Wrong, show answer) */}
            {gameState === 'result' && (
                <div className="result-details glass-panel">
                    <h3>{!isCorrect ? "正解は..." : "ナイス！👍 解説を見る？"}</h3>
                    <div className="flex-row">
                        {problem.waits.map(w => (
                            <div key={w} onClick={() => {
                                const decomp = getWinningDecomposition(problem.hand, w);
                                setDecomposition(decomp);
                            }} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                                title="タップで分解図を見る">
                                <Tile value={w} size="sm" />
                            </div>
                        ))}
                    </div>

                    {decomposition && (
                        <div className="decomposition-area" style={{ marginTop: '1rem', animation: 'fadeIn 0.5s' }}>
                            <p className="text-dim">こうやってアガれるよ！👇</p>
                            <div className="flex-row" style={{ gap: '1rem', justifyContent: 'center' }}>
                                {decomposition.map((group, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '8px' }}>
                                        {group.map((t, i) => (
                                            <Tile key={i} value={t} size="sm" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
