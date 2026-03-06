import { useState } from 'react'

const THEMES = [
  { id: 'sunny',   label: '☀️ Sunny Sky',    sky: '#87ceeb', ground: '#8bc34a' },
  { id: 'night',   label: '🌙 Night Sky',    sky: '#0d1b2a', ground: '#1b5e20' },
  { id: 'rainbow', label: '🌈 Rainbow Land', sky: '#ffe0f0', ground: '#ff8a65' },
  { id: 'snow',    label: '❄️ Snow World',   sky: '#dff0ff', ground: '#cfd8dc' },
  { id: 'cloud',   label: '☁️ Cloud World',  sky: '#f0f8ff', ground: '#e0e0e0' },
]

function ThemeSelection({ onContinue }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ textAlign: 'center', padding: '30px 20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Pick a Theme!</h2>
      <p style={{ color: '#aad4f5', marginBottom: '24px' }}>Choose your game world</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            onClick={() => setSelected(theme.id)}
            style={{
              width: '260px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: selected === theme.id ? '#f7b731' : '#0f1e3a',
              border: selected === theme.id ? '2px solid #f7b731' : '2px solid #2a4a7a',
              color: selected === theme.id ? '#1a2a4a' : '#fff',
              cursor: 'pointer',
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Mini sky preview */}
            <div style={{
              width: '48px',
              height: '32px',
              borderRadius: '6px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ width: '100%', height: '65%', background: theme.sky }} />
              <div style={{ width: '100%', height: '35%', background: theme.ground }} />
            </div>
            {theme.label}
          </div>
        ))}
      </div>

      <button
        onClick={() => selected && onContinue(selected)}
        disabled={!selected}
        style={{
          fontSize: '1.2rem',
          padding: '10px 32px',
          borderRadius: '12px',
          border: 'none',
          background: selected ? '#f7b731' : '#555',
          color: '#1a2a4a',
          fontFamily: 'inherit',
          cursor: selected ? 'pointer' : 'not-allowed',
        }}
      >
        Start Game →
      </button>
    </div>
  )
}

export default ThemeSelection
