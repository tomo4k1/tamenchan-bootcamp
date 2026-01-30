import React, { useState, useEffect, useCallback } from 'react';
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
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const loadProblem = () => {
            try {
                const p = generateProblem(13, difficulty);
                setProblem(p);
                setSelectedWaits([]);
                setDecomposition(null);
                setGameState('playing');
                setMessage(GAL_MESSAGES.start);
                setErrorMessage('');
            } catch (e) {
                console.error(e);
                const error = e instanceof Error ? e : new Error('Unknown error');
                setGameState('error');
                setErrorMessage(error.message);
                setMessage("エラー出ちゃった🥺");
            }
        };
        loadProblem();
    }, [difficulty]);

    const toggleWait = useCallback((num: number) => {
        if (gameState !== 'playing') return;
        setSelectedWaits(prev =>
            prev.includes(num)
                ? prev.filter(n => n !== num)
                : [...prev, num].sort((a, b) => a - b)
        );
    }, [gameState]);

    const checkAnswer = useCallback(() => {
        if (!problem) return;

        // Sort logic handled in toggleWait, but ensure purity
        const userAns = [...selectedWaits].sort((a, b) => a - b);
        const correctAns = problem.waits;

        const isMatch = JSON.stringify(userAns) === JSON.stringify(correctAns);

        setIsCorrect(isMatch);
        setGameState('result');
        setMessage(isMatch ? GAL_MESSAGES.correct : GAL_MESSAGES.wrong);
    }, [problem, selectedWaits]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameState !== 'playing') return;
            
            // Number keys 1-9
            const num = parseInt(e.key);
            if (num >= 1 && num <= 9) {
                e.preventDefault();
                toggleWait(num);
            }
            
            // Enter to submit
            if (e.key === 'Enter' && selectedWaits.length > 0) {
                e.preventDefault();
                checkAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState, selectedWaits, toggleWait, checkAnswer]);

    const loadNextProblem = () => {
        try {
            const p = generateProblem(13, difficulty);
            setProblem(p);
            setSelectedWaits([]);
            setDecomposition(null);
            setGameState('playing');
            setMessage(GAL_MESSAGES.start);
            setErrorMessage('');
        } catch (e) {
            console.error(e);
            const error = e instanceof Error ? e : new Error('Unknown error');
            setGameState('error');
            setErrorMessage(error.message);
            setMessage("エラー出ちゃった🥺");
        }
    };

    const retryLoadProblem = () => {
        setMessage(GAL_MESSAGES.loading);
        setGameState('playing');
        setTimeout(() => {
            loadNextProblem();
        }, 100);
    };

    if (gameState === 'error') {
        return (
            <div className="quiz-container" role="alert">
                <div className="result-details glass-panel">
                    <h2 className="message-text" style={{ color: '#ff6b6b' }}>
                        {message}
                    </h2>
                    <p className="text-dim" style={{ marginTop: '1rem' }}>
                        {errorMessage || "難易度が高すぎて問題が見つからないかも..."}
                    </p>
                    <p className="text-dim" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        問題が生成できませんでした 😢
                    </p>
                    <button 
                        className="gal-btn primary" 
                        onClick={retryLoadProblem}
                        style={{ marginTop: '1rem' }}
                        aria-label="もう一度問題生成を試す"
                    >
                        もう一度試す 🔄
                    </button>
                </div>
            </div>
        );
    }

    if (!problem) return <div className="loading" role="status" aria-live="polite">{GAL_MESSAGES.loading}</div>;

    return (
        <div className="quiz-container">
            {/* Hand Display */}
            <section className="hand-section glass-panel" aria-label="現在の手牌">
                <div className="hand-grid" role="group">
                    {problem.hand.map((val, idx) => (
                        <Tile key={`${idx}-${val}`} value={val} size="md" />
                    ))}
                </div>
            </section>

            {/* Message / Feedback */}
            <div className="message-area" role="status" aria-live="polite" aria-atomic="true">
                <h2 className={`message-text ${gameState === 'result' ? (isCorrect ? 'neon-text' : 'wrong-text') : ''}`}>
                    {message}
                </h2>
            </div>

            {/* Answer Inputs (1-9) */}
            <section className="answer-section" aria-label="待ち牌選択">
                <p className="instruction">待ち牌を全部選んで！👇</p>
                <p className="text-dim" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    キーボードの数字キー（1-9）でも選択できます
                </p>
                <div className="numpad" role="group" aria-label="数字選択パッド">
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
            </section>

            {/* Actions */}
            <div className="action-area">
                {gameState === 'playing' ? (
                    <button 
                        className="gal-btn primary" 
                        onClick={checkAnswer}
                        aria-label="回答を確定してチェックする"
                        disabled={selectedWaits.length === 0}
                    >
                        ファイナルアンサー？ ✨
                    </button>
                ) : (
                    <button 
                        className="gal-btn secondary" 
                        onClick={loadNextProblem}
                        aria-label="次の問題に進む"
                    >
                        次の問題へ 🚀
                    </button>
                )}
            </div>

            {/* Result Overlay (If Wrong, show answer) */}
            {gameState === 'result' && (
                <section className="result-details glass-panel" aria-label="結果" role="region">
                    <h3>{!isCorrect ? "正解は..." : "ナイス！👍 解説を見る？"}</h3>
                    <div className="flex-row" role="group" aria-label="正解の待ち牌">
                        {problem.waits.map(w => (
                            <button
                                key={w}
                                onClick={() => {
                                    const decomp = getWinningDecomposition(problem.hand, w);
                                    setDecomposition(decomp);
                                }}
                                style={{ 
                                    cursor: 'pointer', 
                                    transition: 'transform 0.2s',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                                aria-label={`${w}の牌の分解図を表示`}
                            >
                                <Tile value={w} size="sm" />
                            </button>
                        ))}
                    </div>

                    {decomposition && (
                        <div className="decomposition-area" style={{ marginTop: '1rem', animation: 'fadeIn 0.5s' }} role="region" aria-label="手牌の分解図">
                            <p className="text-dim">こうやってアガれるよ！👇</p>
                            <div className="flex-row" style={{ gap: '1rem', justifyContent: 'center' }}>
                                {decomposition.map((group, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '8px' }} role="group" aria-label={`グループ${idx + 1}`}>
                                        {group.map((t, i) => (
                                            <Tile key={i} value={t} size="sm" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};
