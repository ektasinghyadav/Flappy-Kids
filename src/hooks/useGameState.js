// Game state hook — will be implemented in Sprint 3
import { useState } from 'react'

function useGameState() {
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  function startGame() {
    setScore(0)
    setIsPlaying(true)
  }

  function endGame() {
    setIsPlaying(false)
  }

  return { score, setScore, isPlaying, startGame, endGame }
}

export default useGameState
