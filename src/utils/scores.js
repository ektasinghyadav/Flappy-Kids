const KEY = 'flappyKidsScores'
const MAX  = 5

export function getScores() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

// Saves the score, keeps only the top MAX entries sorted by score desc.
// Returns the updated leaderboard array.
export function saveScore(name, score) {
  const scores = getScores()
  scores.push({ name, score })
  scores.sort((a, b) => b.score - a.score)
  const top = scores.slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(top))
  return top
}
