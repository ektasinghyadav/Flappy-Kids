// Scores are stored per-player so each player only sees their own history
const KEY_PREFIX = 'flappyKids_'
const MAX = 5

export function getScores(name) {
  try {
    return JSON.parse(localStorage.getItem(KEY_PREFIX + name)) || []
  } catch {
    return []
  }
}

// Saves score for this player, keeps their personal top MAX scores.
export function saveScore(name, score) {
  const scores = getScores(name)
  scores.push(score)
  scores.sort((a, b) => b - a)
  const top = scores.slice(0, MAX)
  localStorage.setItem(KEY_PREFIX + name, JSON.stringify(top))
  return top
}

// Wipes all saved scores for this player.
export function clearScores(name) {
  localStorage.removeItem(KEY_PREFIX + name)
}
