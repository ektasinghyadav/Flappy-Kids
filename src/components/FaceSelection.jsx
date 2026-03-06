import { useState } from 'react'

// Each entry: { file: filename in /public/faces/, label: display name }
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

function FaceSelection({ onContinue }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ textAlign: 'center', padding: '30px 20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Choose Your Face!</h2>
      <p style={{ color: '#aad4f5', marginBottom: '24px' }}>Pick a face sticker for your character</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gap: '20px',
        justifyContent: 'center',
        marginBottom: '28px',
      }}>
        {FACES.map(({ file, label }) => (
          <div
            key={file}
            onClick={() => setSelected(file)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            {/* Circular face image */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: selected === file ? '4px solid #f7b731' : '3px solid #2a4a7a',
              boxShadow: selected === file ? '0 0 12px #f7b731aa' : 'none',
              transition: 'border 0.15s, box-shadow 0.15s',
              flexShrink: 0,
            }}>
              <img
                src={`/faces/${file}`}
                alt={label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            {/* Name label */}
            <span style={{
              fontSize: '0.8rem',
              color: selected === file ? '#f7b731' : '#aad4f5',
              fontFamily: 'inherit',
              transition: 'color 0.15s',
            }}>
              {label}
            </span>
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
        Continue →
      </button>
    </div>
  )
}

export default FaceSelection
