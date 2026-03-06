import { useState } from 'react'
import NameScreen from './components/NameScreen'
import FaceSelection from './components/FaceSelection'
import ThemeSelection from './components/ThemeSelection'
import GameCanvas from './components/GameCanvas'
import GameOverScreen from './components/GameOverScreen'
import Footer from './components/Footer'
import { saveScore } from './utils/scores'

function App() {
  const [screen, setScreen] = useState('name')
  const [playerName, setPlayerName] = useState('')
  const [selectedFace, setSelectedFace] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState('sunny')
  const [score, setScore] = useState(0)
  const [screenshot, setScreenshot] = useState(null)

  return (
    <>
      {screen === 'name' && (
        <NameScreen
          onContinue={(name) => {
            setPlayerName(name)
            setScreen('face')
          }}
        />
      )}
      {screen === 'face' && (
        <FaceSelection
          onContinue={(face) => {
            setSelectedFace(face)
            setScreen('theme')
          }}
        />
      )}
      {screen === 'theme' && (
        <ThemeSelection
          onContinue={(theme) => {
            setSelectedTheme(theme)
            setScreen('game')
          }}
        />
      )}
      {screen === 'game' && (
        <GameCanvas
          playerName={playerName}
          selectedFace={selectedFace}
          selectedTheme={selectedTheme}
          onGameOver={(finalScore, snapshot) => {
            saveScore(playerName, finalScore)
            setScore(finalScore)
            setScreenshot(snapshot)
            setScreen('gameover')
          }}
        />
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          score={score}
          playerName={playerName}
          screenshot={screenshot}
          onRestart={() => {
            setScore(0)
            setScreenshot(null)
            setScreen('name')
          }}
        />
      )}
      <Footer />
    </>
  )
}

export default App
