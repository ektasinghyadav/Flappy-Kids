import { getScores } from '../utils/scores'

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4th', '5th']

function getFunnyMessage(score) {
  if (score === 0)       return "Oops! Try again! 😅"
  if (score <= 3)        return "Nice try! Keep going! 💪"
  if (score <= 7)        return "Almost there! 🎯"
  if (score <= 12)       return "Super flyer! 🌟"
  if (score <= 19)       return "Incredible! You're amazing! 🔥"
  return "LEGENDARY! You're unstoppable! 🏆"
}

function GameOverScreen({ score, playerName, screenshot, onRestart }) {
  const scores  = getScores()
  const rank    = scores.findIndex(s => s.name === playerName && s.score === score)
  const isNewBest = rank === 0 && scores.length > 0

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
            New all-time high! 🎉
          </p>
        )}
      </div>

      {/* Leaderboard */}
      {scores.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#f7b731' }}>
            Top Scores
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {scores.map((entry, i) => {
              const isCurrentRun = entry.name === playerName && entry.score === score && i === rank
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
                    {entry.name}
                  </span>
                  <span style={{
                    color: isCurrentRun ? '#f7b731' : '#ffe082',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                  }}>
                    {entry.score}
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
          onClick={onRestart}
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
          Play Again
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
