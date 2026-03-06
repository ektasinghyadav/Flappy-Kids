import { useRef, useEffect, useCallback } from 'react'

// Preload a face image and store it in a ref
function useFaceImage(selectedFace) {
  const imgRef = useRef(null)

  useEffect(() => {
    if (!selectedFace) return
    const img = new Image()
    img.src = `/faces/${selectedFace}`
    img.onload = () => { imgRef.current = img }
    img.onerror = () => { imgRef.current = null }
    // Reset while loading
    imgRef.current = null
  }, [selectedFace])

  return imgRef
}

// --- Sound System (Web Audio API — no external files needed) ---
// AudioContext is created lazily on first user gesture (browser requirement)
function createSoundSystem() {
  let ac = null
  function getAC() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) ac = new AC()
    }
    return ac
  }
  function tone(freq, type, duration, freqEnd) {
    const audioCtx = getAC()
    if (!audioCtx) return
    try {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = type
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
      if (freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(freqEnd, audioCtx.currentTime + duration)
      }
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
      osc.start()
      osc.stop(audioCtx.currentTime + duration)
    } catch (_) { /* silently ignore if audio unavailable */ }
  }
  return {
    jump:     () => tone(400, 'sine', 0.12, 620),
    score:    () => tone(880, 'sine', 0.22),
    gameOver: () => tone(300, 'sawtooth', 0.6, 80),
  }
}

// --- Constants ---
const CANVAS_W = 480
const CANVAS_H = 640
const GRAVITY = 0.45
const JUMP_FORCE = -9
const TERMINAL_VEL = 12
const BIRD_X = 110
const BIRD_R = 22
const HITBOX_R = 18
const PIPE_W = 72
const GAP = 190
const PIPE_SPEED = 3
const SUPER_AUNT_SPEED = 2   // Easter egg: slower pipes for "Ekta"
const SPAWN_INTERVAL = 1800
const GROUND_H = 50
const BALLOON_DURATION = 180   // frames (~3 s at 60 fps)
const STAR_R           = 11    // collectible star radius
const TRAIL_MAX_LIFE   = 14    // frames a trail dot stays visible
const TRAIL_CAP        = 18    // max simultaneous trail dots
const SPARK_COLORS  = ['#ffe066', '#ff6eb4', '#6edcff', '#a8ff6e', '#ff9f6e', '#ffffff']
const CONFETTI_COLORS = ['#ff4d4d', '#ff9f00', '#ffff00', '#00cc44', '#00aaff', '#cc44ff', '#ff69b4']

const THEMES = {
  sunny:   { sky: '#87ceeb', pipe: '#4caf50', cap: '#2e7d32', ground: '#8bc34a', bgType: 'clouds',  pipeStyle: 'grass'  },
  night:   { sky: '#0d1b2a', pipe: '#7e57c2', cap: '#4527a0', ground: '#1b5e20', bgType: 'stars',   pipeStyle: 'glow'   },
  rainbow: { sky: '#ffe0f0', pipe: '#e91e63', cap: '#880e4f', ground: '#ff8a65', bgType: 'rainbow', pipeStyle: 'candy'  },
  snow:    { sky: '#dff0ff', pipe: '#64b5f6', cap: '#1565c0', ground: '#cfd8dc', bgType: 'snow',    pipeStyle: 'ice'    },
  cloud:   { sky: '#f0f8ff', pipe: '#80cbc4', cap: '#00695c', ground: '#e0e0e0', bgType: 'clouds',  pipeStyle: 'bamboo' },
}

const RAINBOW_COLORS = ['#ff0000', '#ff7700', '#ffff00', '#00cc00', '#0000ff', '#8b00ff']

function createGameState() {
  return {
    status: 'waiting',  // 'waiting' | 'playing' | 'dead'
    y: CANVAS_H / 2,
    vy: 0,
    pipes: [],
    score: 0,
    started: false,
    lastSpawn: 0,
    deadSince: 0,
    rafId: null,
    particles: [],       // sparkle + confetti particles
    trail: [],           // bird sparkle trail
    bgElements: [],      // animated background decorations (clouds, stars, snow)
    stars: [],           // collectible golden stars
    balloons: [],        // balloon power-up items
    balloonActive: false,
    balloonTimer: 0,
    wingFlap: 0,         // counts down after each jump for wing animation
    gameOverPlayed: false,
  }
}

function GameCanvas({ playerName, selectedFace, selectedTheme, onGameOver }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(createGameState())
  const cbRef = useRef(onGameOver)
  const faceImgRef = useFaceImage(selectedFace)
  const soundsRef = useRef(null)  // initialized lazily on first jump

  // Keep callback ref current without re-triggering the game loop
  useEffect(() => {
    cbRef.current = onGameOver
  }, [onGameOver])

  const jump = useCallback(() => {
    // Initialize AudioContext on first user gesture (browser requirement)
    if (!soundsRef.current) soundsRef.current = createSoundSystem()
    const g = gameRef.current
    if (g.status === 'waiting') {
      g.status = 'playing'
    }
    if (g.status === 'playing') {
      g.vy = JUMP_FORCE
      g.wingFlap = 10   // 10 frames of flap animation
      soundsRef.current.jump()
    }
  }, [])

  // Keyboard listener
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        jump()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  // Main game loop — resets and restarts when theme or name changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const colors = THEMES[selectedTheme] || THEMES.sunny
    const isAunt = playerName === 'Ekta'
    const speed = isAunt ? SUPER_AUNT_SPEED : PIPE_SPEED

    gameRef.current = createGameState()
    const g = gameRef.current

    // ---- Draw helpers ----
    // (initBgElements called below after helpers are defined)

    function drawBird(x, y, vy) {
      const tilt = Math.min(Math.max(vy * 3, -30), 90) * (Math.PI / 180)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(tilt)

      // Wing ellipse — flaps up when player jumps
      const wingY = g.wingFlap > 0 ? -8 : 6
      ctx.fillStyle = '#f9a825'
      ctx.beginPath()
      ctx.ellipse(-8, wingY, 14, 8, -0.3, 0, Math.PI * 2)
      ctx.fill()

      // Body
      ctx.beginPath()
      ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2)
      ctx.fillStyle = '#ffcc02'
      ctx.fill()
      ctx.strokeStyle = '#e6a800'
      ctx.lineWidth = 2
      ctx.stroke()

      // Face sticker: circular clip over the bird's head area
      const faceImg = faceImgRef.current
      if (faceImg) {
        // Draw face image clipped to a circle on the front of the body
        const faceR = BIRD_R - 4   // slightly smaller than bird radius
        const faceCX = 2           // shift slightly right toward beak side
        const faceCY = -2
        ctx.save()
        ctx.beginPath()
        ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(faceImg, faceCX - faceR, faceCY - faceR, faceR * 2, faceR * 2)
        ctx.restore()

        // Thin circle border around the face sticker
        ctx.beginPath()
        ctx.arc(faceCX, faceCY, faceR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Beak (always on top of face)
        ctx.beginPath()
        ctx.moveTo(18, -2)
        ctx.lineTo(28, 2)
        ctx.lineTo(18, 6)
        ctx.closePath()
        ctx.fillStyle = '#ff6f00'
        ctx.fill()
      } else {
        // Fallback: default drawn face when no image loaded
        ctx.beginPath()
        ctx.arc(10, -8, 6, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(12, -8, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#222'
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(18, -2)
        ctx.lineTo(28, 2)
        ctx.lineTo(18, 6)
        ctx.closePath()
        ctx.fillStyle = '#ff6f00'
        ctx.fill()
      }

      // Accessory (hat / crown / sunglasses) based on score
      drawAccessory(g.score)

      ctx.restore()
    }

    function drawPipe(pipe) {
      const CAP_H = 20
      const CAP_X = 6
      const botY = pipe.topH + GAP   // bottom pipe starts here
      const style = colors.pipeStyle

      // Only draw the BOTTOM pipe (top pipe removed)
      if (style === 'candy') {
        const stripeH = 18
        const botH = CANVAS_H - botY
        for (let y = 0; y < botH; y += stripeH) {
          ctx.fillStyle = Math.floor(y / stripeH) % 2 === 0 ? colors.pipe : '#ff80ab'
          ctx.fillRect(pipe.x, botY + y, PIPE_W, Math.min(stripeH, botH - y))
        }

      } else if (style === 'bamboo') {
        ctx.fillStyle = colors.pipe
        ctx.fillRect(pipe.x, botY, PIPE_W, CANVAS_H - botY)
        ctx.fillStyle = colors.cap
        for (let y = 8; y < CANVAS_H - botY - 6; y += 28) {
          ctx.fillRect(pipe.x, botY + y, PIPE_W, 6)
        }

      } else if (style === 'glow') {
        ctx.shadowColor = '#ce93d8'
        ctx.shadowBlur = 14
        ctx.fillStyle = colors.pipe
        ctx.fillRect(pipe.x, botY, PIPE_W, CANVAS_H - botY)
        ctx.shadowBlur = 0

      } else if (style === 'ice') {
        ctx.fillStyle = colors.pipe
        ctx.fillRect(pipe.x, botY, PIPE_W, CANVAS_H - botY)
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.fillRect(pipe.x + 8, botY, 10, CANVAS_H - botY)

      } else {
        ctx.fillStyle = colors.pipe
        ctx.fillRect(pipe.x, botY, PIPE_W, CANVAS_H - botY)
      }

      // Bottom cap only
      ctx.fillStyle = colors.cap
      ctx.fillRect(pipe.x - CAP_X, botY, PIPE_W + CAP_X * 2, CAP_H)
      ctx.shadowBlur = 0
    }

    // ---- Background decorations ----

    function drawCloud(x, y, size, opacity) {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(x,              y,              size * 0.50, 0, Math.PI * 2)
      ctx.arc(x + size * 0.4, y - size * 0.22, size * 0.38, 0, Math.PI * 2)
      ctx.arc(x + size * 0.8, y,              size * 0.44, 0, Math.PI * 2)
      ctx.arc(x + size * 0.4, y + size * 0.20, size * 0.32, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function initBgElements() {
      const bgType = colors.bgType
      if (bgType === 'stars') {
        for (let i = 0; i < 42; i++) {
          g.bgElements.push({
            type: 'star',
            x: Math.random() * CANVAS_W,
            y: Math.random() * (CANVAS_H * 0.80),
            size: 1 + Math.random() * 2.2,
            phase: Math.random() * Math.PI * 2,
          })
        }
      } else if (bgType === 'clouds' || bgType === 'rainbow') {
        const count = bgType === 'rainbow' ? 4 : 6
        for (let i = 0; i < count; i++) {
          g.bgElements.push({
            type: 'cloud',
            x: Math.random() * CANVAS_W,
            y: 50 + Math.random() * 200,
            size: 28 + Math.random() * 38,
            speed: 0.25 + Math.random() * 0.35,
            opacity: 0.55 + Math.random() * 0.40,
          })
        }
      } else if (bgType === 'snow') {
        for (let i = 0; i < 28; i++) {
          g.bgElements.push({
            type: 'snowflake',
            x: Math.random() * CANVAS_W,
            y: Math.random() * CANVAS_H,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.5 + Math.random() * 1.0,
            size: 2 + Math.random() * 3.5,
            opacity: 0.5 + Math.random() * 0.5,
          })
        }
      }
    }

    function updateBgElements() {
      for (const el of g.bgElements) {
        if (el.type === 'cloud') {
          el.x -= el.speed
          if (el.x + el.size * 1.6 < 0) el.x = CANVAS_W + el.size
        } else if (el.type === 'snowflake') {
          el.x += el.vx
          el.y += el.vy
          if (el.y > CANVAS_H + 8) { el.y = -8; el.x = Math.random() * CANVAS_W }
        }
        // stars don't move — they twinkle using ts in draw
      }
    }

    function drawBackground(ts) {
      const bgType = colors.bgType

      if (bgType === 'stars') {
        // Twinkling stars
        for (const el of g.bgElements) {
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(ts * 0.0018 + el.phase))
          ctx.fillStyle = `rgba(255,255,255,${tw.toFixed(2)})`
          ctx.beginPath()
          ctx.arc(el.x, el.y, el.size, 0, Math.PI * 2)
          ctx.fill()
        }
        // Crescent moon
        ctx.fillStyle = '#ffe082'
        ctx.beginPath()
        ctx.arc(390, 58, 22, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = THEMES.night.sky
        ctx.beginPath()
        ctx.arc(400, 51, 18, 0, Math.PI * 2)
        ctx.fill()

      } else if (bgType === 'clouds') {
        for (const el of g.bgElements) {
          drawCloud(el.x, el.y, el.size, el.opacity)
        }

      } else if (bgType === 'rainbow') {
        // Rainbow arcs in background
        ctx.save()
        for (let i = 0; i < RAINBOW_COLORS.length; i++) {
          ctx.strokeStyle = RAINBOW_COLORS[i]
          ctx.lineWidth = 13
          ctx.globalAlpha = 0.28
          ctx.beginPath()
          ctx.arc(CANVAS_W / 2, CANVAS_H * 0.72, 190 + i * 14, Math.PI, 0)
          ctx.stroke()
        }
        ctx.restore()
        for (const el of g.bgElements) {
          drawCloud(el.x, el.y, el.size, el.opacity)
        }

      } else if (bgType === 'snow') {
        // Snowflakes
        for (const el of g.bgElements) {
          ctx.fillStyle = `rgba(255,255,255,${el.opacity.toFixed(2)})`
          ctx.beginPath()
          ctx.arc(el.x, el.y, el.size, 0, Math.PI * 2)
          ctx.fill()
        }
        // Static snow clouds at top
        drawCloud(70,  38, 52, 0.75)
        drawCloud(260, 28, 42, 0.65)
        drawCloud(420, 46, 38, 0.70)
      }
    }

    // ---- Particle helpers ----

    function spawnSparkles(x, y) {
      // 8 small star sparkles burst from the bird when scoring
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const speed = 2 + Math.random() * 2
        g.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 30, maxLife: 30,
          color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
          size: 4 + Math.random() * 3,
          type: 'star',
        })
      }
    }

    function spawnConfetti(x, y) {
      // 20 confetti pieces at score milestone (score 10)
      for (let i = 0; i < 20; i++) {
        g.particles.push({
          x: x + (Math.random() - 0.5) * 60,
          y: y - Math.random() * 40,
          vx: (Math.random() - 0.5) * 5,
          vy: -3 - Math.random() * 3,
          life: 55, maxLife: 55,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 6 + Math.random() * 4,
          type: 'confetti',
        })
      }
    }

    function updateParticles() {
      for (const p of g.particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.18   // gentle gravity on particles
        p.life--
      }
      g.particles = g.particles.filter(p => p.life > 0)
    }

    function drawParticles() {
      for (const p of g.particles) {
        const alpha = p.life / p.maxLife
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        if (p.type === 'star') {
          // Draw a small 4-pointed star
          ctx.translate(p.x, p.y)
          ctx.beginPath()
          for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2
            const inner = p.size * 0.4
            ctx.lineTo(Math.cos(a) * p.size, Math.sin(a) * p.size)
            ctx.lineTo(Math.cos(a + Math.PI / 4) * inner, Math.sin(a + Math.PI / 4) * inner)
          }
          ctx.closePath()
          ctx.fill()
        } else {
          // Draw a small square confetti piece (rotated)
          ctx.translate(p.x, p.y)
          ctx.rotate(p.life * 0.15)
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        }
        ctx.restore()
      }
    }

    // ---- Power-up & accessory draw helpers ----

    function drawStar(x, y, angle) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = '#ffe066'
      ctx.strokeStyle = '#ff9f00'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const outer = ((i * 2) / 10) * Math.PI * 2 - Math.PI / 2
        const inner = ((i * 2 + 1) / 10) * Math.PI * 2 - Math.PI / 2
        if (i === 0) ctx.moveTo(Math.cos(outer) * STAR_R, Math.sin(outer) * STAR_R)
        else         ctx.lineTo(Math.cos(outer) * STAR_R, Math.sin(outer) * STAR_R)
        ctx.lineTo(Math.cos(inner) * (STAR_R * 0.42), Math.sin(inner) * (STAR_R * 0.42))
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    function drawBalloonItem(x, y) {
      // String
      ctx.strokeStyle = 'rgba(150,150,150,0.8)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x, y + 20)
      ctx.lineTo(x + 3, y + 36)
      ctx.stroke()
      // Balloon body
      ctx.fillStyle = '#ff6eb4'
      ctx.strokeStyle = '#cc3399'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(x, y, 14, 18, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.beginPath()
      ctx.ellipse(x - 4, y - 5, 4, 6, -0.3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draws hat / crown / sunglasses based on score — called inside drawBird (same transform)
    function drawAccessory(score) {
      if (score >= 15) {
        // Sunglasses
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 2
        ctx.fillStyle = 'rgba(30,100,220,0.45)'
        ctx.beginPath(); ctx.ellipse(-6, -4, 7, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        ctx.beginPath(); ctx.ellipse( 9, -4, 7, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        // Bridge
        ctx.beginPath(); ctx.moveTo(2, -4); ctx.lineTo(2, -4); ctx.stroke()
      } else if (score >= 10) {
        // Crown
        ctx.fillStyle = '#f7b731'
        ctx.strokeStyle = '#c68800'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(-12, -BIRD_R - 1)
        ctx.lineTo(-12, -BIRD_R - 13)
        ctx.lineTo( -4, -BIRD_R -  7)
        ctx.lineTo(  0, -BIRD_R - 19)
        ctx.lineTo(  4, -BIRD_R -  7)
        ctx.lineTo( 12, -BIRD_R - 13)
        ctx.lineTo( 12, -BIRD_R -  1)
        ctx.closePath()
        ctx.fill(); ctx.stroke()
        // Gem on crown tip
        ctx.fillStyle = '#e91e63'
        ctx.beginPath(); ctx.arc(0, -BIRD_R - 19, 3, 0, Math.PI * 2); ctx.fill()
      } else if (score >= 5) {
        // Party hat
        ctx.fillStyle = '#e91e63'
        ctx.beginPath()
        ctx.moveTo(-10, -BIRD_R + 1)
        ctx.lineTo( 10, -BIRD_R + 1)
        ctx.lineTo(  0, -BIRD_R - 22)
        ctx.closePath(); ctx.fill()
        // Stripes
        ctx.strokeStyle = '#f7b731'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(-5, -BIRD_R -  5); ctx.lineTo( 5, -BIRD_R -  5); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(-2, -BIRD_R - 12); ctx.lineTo( 2, -BIRD_R - 12); ctx.stroke()
        // Pom-pom
        ctx.fillStyle = '#f7b731'
        ctx.beginPath(); ctx.arc(0, -BIRD_R - 22, 3.5, 0, Math.PI * 2); ctx.fill()
      }
    }

    // Initialize background decorations once helpers are defined
    initBgElements()

    // ---- Main loop ----

    function loop(ts) {
      // Physics — runs when not in waiting state
      if (g.status !== 'waiting') {
        const effGravity  = g.balloonActive ? GRAVITY * 0.22  : GRAVITY
        const effTerminal = g.balloonActive ? 2.5             : TERMINAL_VEL
        g.vy = Math.min(g.vy + effGravity, effTerminal)
        g.y += g.vy

        // Ceiling: bounce, no death
        if (g.y < BIRD_R) {
          g.y = BIRD_R
          g.vy = 0
        }

        // Floor: instant death
        if (g.y > CANVAS_H - GROUND_H - BIRD_R && g.status === 'playing') {
          g.status = 'dead'
          g.deadSince = ts
          g.y = CANVAS_H - GROUND_H - BIRD_R
        }
      }

      // Game logic — runs only while playing
      if (g.status === 'playing') {
        if (!g.started) {
          g.started = true
          g.lastSpawn = ts
        }

        // Dynamic speed — halved while balloon power-up is active
        const moveSpeed = g.balloonActive ? speed * 0.45 : speed

        // Spawn pipes
        if (ts - g.lastSpawn > SPAWN_INTERVAL) {
          const minTop = 80
          const maxTop = CANVAS_H - GAP - 100
          const topH = minTop + Math.random() * (maxTop - minTop)
          g.pipes.push({ x: CANVAS_W, topH, scored: false })

          // Always spawn a collectible star in the gap
          const gapMid = topH + GAP / 2
          g.stars.push({
            x: CANVAS_W + PIPE_W * 0.5,
            y: gapMid + (Math.random() - 0.5) * (GAP * 0.45),
            angle: 0,
          })

          // 25% chance to spawn a balloon power-up
          if (Math.random() < 0.25) {
            g.balloons.push({ x: CANVAS_W + PIPE_W * 0.5, y: gapMid - 36 })
          }

          g.lastSpawn = ts
        }

        // Move & cull pipes, stars, balloons
        for (const pipe of g.pipes) pipe.x -= moveSpeed
        g.pipes = g.pipes.filter(p => p.x > -PIPE_W - 15)

        for (const star of g.stars) {
          star.x -= moveSpeed
          star.angle += 0.045
        }
        g.stars = g.stars.filter(s => s.x > -20 && !s.collected)

        for (const balloon of g.balloons) {
          balloon.x -= moveSpeed
          balloon.y -= 0.25   // gentle upward drift
        }
        g.balloons = g.balloons.filter(b => b.x > -30 && !b.collected)

        // Score + collision
        for (const pipe of g.pipes) {
          if (pipe.x + PIPE_W < BIRD_X - BIRD_R && !pipe.scored) {
            pipe.scored = true
            g.score++
            soundsRef.current?.score()
            spawnSparkles(BIRD_X, g.y)
            // Confetti celebration at score 10
            if (g.score === 10) spawnConfetti(BIRD_X, g.y)
          }

          const inX = BIRD_X + HITBOX_R > pipe.x && BIRD_X - HITBOX_R < pipe.x + PIPE_W
          if (inX) {
            // Only bottom pipe exists — die if bird dips below its top edge
            if (g.y + HITBOX_R > pipe.topH + GAP) {
              g.status = 'dead'
              g.deadSince = ts
            }
          }
        }

        // Star collection
        for (const star of g.stars) {
          if (!star.collected) {
            const dx = BIRD_X - star.x
            const dy = g.y - star.y
            if (dx * dx + dy * dy < (HITBOX_R + STAR_R) ** 2) {
              star.collected = true
              g.score++
              soundsRef.current?.score()
              spawnSparkles(star.x, star.y)
            }
          }
        }

        // Balloon collection
        for (const balloon of g.balloons) {
          if (!balloon.collected) {
            const dx = BIRD_X - balloon.x
            const dy = g.y - balloon.y
            if (dx * dx + dy * dy < (HITBOX_R + 16) ** 2) {
              balloon.collected = true
              g.balloonActive = true
              g.balloonTimer = BALLOON_DURATION
              spawnSparkles(balloon.x, balloon.y)
            }
          }
        }

        // Countdown balloon timer
        if (g.balloonActive) {
          g.balloonTimer--
          if (g.balloonTimer <= 0) g.balloonActive = false
        }
      }

      // Play game over sound once when bird dies
      if (g.status === 'dead' && !g.gameOverPlayed) {
        g.gameOverPlayed = true
        soundsRef.current?.gameOver()
      }

      // Update particles, bg elements, trail, and wing flap every frame
      updateParticles()
      updateBgElements()
      if (g.wingFlap > 0) g.wingFlap--

      // Spawn a new trail dot behind the bird while playing
      if (g.status === 'playing') {
        if (g.trail.length >= TRAIL_CAP) g.trail.shift()
        g.trail.push({ x: BIRD_X - BIRD_R, y: g.y, life: TRAIL_MAX_LIFE })
      }
      // Age and cull trail dots
      for (const t of g.trail) t.life--
      g.trail = g.trail.filter(t => t.life > 0)

      // Dead timer — wait 1200ms then capture screenshot and call onGameOver
      if (g.status === 'dead' && ts - g.deadSince > 1200) {
        cancelAnimationFrame(g.rafId)
        const snapshot = canvas.toDataURL('image/png')
        cbRef.current(g.score, snapshot)
        return
      }

      // ---- Render ----

      // 1. Sky background
      ctx.fillStyle = colors.sky
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // 1b. Animated background decorations (clouds / stars / snow)
      drawBackground(ts)

      // 2. Pipes
      for (const pipe of g.pipes) {
        drawPipe(pipe)
      }

      // 2b. Collectible stars and balloons (drawn in front of pipes)
      for (const star of g.stars) {
        if (!star.collected) drawStar(star.x, star.y, star.angle)
      }
      for (const balloon of g.balloons) {
        if (!balloon.collected) drawBalloonItem(balloon.x, balloon.y)
      }

      // 3. Ground strip (covers pipe bottoms)
      ctx.fillStyle = colors.ground
      ctx.fillRect(0, CANVAS_H - GROUND_H, CANVAS_W, GROUND_H)
      ctx.fillStyle = 'rgba(0,0,0,0.08)'
      ctx.fillRect(0, CANVAS_H - GROUND_H, CANVAS_W, 3)

      // 4. Bird trail (drawn behind the bird)
      for (let i = 0; i < g.trail.length; i++) {
        const t = g.trail[i]
        const alpha = (t.life / TRAIL_MAX_LIFE) * 0.65
        const radius = 3.5 * (t.life / TRAIL_MAX_LIFE)
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = SPARK_COLORS[i % SPARK_COLORS.length]
        ctx.beginPath()
        ctx.arc(t.x, t.y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 4b. Bird
      drawBird(BIRD_X, g.y, g.vy)

      // 4b. Particles (sparkles and confetti drawn on top of bird)
      drawParticles()

      // 5. HUD — score big top-center with outline
      ctx.font = 'bold 48px "Fredoka One", cursive'
      ctx.textAlign = 'center'
      ctx.lineWidth = 4
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      ctx.strokeText(String(g.score), CANVAS_W / 2, 60)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(String(g.score), CANVAS_W / 2, 60)

      // Player name top-left
      ctx.font = '16px "Fredoka One", cursive'
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.fillText(playerName, 12, 28)

      // Balloon power-up indicator (top-right)
      if (g.balloonActive) {
        const progress = g.balloonTimer / BALLOON_DURATION
        ctx.font = '15px "Fredoka One", cursive'
        ctx.textAlign = 'right'
        ctx.fillStyle = '#ff6eb4'
        ctx.fillText('🎈 FLOAT!', CANVAS_W - 10, 24)
        // Progress bar background
        ctx.fillStyle = 'rgba(255,110,180,0.25)'
        ctx.fillRect(CANVAS_W - 88, 30, 78, 7)
        // Progress bar fill
        ctx.fillStyle = '#ff6eb4'
        ctx.fillRect(CANVAS_W - 88, 30, 78 * progress, 7)
      }

      // 6. Overlays
      if (g.status === 'waiting') {
        ctx.fillStyle = 'rgba(0,0,0,0.25)'
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

        ctx.textAlign = 'center'
        ctx.font = 'bold 28px "Fredoka One", cursive'
        ctx.lineWidth = 3
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.strokeText('Tap or SPACE to Start! 🐦', CANVAS_W / 2, CANVAS_H / 2)
        ctx.fillStyle = '#ffffff'
        ctx.fillText('Tap or SPACE to Start! 🐦', CANVAS_W / 2, CANVAS_H / 2)

        // Easter egg: Super Aunt Mode
        if (isAunt) {
          ctx.font = '20px "Fredoka One", cursive'
          ctx.lineWidth = 2
          ctx.strokeStyle = 'rgba(0,0,0,0.4)'
          ctx.strokeText('Super Aunt Mode Activated 💖', CANVAS_W / 2, CANVAS_H / 2 + 44)
          ctx.fillStyle = '#ff80ab'
          ctx.fillText('Super Aunt Mode Activated 💖', CANVAS_W / 2, CANVAS_H / 2 + 44)
        }
      }

      if (g.status === 'dead') {
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

        ctx.textAlign = 'center'
        ctx.font = 'bold 42px "Fredoka One", cursive'
        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(0,0,0,0.6)'
        ctx.strokeText('Game Over! 💥', CANVAS_W / 2, CANVAS_H / 2 - 20)
        ctx.fillStyle = '#ffffff'
        ctx.fillText('Game Over! 💥', CANVAS_W / 2, CANVAS_H / 2 - 20)

        ctx.font = '24px "Fredoka One", cursive'
        ctx.lineWidth = 3
        ctx.strokeText(`Score: ${g.score}`, CANVAS_W / 2, CANVAS_H / 2 + 26)
        ctx.fillStyle = '#ffe082'
        ctx.fillText(`Score: ${g.score}`, CANVAS_W / 2, CANVAS_H / 2 + 26)
      }

      g.rafId = requestAnimationFrame(loop)
    }

    g.rafId = requestAnimationFrame(loop)

    return () => {
      if (g.rafId) cancelAnimationFrame(g.rafId)
    }
  }, [selectedTheme, playerName])

  const handleTouch = useCallback((e) => {
    e.preventDefault()
    jump()
  }, [jump])

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={jump}
        onTouchStart={handleTouch}
        style={{
          borderRadius: '12px',
          display: 'block',
          margin: '0 auto',
          cursor: 'pointer',
          maxWidth: '100%',
          touchAction: 'none',
        }}
      />
    </div>
  )
}

export default GameCanvas
