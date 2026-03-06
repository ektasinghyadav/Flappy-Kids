import { useState } from 'react'
import { getScores, clearScores } from '../utils/scores'

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4th', '5th']

function getFunnyMessage(score) {
  if (score === 0)  return "Oops! Try again! 😅"
  if (score <= 3)   return "Nice try! Keep going! 💪"
  if (score <= 7)   return "Almost there! 🎯"
  if (score <= 12)  return "Super flyer! 🌟"
  if (score <= 19)  return "Incredible! You're amazing! 🔥"
  return "LEGENDARY! You're unstoppable! 🏆"
}

function GameOverScreen({ score, playerName, screenshot, onReplay, onNewGame }) {
  const [scores, setScores] = useState(() => getScores(playerName))

  const isNewBest = scores.length > 0 && scores[0] === score

  function handleClear() {
    clearScores(playerName)
    setScores([])
  }

  return (
    <div style={{ textAlign: 'center', padding: '30px 20px', maxWidth: '400px', margin: '0 auto' }}>

      {/* Title */}
      <h1 style={{ fontSize: '2.6rem', marginBottom: '4px' }}>Game Over!</h1>
      <p style={{ color: '#aad4f5', fontSize: '1rem', marginBottom: '16px' }}>
        {getFunnyMessage(score)}
      </p>

      {/* Score box */}
      <div style={{
        background: '#0f1e3a',
        border: '2px solid #2a4a7a',
        borderRadius: '14px',
        padding: '16px 24px',
        marginBottom: '20px',
        display: 'inline-block',
        minWidth: '200px',
      }}>
        <p style={{ color: '#aad4f5', margin: '0 0 4px', fontSize: '0.95rem' }}>
          {playerName}&apos;s score
        </p>
        <p style={{ fontSize: '3rem', color: '#f7b731', margin: 0, lineHeight: 1 }}>
          {score}
        </p>
        {isNewBest && (
          <p style={{ color: '#ffe066', fontSize: '0.85rem', marginTop: '6px' }}>
            New personal best! 🎉
          </p>
        )}
      </div>

      {/* Player's personal score history */}
      {scores.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#f7b731', margin: 0 }}>
              Your Best Scores
            </h2>
            <button
              onClick={handleClear}
              style={{
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: '8px',
                border: '1px solid #555',
                background: 'transparent',
                color: '#888',
                fontFamily: 'inherit',
                cursor: 'pointer',
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
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: isCurrentRun ? 'rgba(247,183,49,0.18)' : '#0f1e3a',
                    border: isCurrentRun ? '1px solid #f7b731' : '1px solid #2a4a7a',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', minWidth: '36px' }}>
                    {RANK_MEDALS[i]}
                  </span>
                  <span style={{
                    flex: 1,
                    textAlign: 'left',
                    color: isCurrentRun ? '#f7b731' : '#ffffff',
                    fontWeight: isCurrentRun ? 'bold' : 'normal',
                    marginLeft: '8px',
                  }}>
                    {playerName}
                  </span>
                  <span style={{
                    color: isCurrentRun ? '#f7b731' : '#ffe082',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
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
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onReplay}
          style={{
            fontSize: '1.2rem',
            padding: '12px 28px',
            borderRadius: '12px',
            border: 'none',
            background: '#f7b731',
            color: '#1a2a4a',
            fontFamily: 'inherit',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Replay 🔄
        </button>

        <button
          onClick={onNewGame}
          style={{
            fontSize: '1.2rem',
            padding: '12px 28px',
            borderRadius: '12px',
            border: '2px solid #2a4a7a',
            background: '#0f1e3a',
            color: '#ffffff',
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          New Game
        </button>

        {screenshot && (
          <a
            href={screenshot}
            download={`flappy-kids-${playerName}-${score}.png`}
            style={{ textDecoration: 'none' }}
          >
            <button
              style={{
                fontSize: '1.2rem',
                padding: '12px 28px',
                borderRadius: '12px',
                border: '2px solid #2a4a7a',
                background: '#0f1e3a',
                color: '#ffffff',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              Save Score 📸
            </button>
          </a>
        )}
      </div>
    </div>
  )
}

export default GameOverScreen
