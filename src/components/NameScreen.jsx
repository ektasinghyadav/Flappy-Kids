import { useState } from 'react'

const PARTICLES = [
  { emoji: '⭐', x: 8,  y: 12, delay: 0.0, dur: 3.2 },
  { emoji: '✨', x: 88, y: 18, delay: 0.6, dur: 2.7 },
  { emoji: '🔮', x: 50, y: 8,  delay: 0.9, dur: 3.4 },
  { emoji: '⚡', x: 78, y: 62, delay: 1.4, dur: 2.5 },
  { emoji: '🌟', x: 15, y: 68, delay: 1.0, dur: 3.6 },
  { emoji: '🪄', x: 92, y: 42, delay: 2.0, dur: 2.8 },
  { emoji: '💫', x: 4,  y: 42, delay: 0.3, dur: 3.1 },
  { emoji: '⭐', x: 62, y: 82, delay: 1.7, dur: 2.9 },
  { emoji: '✨', x: 35, y: 88, delay: 0.5, dur: 3.3 },
  { emoji: '🌙', x: 72, y: 10, delay: 1.2, dur: 4.0 },
]

function NameScreen({ onContinue }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim()) onContinue(name.trim())
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.25); }
        }
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px #c9a84c44, 0 0 28px #7b2fbe33, inset 0 0 12px #c9a84c11; }
          50%       { box-shadow: 0 0 24px #c9a84c99, 0 0 50px #7b2fbe66, inset 0 0 20px #c9a84c22; }
        }
        @keyframes input-glow {
          0%, 100% { border-color: #c9a84c66; }
          50%       { border-color: #c9a84ccc; }
        }
        @keyframes stars-drift {
          0%   { transform: translateY(0)    rotate(0deg);  }
          50%  { transform: translateY(-10px) rotate(8deg);  }
          100% { transform: translateY(0)    rotate(0deg);  }
        }
        .magic-input:focus {
          border-color: #c9a84c !important;
          box-shadow: 0 0 0 3px #c9a84c33;
        }
        .magic-btn:hover:not(:disabled) {
          transform: scale(1.04);
          box-shadow: 0 0 20px #c9a84c88;
        }
        .magic-btn { transition: transform 0.15s, box-shadow 0.15s; }
      `}</style>

      {/* Floating magical particles — fixed so they cover the whole screen */}
      {PARTICLES.map((p, i) => (
        <span key={i} style={{
          position: 'fixed',
          left: `${p.x}%`,
          top:  `${p.y}%`,
          fontSize: '1.5rem',
          animation: `twinkle ${p.dur}s ease-in-out ${p.delay}s infinite`,
          pointerEvents: 'none',
          zIndex: 0,
          userSelect: 'none',
        }}>
          {p.emoji}
        </span>
      ))}

      <div style={{
        textAlign: 'center',
        padding: '32px 20px',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '360px',
      }}>

        {/* Floating owl */}
        <div style={{
          fontSize: '4rem',
          marginBottom: '10px',
          animation: 'float 3.5s ease-in-out infinite',
          display: 'inline-block',
          filter: 'drop-shadow(0 0 12px #c9a84caa)',
        }}>
          🦉
        </div>

        {/* Gold shimmer title */}
        <h1 style={{
          fontSize: '2.8rem',
          margin: '0 0 4px',
          background: 'linear-gradient(90deg, #c9a84c, #fff8dc, #f7b731, #fff8dc, #c9a84c)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          Flappy Kids
        </h1>

        {/* Magical subtitle */}
        <p style={{
          fontSize: '0.88rem',
          color: '#b39ddb',
          marginBottom: '26px',
          letterSpacing: '2px',
          fontStyle: 'italic',
          opacity: 0.9,
        }}>
          ✦ &nbsp; The Magical Flight Academy &nbsp; ✦
        </p>

        {/* Glowing card */}
        <div style={{
          background: 'linear-gradient(160deg, #1c0a40ee, #0d1b3eee)',
          border: '1px solid #c9a84c77',
          borderRadius: '20px',
          padding: '28px 24px 24px',
          animation: 'glow-pulse 3s ease-in-out infinite',
          position: 'relative',
        }}>
          {/* Corner crests */}
          <span style={{ position: 'absolute', top: 8, left: 10, fontSize: '1rem', opacity: 0.55, animation: 'stars-drift 4s ease-in-out 0.2s infinite' }}>⚜️</span>
          <span style={{ position: 'absolute', top: 8, right: 10, fontSize: '1rem', opacity: 0.55, animation: 'stars-drift 4s ease-in-out 0.8s infinite' }}>⚜️</span>
          <span style={{ position: 'absolute', bottom: 8, left: 10, fontSize: '1rem', opacity: 0.55, animation: 'stars-drift 4s ease-in-out 1.4s infinite' }}>⚜️</span>
          <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: '1rem', opacity: 0.55, animation: 'stars-drift 4s ease-in-out 2.0s infinite' }}>⚜️</span>

          <p style={{ color: '#d4c5f0', fontSize: '1rem', marginBottom: '16px', letterSpacing: '0.5px' }}>
            🪄 Enter your wizard name
          </p>

          <form onSubmit={handleSubmit}>
            <input
              className="magic-input"
              type="text"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              autoFocus
              style={{
                fontSize: '1.2rem',
                padding: '11px 16px',
                borderRadius: '10px',
                border: '1.5px solid #c9a84c66',
                background: 'rgba(255,248,220,0.06)',
                color: '#fff8dc',
                fontFamily: 'inherit',
                width: '100%',
                outline: 'none',
                marginBottom: '18px',
                display: 'block',
                textAlign: 'center',
                animation: 'input-glow 2.5s ease-in-out infinite',
                boxSizing: 'border-box',
              }}
            />

            <button
              className="magic-btn"
              type="submit"
              disabled={!name.trim()}
              style={{
                fontSize: '1.1rem',
                padding: '12px 0',
                width: '100%',
                borderRadius: '12px',
                border: name.trim() ? '1.5px solid #c9a84c' : '1.5px solid #333',
                background: name.trim()
                  ? 'linear-gradient(135deg, #7b2fbe, #c9a84c, #f7b731)'
                  : '#1e1e3a',
                color: name.trim() ? '#fff8dc' : '#555',
                fontFamily: 'inherit',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
              }}
            >
              {name.trim() ? '✨  Begin the Magic  ✨' : 'Enter your name...'}
            </button>
          </form>
        </div>

        <p style={{
          fontSize: '0.72rem',
          color: '#5a4a7a',
          marginTop: '18px',
          letterSpacing: '1px',
        }}>
          ⚡ &nbsp; Beware of the floating obstacles &nbsp; ⚡
        </p>

      </div>
    </>
  )
}

export default NameScreen
