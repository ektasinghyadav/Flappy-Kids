import { useState } from 'react'

function NameScreen({ onContinue }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (name.trim()) {
      onContinue(name.trim())
    }
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🐦 Flappy Kids</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#aad4f5' }}>
        Enter your name to play!
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          style={{
            fontSize: '1.2rem',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '2px solid #aad4f5',
            background: '#0f1e3a',
            color: '#fff',
            fontFamily: 'inherit',
            width: '240px',
            outline: 'none',
            marginBottom: '20px',
            display: 'block',
            margin: '0 auto 20px',
          }}
        />
        <button
          type="submit"
          disabled={!name.trim()}
          style={{
            fontSize: '1.2rem',
            padding: '10px 32px',
            borderRadius: '12px',
            border: 'none',
            background: name.trim() ? '#f7b731' : '#555',
            color: '#1a2a4a',
            fontFamily: 'inherit',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Continue →
        </button>
      </form>
    </div>
  )
}

export default NameScreen
