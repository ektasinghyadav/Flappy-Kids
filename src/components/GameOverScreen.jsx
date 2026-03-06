import { useState } from 'react'
import { getScores, clearScores } from '../utils/scores'

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4th', '5th']

const PARTICLES = [
  { emoji: '💀', x: 6,  y: 10, delay: 0.0, dur: 3.2 },
  { emoji: '⭐', x: 90, y: 15, delay: 0.7, dur: 2.8 },
  { emoji: '✨', x: 80, y: 72, delay: 1.3, dur: 3.4 },
  { emoji: '🌟', x: 8,  y: 70, delay: 0.4, dur: 2.6 },
  { emoji: '💫', x: 50, y: 5,  delay: 1.0, dur: 3.2 },
  { emoji: '⚡', x: 95, y: 45, delay: 1.8, dur: 2.9 },
  { emoji: '🔮', x: 4,  y: 40, delay: 0.3, dur: 3.5 },
  { emoji: '🪄', x: 88, y: 82, delay: 1.5, dur: 3.0 },
]

function getFunnyMessage(score) {
  if (score === 0)  return "The spell fizzled out... try again! 😅"
  if (score <= 3)   return "Your wand needs more practice! 💪"
  if (score <= 7)   return "A valiant effort, young wizard! 🎯"
  if (score <= 12)  return "The stars shine upon you! 🌟"
  if (score <= 19)  return "Incredible magic! You're amazing! 🔥"
  return "LEGENDARY WIZARD! You're unstoppable! 🏆"
}

function GameOverScreen({ score, playerName, screenshot, onReplay, onNewGame }) {
  const [scores, setScores] = useState(() => getScores(playerName))

  const isNewBest = scores.length > 0 && scores[0] === score

  function handleClear() {
    clearScores(playerName)
    setScores([])
  }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.25); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px #c9a84c44, 0 0 28px #7b2fbe33; }
          50%       { box-shadow: 0 0 24px #c9a84c99, 0 0 50px #7b2fbe66; }
        }
        @keyframes skull-float {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50%       { transform: translateY(-10px) rotate(4deg); }
        }
        .magic-btn { transition: transform 0.15s, box-shadow 0.15s; }
        .magic-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 0 20px #c9a84c88;
        }
        .secondary-btn { transition: transform 0.15s, box-shadow 0.15s; }
        .secondary-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 0 12px #7b2fbe66;
        }
      `}</style>

      {PARTICLES.map((p, i) => (
        <span key={i} style={{
          position: 'fixed',
          left: `${p.x}%`, top: `${p.y}%`,
          fontSize: '1.4rem',
          animation: `twinkle ${p.dur}s ease-in-out ${p.delay}s infinite`,
          pointerEvents: 'none', zIndex: 0, userSelect: 'none',
        }}>
          {p.emoji}
        </span>
      ))}

      <div style={{ textAlign: 'center', padding: '28px 16px', position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px' }}>

        {/* Floating skull */}
        <div style={{
          fontSize: '3.2rem',
          marginBottom: '8px',
          animation: 'skull-float 3s ease-in-out infinite',
          display: 'inline-block',
          filter: 'drop-shadow(0 0 12px #c9a84caa)',
        }}>
          💀
        </div>

        {/* Shimmer title */}
        <h1 style={{
          fontSize: '2.4rem', margin: '0 0 6px',
          background: 'linear-gradient(90deg, #c9a84c, #fff8dc, #f7b731, #fff8dc, #c9a84c)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
          letterSpacing: '2px', textTransform: 'uppercase',
        }}>
          Spell Broken!
        </h1>

        <p style={{ color: '#b39ddb', fontSize: '0.88rem', marginBottom: '20px', fontStyle: 'italic', letterSpacing: '1px' }}>
          ✦ &nbsp; {getFunnyMessage(score)} &nbsp; ✦
        </p>

        {/* Score card */}
        <div style={{
          background: 'linear-gradient(160deg, #1c0a40ee, #0d1b3eee)',
          border: '1px solid #c9a84c77',
          borderRadius: '20px',
          padding: '20px 24px',
          animation: 'glow-pulse 3s ease-in-out infinite',
          marginBottom: '16px',
        }}>
          <p style={{ color: '#b39ddb', margin: '0 0 4px', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
            ⚡ {playerName}&apos;s score
          </p>
          <p style={{
            fontSize: '3.6rem', margin: '0 0 4px', lineHeight: 1,
            background: 'linear-gradient(90deg, #c9a84c, #fff8dc, #f7b731)',
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'shimmer 3s linear infinite',
            fontWeight: 'bold',
          }}>
            {score}
          </p>
          {isNewBest && (
            <p style={{ color: '#f7b731', fontSize: '0.85rem', marginTop: '4px', fontStyle: 'italic', letterSpacing: '0.5px' }}>
              ✨ New personal best! ✨
            </p>
          )}
        </div>

        {/* Leaderboard */}
        {scores.length > 0 && (
          <div style={{
            background: 'linear-gradient(160deg, #1c0a40ee, #0d1b3eee)',
            border: '1px solid #c9a84c55',
            borderRadius: '20px',
            padding: '16px',
            marginBottom: '18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
              <h2 style={{
                fontSize: '1rem', margin: 0, letterSpacing: '1.5px', textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #c9a84c, #f7b731)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                🏆 Your Spellbook
              </h2>
              <button
                onClick={handleClear}
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  border: '1px solid #3a2a5a',
                  background: 'transparent',
                  color: '#6a5a8a',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                }}
              >
                Clear
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scores.map((s, i) => {
                const isCurrentRun = s === score && i === scores.indexOf(score)
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: isCurrentRun ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                      border: isCurrentRun ? '1px solid #c9a84c' : '1px solid #3a2a5a',
                    }}
                  >
                    <span style={{ fontSize: '1rem', minWidth: '32px' }}>{RANK_MEDALS[i]}</span>
                    <span style={{
                      flex: 1, textAlign: 'left', marginLeft: '8px',
                      color: isCurrentRun ? '#f7b731' : '#d4c5f0',
                      fontWeight: isCurrentRun ? 'bold' : 'normal',
                      fontSize: '0.9rem',
                    }}>
                      {playerName}
                    </span>
                    <span style={{
                      color: isCurrentRun ? '#f7b731' : '#9a8ab0',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}>
                      {s}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="magic-btn"
            onClick={onReplay}
            style={{
              fontSize: '1.05rem',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1.5px solid #c9a84c',
              background: 'linear-gradient(135deg, #7b2fbe, #c9a84c, #f7b731)',
              color: '#fff8dc',
              fontFamily: 'inherit',
              cursor: 'pointer',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            ✨ Cast Again ✨
          </button>

          <button
            className="secondary-btn"
            onClick={onNewGame}
            style={{
              fontSize: '1.05rem',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1.5px solid #4a2a7a',
              background: 'rgba(255,255,255,0.04)',
              color: '#b39ddb',
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
          >
            New Wizard
          </button>

          {screenshot && (
            <a
              href={screenshot}
              download={`flappy-kids-${playerName}-${score}.png`}
              style={{ textDecoration: 'none' }}
            >
              <button
                className="secondary-btn"
                style={{
                  fontSize: '1.05rem',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: '1.5px solid #4a2a7a',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#b39ddb',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                }}
              >
                Save Score 📸
              </button>
            </a>
          )}
        </div>

      </div>
    </>
  )
}

export default GameOverScreen
