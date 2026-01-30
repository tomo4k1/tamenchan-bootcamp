import { useState } from 'react';
import { type Difficulty } from './types';
import './index.css';
import { Quiz } from './components/Quiz';

function App() {
  const [inGame, setInGame] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(3); // 1: Any, 2: >=2, 3: >=3

  return (
    <>
      {!inGame ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', width: '90%' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            タメンチャン<br />ブートキャンプ
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            多面張の待ち、瞬殺できる？<br />
            ギャルと一緒に麻雀力、爆上げしよ！🚀
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <p className="text-dim" style={{ marginBottom: '0.5rem' }}>難易度を選んで！😎</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }} role="group" aria-label="難易度選択">
              {[1, 2, 3].map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level as Difficulty)}
                  aria-label={`難易度${level === 1 ? '初級' : level === 2 ? '中級' : '上級'}を選択`}
                  aria-pressed={difficulty === level}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `1px solid ${difficulty === level ? 'var(--primary-neon)' : '#555'}`,
                    background: difficulty === level ? 'rgba(255,0,255,0.2)' : 'transparent',
                    color: difficulty === level ? '#fff' : '#aaa',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {level === 1 ? '初級 (全種)' : level === 2 ? '中級 (2面以上)' : '上級 (3面以上)'}
                </button>
              ))}
            </div>
          </div>

          <button className="gal-btn" onClick={() => setInGame(true)} aria-label="トレーニングを開始">
            Start Training ({difficulty === 1 ? '初級' : difficulty === 2 ? '中級' : '上級'}) 🔥
          </button>
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            className="text-dim"
            style={{ alignSelf: 'flex-start', marginBottom: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setInGame(false)}
            aria-label="ホーム画面に戻る"
          >
            ← Back to Home
          </button>
          <Quiz difficulty={difficulty} />
        </div>
      )}
    </>
  )
}

export default App
