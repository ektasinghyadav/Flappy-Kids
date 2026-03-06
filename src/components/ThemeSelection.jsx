import { useState } from 'react'

const THEMES = [
  { id: 'sunny',   label: '☀️ Sunny Sky',    sky: '#87ceeb', ground: '#8bc34a', spell: 'Lumos Solem'   },
  { id: 'night',   label: '🌙 Night Sky',    sky: '#0d1b2a', ground: '#1b5e20', spell: 'Nox Stellaris'  },
  { id: 'rainbow', label: '🌈 Rainbow Land', sky: '#ffe0f0', ground: '#ff8a65', spell: 'Spectra Colori'  },
  { id: 'snow',    label: '❄️ Snow World',   sky: '#dff0ff', ground: '#cfd8dc', spell: 'Glacius Totalis' },
  { id: 'cloud',   label: '☁️ Cloud World',  sky: '#f0f8ff', ground: '#e0e0e0', spell: 'Nimbus Ventus'   },
]

const PARTICLES = [
  { emoji: '🔮', x: 7,  y: 14, delay: 0.2, dur: 3.3 },
  { emoji: '⭐', x: 88, y: 20, delay: 0.9, dur: 2.7 },
  { emoji: '✨', x: 5,  y: 65, delay: 0.5, dur: 3.0 },
  { emoji: '💫', x: 92, y: 60, delay: 1.5, dur: 3.5 },
  { emoji: '🌟', x: 48, y: 6,  delay: 1.1, dur: 2.8 },
  { emoji: '🪄', x: 3,  y: 38, delay: 1.8, dur: 3.1 },
]

function ThemeSelection({ onContinue }) {
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
        .theme-card {
          transition: transform 0.15s, box-shadow 0.15s;
          cursor: pointer;
        }
        .theme-card:hover {
          transform: translateX(4px);
          box-shadow: 0 0 14px #c9a84c55;
        }
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

      <div style={{ textAlign: 'center', padding: '28px 16px', position: 'relative', zIndex: 1, width: '100%', maxWidth: '380px' }}>

        {/* Header */}
        <div style={{ fontSize: '2.4rem', marginBottom: '6px' }}>🔮</div>
        <h2 style={{
          fontSize: '2rem', margin: '0 0 6px',
          background: 'linear-gradient(90deg, #c9a84c, #fff8dc, #f7b731, #fff8dc, #c9a84c)',
          backgroundSize: '300% auto',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          animation: 'shimmer 4s linear infinite',
          letterSpacing: '2px', textTransform: 'uppercase',
        }}>
          Choose Your Realm
        </h2>
        <p style={{ color: '#b39ddb', fontSize: '0.88rem', marginBottom: '22px', fontStyle: 'italic', letterSpacing: '1px' }}>
          ✦ &nbsp; Step into your magical world &nbsp; ✦
        </p>

        {/* Glowing card container */}
        <div style={{
          background: 'linear-gradient(160deg, #1c0a40ee, #0d1b3eee)',
          border: '1px solid #c9a84c77',
          borderRadius: '20px',
          padding: '18px 16px',
          animation: 'glow-pulse 3s ease-in-out infinite',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {THEMES.map((theme) => {
              const isSelected = selected === theme.id
              return (
                <div
                  key={theme.id}
                  className="theme-card"
                  onClick={() => setSelected(theme.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                    border: isSelected ? '1.5px solid #c9a84c' : '1px solid #3a2a5a',
                    boxShadow: isSelected ? '0 0 12px #c9a84c55' : 'none',
                    transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Sky/ground preview */}
                  <div style={{
                    width: '46px', height: '30px',
                    borderRadius: '6px', overflow: 'hidden', flexShrink: 0,
                    border: isSelected ? '1px solid #c9a84c' : '1px solid rgba(255,255,255,0.15)',
                  }}>
                    <div style={{ width: '100%', height: '65%', background: theme.sky }} />
                    <div style={{ width: '100%', height: '35%', background: theme.ground }} />
                  </div>

                  {/* Label + spell name */}
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                      fontSize: '1rem',
                      color: isSelected ? '#f7b731' : '#e1d5f5',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      transition: 'color 0.15s',
                    }}>
                      {theme.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#7a6a9a', fontStyle: 'italic', letterSpacing: '0.5px' }}>
                      {theme.spell}
                    </div>
                  </div>

                  {/* Checkmark */}
                  {isSelected && (
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>✨</span>
                  )}
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
          {selected ? '✨  Enter the Realm  ✨' : 'Pick a world...'}
        </button>

      </div>
    </>
  )
}

export default ThemeSelection
