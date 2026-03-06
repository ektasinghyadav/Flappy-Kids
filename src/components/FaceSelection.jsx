import { useState } from 'react'

const FACES = [
  { file: 'Angel.jpeg',  label: 'Angel'  },
  { file: 'Ayush.jpeg',  label: 'Ayush'  },
  { file: 'Ekta.jpeg',   label: 'Ekta'   },
  { file: 'Ishani.jpeg', label: 'Ishani' },
  { file: 'Nanu.jpeg',   label: 'Nanu'   },
  { file: 'Om.jpeg',     label: 'Om'     },
  { file: 'Rudra.jpeg',  label: 'Rudra'  },
  { file: 'Siya.jpeg',   label: 'Siya'   },
  { file: 'Tweety.jpeg', label: 'Tweety' },
]

const PARTICLES = [
  { emoji: '✨', x: 6,  y: 10, delay: 0.0, dur: 3.1 },
  { emoji: '⭐', x: 90, y: 15, delay: 0.7, dur: 2.8 },
  { emoji: '💫', x: 80, y: 70, delay: 1.3, dur: 3.4 },
  { emoji: '🌟', x: 8,  y: 72, delay: 0.4, dur: 2.6 },
  { emoji: '✨', x: 50, y: 5,  delay: 1.0, dur: 3.2 },
  { emoji: '⚡', x: 95, y: 45, delay: 1.8, dur: 2.9 },
]

function FaceSelection({ onContinue }) {
  const [selected, setSelected] = useState(null)

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
        @keyframes portrait-glow {
          0%, 100% { box-shadow: 0 0 10px #c9a84c88, 0 0 20px #c9a84c44; }
          50%       { box-shadow: 0 0 18px #f7b731cc, 0 0 36px #c9a84c88; }
        }
        .face-card { transition: transform 0.15s; }
        .face-card:hover { transform: scale(1.08); }
        .magic-btn { transition: transform 0.15s, box-shadow 0.15s; }
        .magic-btn:hover:not(:disabled) {
          transform: scale(1.04);
          box-shadow: 0 0 20px #c9a84c88;
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

        {/* Header */}
        <div style={{ fontSize: '2.4rem', marginBottom: '6px' }}>🪄</div>
        <h2 style={{
          fontSize: '2rem', margin: '0 0 6px',
          background: 'linear-gradient(90deg, #c9a84c, #fff8dc, #f7b731, #fff8dc, #c9a84c)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
          letterSpacing: '2px', textTransform: 'uppercase',
        }}>
          Choose Your Wizard
        </h2>
        <p style={{ color: '#b39ddb', fontSize: '0.88rem', marginBottom: '22px', fontStyle: 'italic', letterSpacing: '1px' }}>
          ✦ &nbsp; Select your magical companion &nbsp; ✦
        </p>

        {/* Glowing card container */}
        <div style={{
          background: 'linear-gradient(160deg, #1c0a40ee, #0d1b3eee)',
          border: '1px solid #c9a84c77',
          borderRadius: '20px',
          padding: '22px 16px',
          animation: 'glow-pulse 3s ease-in-out infinite',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            justifyItems: 'center',
          }}>
            {FACES.map(({ file, label }) => {
              const isSelected = selected === file
              return (
                <div
                  key={file}
                  className="face-card"
                  onClick={() => setSelected(file)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  {/* Portrait frame */}
                  <div style={{
                    width: '78px', height: '78px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: isSelected ? '3px solid #c9a84c' : '2px solid #4a2a7a',
                    animation: isSelected ? 'portrait-glow 1.8s ease-in-out infinite' : 'none',
                    transition: 'border 0.2s',
                    flexShrink: 0,
                  }}>
                    <img
                      src={`/faces/${file}`}
                      alt={label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  {/* Name */}
                  <span style={{
                    fontSize: '0.78rem',
                    color: isSelected ? '#f7b731' : '#b39ddb',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    letterSpacing: '0.5px',
                    transition: 'color 0.15s',
                  }}>
                    {isSelected ? `✨ ${label}` : label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Magic button */}
        <button
          className="magic-btn"
          onClick={() => selected && onContinue(selected)}
          disabled={!selected}
          style={{
            fontSize: '1.1rem',
            padding: '12px 0',
            width: '100%',
            maxWidth: '280px',
            borderRadius: '12px',
            border: selected ? '1.5px solid #c9a84c' : '1.5px solid #333',
            background: selected
              ? 'linear-gradient(135deg, #7b2fbe, #c9a84c, #f7b731)'
              : '#1e1e3a',
            color: selected ? '#fff8dc' : '#555',
            fontFamily: 'inherit',
            cursor: selected ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            letterSpacing: '1.5px',
          }}
        >
          {selected ? '✨  Cast Your Spell  ✨' : 'Pick a wizard...'}
        </button>

      </div>
    </>
  )
}

export default FaceSelection
