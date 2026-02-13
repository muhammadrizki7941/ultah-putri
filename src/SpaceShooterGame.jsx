import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================
// SPACE SHOOTER MINI GAME — Fullscreen, 9 Lives Boss System
// ============================================================

const ENEMY_MESSAGES = [
  { emoji: '👾', msg: 'Putri itu cantik — bahkan pas lagi ngambek 🤍' },
  { emoji: '👽', msg: 'Wah jago juga kamu nembaknya~ Kayak jago nembak hati aku 🫠' },
  { emoji: '🛸', msg: 'Putri itu kuat, lebih dari yang dia akui 💪' },
  { emoji: '👾', msg: 'Nice shot! Tapi tetep gak se-nice senyum kamu 😊' },
  { emoji: '👽', msg: 'Putri gak enakan sama semua orang, padahal dia layak dimanjain 🥺' },
  { emoji: '🛸', msg: 'Kamu itu langka — kayak WiFi gratis yang kenceng 📶' },
  { emoji: '👾', msg: 'Diem-diem Putri perhatian, cuma gak mau keliatan 🫣' },
  { emoji: '👽', msg: 'Putri layak dapetin yang terbaik — bukan sisa 💎' },
  { emoji: '🛸', msg: 'Satu lagi! Kamu emang jago — di game dan di kehidupan 🏆' },
  { emoji: '👾', msg: 'Ahh, Putri .. Putri, kenapa bikin aku candu si 🌟' },
]

const BOSS_HIT_MESSAGES = [
  'Aw! Sakit... apalagi lihat kenyataan 💀',
  'Aduh! Gak sesakit kamu yang suka ngambek tiba-tiba sih 😤',
  'Ouch! Kamu kalau marah diem aja, itu lebih sakit tau 🫠',
  'Aaa! Gak enakan kamu kemana sekarang? Kok tega! 😭',
  'Sakit! Tapi gak sesakit nunggu chat kamu yang isinya cuma "hm" 💀',
  'ADUHH! Kamu itu pendiem tapi pukulannya keras juga ya 🫣',
  'Awww! Kayak ditinggal read... eh ditembak deng 😵',
  'UGH hampir kalah... persis kayak aku kalah sama sifat cuek kamu 🏳️',
]

const BOSS_FINAL_MESSAGE = 'Ya Allah, di balik semua ujian — diamnya, cueknya, ngambeknya — jadikanlah itu semua jalan bagi kami untuk saling memahami. Lembutkan hatinya, jaga hatinya, dan pertemukan kami di jalan yang Engkau ridhai. Aamiin 🤲🤍'

const PUTRI_HIT_REACTIONS = [
  'Aman aman~ 😌',
  'Aku gak papa kok 🙂',
  'Sakit si, tapi ya udahlah namanya juga idup 🤷‍♀️',
  'Aduh! ...gapapa gapapa 😅',
  'Eh kena.. gpp deh, aku kuat kok 💪',
  'Gak usah khawatir, aku fine~ ✨',
  'Ouch— eh engga kok, aku baik-baik aja 🫣',
  'Yaudah lah ya, ntar juga sembuh 😊',
  'Gpp kok, aku udah biasa 🥲',
  'Hehe kena deh... santai santai 🤭',
  'Duh kena~ Tapi gak sesakit nunggu balesan chat 💀',
  'Aw! Tapi... aku gak mau ngerepotin 🥺',
  'Gapapa, yang penting gak ngerepotin siapa-siapa 🙃',
  'Kena lagi... ya udah deh, aku ikhlas 😇',
  'Aduh! Tapi aku gak mau ngeluh, jadi ya gini aja 🫠',
  'Aku tuh kuat... cuma kadang cape aja 😮‍💨',
  'Gpp, anggap aja latihan sabar 🧘‍♀️',
  'Kena! Tapi bukan masalah besar kok 🤏',
  'Hmm kena... tapi aku gak mau bikin drama 🎭',
  'Ah gpp, yang penting semua orang seneng 🌸',
]

// 9 Boss Phases — each life has unique appearance, difficulty, and personality
const BOSS_PHASES = [
  { emoji: '👾', name: 'Shadow Minion', shootMin: 0.9, shootMax: 1.4, bulletCount: 1, spread: 5, bulletSpeed: 35, playerDmg: 20, color: '#22c55e', taunt: 'Haha, ini baru pemanasan~ 😏' },
  { emoji: '👽', name: 'Alien Scout', shootMin: 0.8, shootMax: 1.2, bulletCount: 2, spread: 8, bulletSpeed: 38, playerDmg: 17, color: '#84cc16', taunt: 'Wah, lumayan juga kamu... 🤨' },
  { emoji: '🤖', name: 'Robo Hunter', shootMin: 0.7, shootMax: 1.0, bulletCount: 2, spread: 10, bulletSpeed: 42, playerDmg: 14, color: '#eab308', taunt: 'Oke, mulai serius nih! 😤' },
  { emoji: '👹', name: 'Demon Warrior', shootMin: 0.6, shootMax: 0.9, bulletCount: 3, spread: 12, bulletSpeed: 45, playerDmg: 12, color: '#f97316', taunt: 'Kamu kuat juga ternyata! 💀' },
  { emoji: '🐉', name: 'Dragon Lord', shootMin: 0.5, shootMax: 0.8, bulletCount: 3, spread: 14, bulletSpeed: 48, playerDmg: 11, color: '#ef4444', taunt: 'ARGH! Nyebelin banget! 😡' },
  { emoji: '💀', name: 'Skull Reaper', shootMin: 0.45, shootMax: 0.7, bulletCount: 3, spread: 16, bulletSpeed: 50, playerDmg: 10, color: '#dc2626', taunt: 'Aku GAK AKAN kalah! 🔥' },
  { emoji: '🔥', name: 'Fire Phoenix', shootMin: 0.4, shootMax: 0.65, bulletCount: 4, spread: 18, bulletSpeed: 52, playerDmg: 9, color: '#b91c1c', taunt: 'IMPOSSIBLE! Gimana bisa?! 😱' },
  { emoji: '⚡', name: 'Thunder God', shootMin: 0.35, shootMax: 0.55, bulletCount: 4, spread: 20, bulletSpeed: 55, playerDmg: 8, color: '#991b1b', taunt: 'Ini... pertarungan terakhir... 😰' },
  { emoji: '🌑', name: '☠️ FINAL FORM', shootMin: 0.3, shootMax: 0.5, bulletCount: 5, spread: 22, bulletSpeed: 58, playerDmg: 7, color: '#7f1d1d', taunt: '⚠️ BERSIAPLAH UNTUK AKHIRMU! ⚠️' },
]

// Helper: convert hex color to rgba
function hexRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function SpaceShooter({ onComplete }) {
  const canvasRef = useRef(null)
  const [round, setRound] = useState(1)
  const [showCompletePopup, setShowCompletePopup] = useState(false)
  const putriImgRef = useRef(null)

  // Preload Putri head image
  useEffect(() => {
    const img = new Image()
    img.src = '/putri-head.png'
    img.onload = () => { putriImgRef.current = img }
  }, [])

  // Helper: draw ship + Putri head
  const drawShip = (ctx, shipX, shipY, w, now, putriImg, hitFlash) => {
    const isHit = hitFlash > 0
    const shOx = isHit ? Math.sin(now / 30) * 3 : 0
    const shOy = isHit ? Math.cos(now / 25) * 2 : 0
    ctx.font = `${w * 0.08}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText('\ud83d\ude80', shipX + shOx, shipY + shOy)
    ctx.fillStyle = `rgba(251,191,36,${0.2 + Math.sin(now / 150) * 0.15})`
    ctx.beginPath(); ctx.arc(shipX + shOx, shipY + shOy + w * 0.045, w * 0.018, 0, Math.PI * 2); ctx.fill()
    if (putriImg) {
      const headSize = w * 0.09
      const hx = shipX + shOx - headSize / 2
      const hy = shipY + shOy - w * 0.075 - headSize * 0.7
      ctx.save()
      if (isHit) ctx.globalAlpha = 0.5 + Math.sin(now / 40) * 0.5
      ctx.beginPath()
      ctx.arc(shipX + shOx, hy + headSize / 2, headSize / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(putriImg, hx, hy, headSize, headSize)
      ctx.restore()
      ctx.strokeStyle = isHit ? '#ef4444' : '#fbbf24'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(shipX + shOx, hy + headSize / 2, headSize / 2, 0, Math.PI * 2); ctx.stroke()
    }
  }

  // Helper: draw falling Putri heads
  const drawFallingHeads = (ctx, fallingHeads, dt, w, h, putriImg) => {
    if (!putriImg) return
    for (let i = fallingHeads.length - 1; i >= 0; i--) {
      const fh = fallingHeads[i]
      fh.vy += 300 * dt
      fh.x += fh.vx * dt
      fh.y += fh.vy * dt
      fh.rot += fh.spin * dt
      fh.life -= dt
      if (fh.y > h - 15 && fh.vy > 0) { fh.vy *= -0.5; fh.vx *= 0.7; fh.y = h - 15 }
      if (fh.life <= 0) { fallingHeads.splice(i, 1); continue }
      const alpha = Math.min(1, fh.life * 2)
      const sz = w * 0.07
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(fh.x, fh.y)
      ctx.rotate(fh.rot)
      ctx.beginPath()
      ctx.arc(0, 0, sz / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(putriImg, -sz / 2, -sz / 2, sz, sz)
      ctx.restore()
      ctx.save()
      ctx.globalAlpha = alpha * 0.8
      ctx.font = `${w * 0.025}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      const starAngle = fh.rot * 2
      ctx.fillText('⭐', fh.x + Math.cos(starAngle) * sz * 0.6, fh.y + Math.sin(starAngle) * sz * 0.6)
      ctx.fillText('💫', fh.x + Math.cos(starAngle + 2.1) * sz * 0.6, fh.y + Math.sin(starAngle + 2.1) * sz * 0.6)
      ctx.fillText('😵', fh.x + Math.cos(starAngle + 4.2) * sz * 0.6, fh.y + Math.sin(starAngle + 4.2) * sz * 0.6)
      ctx.restore()
    }
  }

  // Helper: draw floating hit reaction above ship
  const drawHitReaction = (ctx, text, alpha, shipX, shipY, w, offsetY) => {
    if (!text || alpha <= 0) return
    ctx.save()
    ctx.globalAlpha = alpha
    const fs = Math.min(10, w * 0.028)
    ctx.font = `bold ${fs}px system-ui, sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
    const tw = ctx.measureText(text).width
    const bw = tw + 16, bh = 20
    const bx = Math.max(2, Math.min(w - bw - 2, shipX - bw / 2))
    const by = shipY - w * 0.16 - offsetY
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.fill()
    ctx.strokeStyle = 'rgba(251,191,36,0.6)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.beginPath()
    ctx.moveTo(shipX - 4, by + bh)
    ctx.lineTo(shipX, by + bh + 5)
    ctx.lineTo(shipX + 4, by + bh)
    ctx.fill()
    ctx.fillStyle = '#92400e'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, bx + bw / 2, by + bh / 2)
    ctx.restore()
  }

  // Helper: draw wrapped text in message box
  const drawMessageBox = (ctx, msg, alpha, w, h) => {
    if (!msg || alpha <= 0) return
    const fontSize = Math.min(11, w * 0.028)
    ctx.font = `bold ${fontSize}px system-ui, sans-serif`
    const mW = w * 0.92
    // Measure multi-line
    const words = msg.split(' ')
    let testLine = ''
    const lines = []
    const maxW = mW - 20
    words.forEach(word => {
      const test = testLine + word + ' '
      if (ctx.measureText(test).width > maxW && testLine) {
        lines.push(testLine.trim()); testLine = word + ' '
      } else { testLine = test }
    })
    if (testLine) lines.push(testLine.trim())
    const lineH = 15
    const mH = Math.max(40, lines.length * lineH + 20)
    const mX = (w - mW) / 2, mY = h * 0.44
    ctx.fillStyle = `rgba(0,0,0,${0.8 * alpha})`
    ctx.beginPath(); ctx.roundRect(mX, mY, mW, mH, 12); ctx.fill()
    ctx.strokeStyle = `rgba(251,191,36,${0.5 * alpha})`; ctx.lineWidth = 1
    ctx.beginPath(); ctx.roundRect(mX, mY, mW, mH, 12); ctx.stroke()
    ctx.fillStyle = `rgba(252,211,77,${alpha})`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const startY = mY + mH / 2 - ((lines.length - 1) * lineH / 2)
    lines.forEach((l, i) => ctx.fillText(l, w / 2, startY + i * lineH))
  }

  // ======== Round 1 — Enemy Wave ========
  useEffect(() => {
    if (round !== 1) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    let w, h
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const ship = { x: 50 }
    const bullets = []
    const particles = []
    const enemyBullets = []
    let score = 0, done = false, showMsg = null, msgTimer = 0
    let globalDir = 1, dropCooldown = 0
    let hitReaction = null, hitReactionTimer = 0, hitReactionIdx = 0
    let hitFlashTimer = 0
    const fallingHeads = []
    let enemyShootTimer = 0
    const enemies = ENEMY_MESSAGES.map((e, i) => ({
      x: 15 + (i % 5) * 17, y: 8 + Math.floor(i / 5) * 10,
      alive: true, emoji: e.emoji, msg: e.msg,
    }))
    let lastTime = performance.now(), animId

    const handleMove = (cx) => {
      const rect = canvas.getBoundingClientRect()
      ship.x = Math.max(4, Math.min(96, ((cx - rect.left) / rect.width) * 100))
    }
    const onMM = (e) => handleMove(e.clientX)
    const onTM = (e) => { e.preventDefault(); if (e.touches[0]) handleMove(e.touches[0].clientX) }
    const doShoot = () => { if (!done) bullets.push({ x: ship.x, y: 88 }) }
    const onClick = () => doShoot()
    const onTS = (e) => { if (e.touches[0]) handleMove(e.touches[0].clientX); doShoot() }

    canvas.addEventListener('mousemove', onMM)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchmove', onTM, { passive: false })
    canvas.addEventListener('touchstart', onTS, { passive: false })

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      dropCooldown = Math.max(0, dropCooldown - dt)
      hitReactionTimer = Math.max(0, hitReactionTimer - dt)
      hitFlashTimer = Math.max(0, hitFlashTimer - dt)
      enemyShootTimer -= dt

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0c0a09'; ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(251,191,36,${0.1 + (Math.sin(now / 1000 + i * 7) + 1) * 0.15})`
        ctx.fillRect(((i * 137.5) % 100) / 100 * w, ((i * 97.3) % 100) / 100 * h, 1.5, 1.5)
      }

      // Move enemies
      let needReverse = false
      enemies.forEach(e => {
        if (!e.alive) return
        e.x += globalDir * 8 * dt
        if (e.x >= 90 || e.x <= 10) needReverse = true
      })
      if (needReverse && dropCooldown <= 0) {
        globalDir *= -1
        enemies.forEach(e => { if (e.alive) e.y += 1.5 })
        dropCooldown = 0.6
      }

      // Enemy shooting
      if (!done && enemyShootTimer <= 0) {
        const aliveEnemies = enemies.filter(e => e.alive)
        if (aliveEnemies.length > 0) {
          const shootCount = Math.min(aliveEnemies.length, Math.random() < 0.3 ? 2 : 1)
          for (let s = 0; s < shootCount; s++) {
            const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)]
            enemyBullets.push({ x: shooter.x, y: shooter.y + 3 })
          }
          enemyShootTimer = 0.5 + Math.random() * 0.6
        }
      }

      // Draw enemies
      enemies.forEach(e => {
        if (!e.alive) return
        ctx.font = `${w * 0.06}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(e.emoji, (e.x / 100) * w, (e.y / 100) * h)
      })

      // Player bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]; b.y -= 70 * dt
        if (b.y < -2) { bullets.splice(i, 1); continue }
        ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 6
        ctx.beginPath(); ctx.arc((b.x / 100) * w, (b.y / 100) * h, 3, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      }

      // Enemy bullets
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i]; eb.y += 45 * dt
        if (eb.y > 105) { enemyBullets.splice(i, 1); continue }
        ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 5
        ctx.beginPath(); ctx.arc((eb.x / 100) * w, (eb.y / 100) * h, 2.5, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
        if (Math.abs(eb.x - ship.x) < 6 && Math.abs(eb.y - 92) < 6) {
          enemyBullets.splice(i, 1)
          hitReaction = PUTRI_HIT_REACTIONS[hitReactionIdx % PUTRI_HIT_REACTIONS.length]
          hitReactionIdx++
          hitReactionTimer = 1.8
          hitFlashTimer = 0.4
          const sx = (ship.x / 100) * w, sy = h * 0.92 - w * 0.1
          fallingHeads.push({ x: sx, y: sy, vx: (Math.random() - 0.5) * 120, vy: -150 - Math.random() * 80, rot: 0, spin: (Math.random() - 0.5) * 12, life: 2 })
        }
      }

      // Collision player bullets vs enemies
      outer:
      for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets[bi]
        for (let ei = 0; ei < enemies.length; ei++) {
          const e = enemies[ei]
          if (!e.alive) continue
          if (Math.abs(b.x - e.x) < 6 && Math.abs(b.y - e.y) < 6) {
            e.alive = false; bullets.splice(bi, 1); score++
            showMsg = e.msg; msgTimer = 2.2
            for (let p = 0; p < 8; p++) {
              particles.push({ x: (e.x / 100) * w, y: (e.y / 100) * h, vx: (Math.random() - 0.5) * 120, vy: (Math.random() - 0.5) * 120, life: 0.6 + Math.random() * 0.3 })
            }
            if (score >= 10) { done = true; setRound(2) }
            continue outer
          }
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.life -= dt
        if (p.life <= 0) { particles.splice(i, 1); continue }
        p.x += p.vx * dt; p.y += p.vy * dt
        ctx.fillStyle = `rgba(251,191,36,${Math.min(1, p.life * 2)})`
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill()
      }

      // Ship + Putri head
      const shipX = (ship.x / 100) * w, shipY = h * 0.92
      drawShip(ctx, shipX, shipY, w, now, putriImgRef.current, hitFlashTimer)
      drawFallingHeads(ctx, fallingHeads, dt, w, h, putriImgRef.current)
      drawHitReaction(ctx, hitReaction, Math.min(1, hitReactionTimer * 1.5), shipX, shipY, w, 0)

      // Message overlay
      if (showMsg && msgTimer > 0) {
        msgTimer -= dt
        drawMessageBox(ctx, showMsg, Math.min(1, msgTimer * 2), w, h)
        if (msgTimer <= 0) showMsg = null
      }

      // Score
      ctx.fillStyle = 'rgba(251,191,36,0.7)'; ctx.font = `bold ${Math.min(14, w * 0.032)}px system-ui, sans-serif`
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'
      ctx.fillText(`ROUND 1 — ⭐ ${score}/10`, 12, 12)

      if (!done) { animId = requestAnimationFrame(loop) }
      else {
        ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#fbbf24'; ctx.font = `bold ${w * 0.05}px system-ui, sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('✅ Round 1 Clear!', w / 2, h * 0.38)
        ctx.font = `${w * 0.032}px system-ui, sans-serif`; ctx.fillStyle = '#fcd34d'
        ctx.fillText('Bersiap... ada BOSS dengan 9 nyawa!', w / 2, h * 0.48)
        ctx.fillText('👾👾👾', w / 2, h * 0.56)
      }
    }
    animId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMM)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchmove', onTM)
      canvas.removeEventListener('touchstart', onTS)
    }
  }, [round])

  // ======== Round 2 — BOSS FIGHT (9 Lives, 100% HP per life) ========
  useEffect(() => {
    if (round !== 2) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    let w, h
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const ship = { x: 50 }
    const bullets = []
    const particles = []
    const enemyBullets = []

    // Boss state
    let bossHP = 100
    let bossLives = 9
    let phaseIdx = 0
    let phase = BOSS_PHASES[0]
    let bossX = 50, bossY = 15

    let done = false
    let showMsg = null, msgTimer = 0
    let shakeTimer = 0, shakeIntensity = 0
    let hitReaction = null, hitReactionTimer = 0, hitReactionIdx = 0
    let hitFlashTimer = 0
    const fallingHeads = []
    let bossShootTimer = 1.0

    // Transition states
    let deathTimer = 0        // >0 = boss death animation playing
    let introTimer = 3.0      // >0 = phase intro (starts with initial boss reveal)
    let deathExploded = false

    let lastTime = performance.now(), animId

    const handleMove = (cx) => {
      const rect = canvas.getBoundingClientRect()
      ship.x = Math.max(4, Math.min(96, ((cx - rect.left) / rect.width) * 100))
    }
    const onMM = (e) => handleMove(e.clientX)
    const onTM = (e) => { e.preventDefault(); if (e.touches[0]) handleMove(e.touches[0].clientX) }
    const doShoot = () => {
      if (!done && deathTimer <= 0 && introTimer <= 0)
        bullets.push({ x: ship.x, y: 88 })
    }
    const onClick = () => doShoot()
    const onTS = (e) => { if (e.touches[0]) handleMove(e.touches[0].clientX); doShoot() }

    canvas.addEventListener('mousemove', onMM)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('touchmove', onTM, { passive: false })
    canvas.addEventListener('touchstart', onTS, { passive: false })

    const loop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      // Update timers
      shakeTimer = Math.max(0, shakeTimer - dt)
      hitReactionTimer = Math.max(0, hitReactionTimer - dt)
      hitFlashTimer = Math.max(0, hitFlashTimer - dt)

      const inTransition = deathTimer > 0 || introTimer > 0

      // ---- Death transition ----
      if (deathTimer > 0) {
        deathTimer -= dt
        if (!deathExploded) {
          deathExploded = true
          for (let p = 0; p < 30; p++) {
            particles.push({
              x: (bossX / 100) * w, y: (bossY / 100) * h,
              vx: (Math.random() - 0.5) * 250, vy: (Math.random() - 0.5) * 250,
              life: 1 + Math.random() * 0.5,
            })
          }
        }
        if (deathTimer <= 0) {
          phaseIdx++
          phase = BOSS_PHASES[phaseIdx]
          bossHP = 100
          introTimer = 2.5
          deathExploded = false
          enemyBullets.length = 0
          bossShootTimer = phase.shootMax
        }
      }

      // ---- Intro transition ----
      if (introTimer > 0 && deathTimer <= 0) {
        introTimer -= dt
      }

      // Shake offset
      const sx = shakeTimer > 0 ? (Math.random() - 0.5) * shakeIntensity : 0
      const sy = shakeTimer > 0 ? (Math.random() - 0.5) * shakeIntensity : 0

      ctx.save()
      ctx.translate(sx, sy)

      // ---- Background ----
      ctx.clearRect(-10, -10, w + 20, h + 20)
      ctx.fillStyle = '#0c0a09'; ctx.fillRect(0, 0, w, h)

      // Phase-colored ambient glow
      const grad = ctx.createRadialGradient(w / 2, h * 0.2, 0, w / 2, h * 0.2, w * 0.6)
      grad.addColorStop(0, hexRgba(phase.color, 0.06 + Math.sin(now / 600) * 0.03))
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)

      // Stars
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(251,191,36,${0.1 + (Math.sin(now / 1000 + i * 7) + 1) * 0.15})`
        ctx.fillRect(((i * 137.5) % 100) / 100 * w, ((i * 97.3) % 100) / 100 * h, 1.5, 1.5)
      }

      // ---- Boss movement (varies by phase) ----
      if (!done && !inTransition) {
        const moveFreq = 800 - phaseIdx * 50
        bossX = 50 + Math.sin(now / moveFreq) * (25 + phaseIdx * 3)
        if (phaseIdx >= 3) bossX += Math.sin(now / 400) * 5
        bossY = 15 + Math.sin(now / 1200) * (3 + phaseIdx * 0.5)
        if (phaseIdx >= 6) bossY += Math.cos(now / 500) * 3

        // Boss shooting
        bossShootTimer -= dt
        if (bossShootTimer <= 0) {
          for (let s = 0; s < phase.bulletCount; s++) {
            const angle = (s - (phase.bulletCount - 1) / 2) * phase.spread
            enemyBullets.push({ x: bossX + angle * 0.5, y: bossY + 5, vx: angle * 0.5 })
          }
          bossShootTimer = phase.shootMin + Math.random() * (phase.shootMax - phase.shootMin)
        }
      }

      // ---- Draw Boss ----
      if (!done && deathTimer <= 0) {
        const bx = (bossX / 100) * w, by = (bossY / 100) * h
        // Boss glow
        ctx.fillStyle = hexRgba(phase.color, 0.15 + Math.sin(now / 300) * 0.1)
        ctx.beginPath(); ctx.arc(bx, by, w * 0.08, 0, Math.PI * 2); ctx.fill()
        // Boss emoji (grows with phase)
        const bossSize = w * (0.10 + phaseIdx * 0.005)
        ctx.font = `${bossSize}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(phase.emoji, bx, by)
      }

      // ---- Player bullets ----
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]; b.y -= 70 * dt
        if (b.y < -2) { bullets.splice(i, 1); continue }
        ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 6
        ctx.beginPath(); ctx.arc((b.x / 100) * w, (b.y / 100) * h, 3, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      }

      // ---- Enemy bullets ----
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i]
        eb.y += phase.bulletSpeed * dt
        eb.x += (eb.vx || 0) * dt
        if (eb.y > 105) { enemyBullets.splice(i, 1); continue }
        ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 5
        ctx.beginPath(); ctx.arc((eb.x / 100) * w, (eb.y / 100) * h, 3, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
        // Hit on ship
        if (Math.abs(eb.x - ship.x) < 6 && Math.abs(eb.y - 92) < 6) {
          enemyBullets.splice(i, 1)
          hitReaction = PUTRI_HIT_REACTIONS[hitReactionIdx % PUTRI_HIT_REACTIONS.length]
          hitReactionIdx++
          hitReactionTimer = 1.8
          hitFlashTimer = 0.4
          const spx = (ship.x / 100) * w, spy = h * 0.92 - w * 0.1
          fallingHeads.push({ x: spx, y: spy, vx: (Math.random() - 0.5) * 120, vy: -150 - Math.random() * 80, rot: 0, spin: (Math.random() - 0.5) * 12, life: 2 })
        }
      }

      // ---- Collision: player bullets vs boss ----
      if (!done && !inTransition) {
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
          const b = bullets[bi]
          if (Math.abs(b.x - bossX) < 10 && Math.abs(b.y - bossY) < 10) {
            bullets.splice(bi, 1)
            bossHP -= phase.playerDmg
            shakeTimer = 0.2; shakeIntensity = 5
            // Hit particles
            for (let p = 0; p < 6; p++) {
              particles.push({
                x: (bossX / 100) * w, y: (bossY / 100) * h,
                vx: (Math.random() - 0.5) * 150, vy: (Math.random() - 0.5) * 150,
                life: 0.5 + Math.random() * 0.3,
              })
            }

            if (bossHP <= 0) {
              bossHP = 0
              bossLives--

              if (bossLives <= 0) {
                // ===== FINAL DEFEAT =====
                done = true
                shakeTimer = 0.5; shakeIntensity = 15
                for (let p = 0; p < 35; p++) {
                  particles.push({
                    x: (bossX / 100) * w, y: (bossY / 100) * h,
                    vx: (Math.random() - 0.5) * 300, vy: (Math.random() - 0.5) * 300,
                    life: 1.5 + Math.random() * 0.5,
                  })
                }
                setTimeout(() => setShowCompletePopup(true), 1500)
              } else {
                // Boss dies, will respawn as next phase
                deathTimer = 2.0
                shakeTimer = 0.4; shakeIntensity = 12
                const msgIdx = (9 - bossLives - 1) % BOSS_HIT_MESSAGES.length
                showMsg = `💀 ${phase.name} KALAH! — ${BOSS_HIT_MESSAGES[msgIdx]}`
                msgTimer = 2.5
              }
            } else {
              // Normal hit — occasional taunt
              if (Math.random() < 0.25) {
                showMsg = BOSS_HIT_MESSAGES[Math.floor(Math.random() * BOSS_HIT_MESSAGES.length)]
                msgTimer = 1.5
              }
            }
            break
          }
        }
      }

      // ---- Particles ----
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.life -= dt
        if (p.life <= 0) { particles.splice(i, 1); continue }
        p.x += p.vx * dt; p.y += p.vy * dt
        ctx.fillStyle = `rgba(251,191,36,${Math.min(1, p.life * 2)})`
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill()
      }

      // ---- Ship ----
      const shipXp = (ship.x / 100) * w, shipYp = h * 0.92
      drawShip(ctx, shipXp, shipYp, w, now, putriImgRef.current, hitFlashTimer)
      drawFallingHeads(ctx, fallingHeads, dt, w, h, putriImgRef.current)
      drawHitReaction(ctx, hitReaction, Math.min(1, hitReactionTimer * 1.5), shipXp, shipYp, w, 0)

      // ---- HP Bar (top area) ----
      if (deathTimer <= 0 && !done) {
        const hpBarW = w * 0.55, hpBarH = Math.max(10, w * 0.022)
        const hpBarX = (w - hpBarW) / 2, hpBarY = h * 0.065
        // Panel background
        ctx.fillStyle = 'rgba(0,0,0,0.75)'
        ctx.beginPath(); ctx.roundRect(hpBarX - 10, hpBarY - 26, hpBarW + 20, hpBarH + 38, 10); ctx.fill()
        ctx.strokeStyle = hexRgba(phase.color, 0.3); ctx.lineWidth = 1
        ctx.beginPath(); ctx.roundRect(hpBarX - 10, hpBarY - 26, hpBarW + 20, hpBarH + 38, 10); ctx.stroke()
        // Boss name + lives
        ctx.fillStyle = phase.color
        ctx.font = `bold ${Math.min(13, w * 0.03)}px system-ui, sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
        ctx.fillText(`${phase.emoji} ${phase.name}   ❤️ ×${bossLives}`, w / 2, hpBarY - 5)
        // HP bar bg
        ctx.fillStyle = '#1f1f1f'
        ctx.beginPath(); ctx.roundRect(hpBarX, hpBarY, hpBarW, hpBarH, 5); ctx.fill()
        // HP bar fill
        const hpFill = Math.max(0, bossHP / 100)
        ctx.fillStyle = phase.color
        if (hpFill > 0) {
          ctx.beginPath(); ctx.roundRect(hpBarX, hpBarY, hpBarW * hpFill, hpBarH, 5); ctx.fill()
        }
        // HP text
        ctx.fillStyle = 'white'
        ctx.font = `bold ${Math.min(11, w * 0.024)}px system-ui, sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(`${Math.ceil(bossHP)}%`, w / 2, hpBarY + hpBarH / 2)
      }

      // ---- Message overlay ----
      if (showMsg && msgTimer > 0) {
        msgTimer -= dt
        drawMessageBox(ctx, showMsg, Math.min(1, msgTimer * 2), w, h)
        if (msgTimer <= 0) showMsg = null
      }

      // ---- Round label ----
      ctx.fillStyle = 'rgba(251,191,36,0.7)'
      ctx.font = `bold ${Math.min(13, w * 0.03)}px system-ui, sans-serif`
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'
      ctx.fillText(`ROUND 2 — BOSS ${phase.emoji}`, 12, 12)

      // ---- Phase intro overlay ----
      if (introTimer > 0 && deathTimer <= 0) {
        const introAlpha = Math.min(1, introTimer * 0.8)
        ctx.fillStyle = `rgba(0,0,0,${0.8 * introAlpha})`; ctx.fillRect(0, 0, w, h)
        // Boss emoji dramatic entrance
        const pulse = 1 + Math.sin(now / 200) * 0.15
        ctx.save()
        ctx.translate(w / 2, h * 0.28)
        ctx.scale(pulse, pulse)
        ctx.font = `${w * 0.18}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(phase.emoji, 0, 0)
        ctx.restore()
        // Glow
        ctx.fillStyle = hexRgba(phase.color, 0.15 + Math.sin(now / 250) * 0.1)
        ctx.beginPath(); ctx.arc(w / 2, h * 0.28, w * 0.12 * pulse, 0, Math.PI * 2); ctx.fill()
        // Phase name
        ctx.fillStyle = phase.color
        ctx.font = `bold ${Math.min(18, w * 0.05)}px system-ui, sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(phase.name, w / 2, h * 0.45)
        // Lives info
        ctx.fillStyle = `rgba(252,211,77,${introAlpha})`
        ctx.font = `${Math.min(13, w * 0.035)}px system-ui, sans-serif`
        ctx.fillText(`❤️ Nyawa: ${bossLives}/9 — HP: 100%`, w / 2, h * 0.52)
        // Taunt
        ctx.font = `italic ${Math.min(12, w * 0.03)}px system-ui, sans-serif`
        ctx.fillText(`"${phase.taunt}"`, w / 2, h * 0.60)
        // Warning
        ctx.fillStyle = `rgba(239,68,68,${0.3 + Math.sin(now / 150) * 0.2})`
        ctx.font = `bold ${Math.min(11, w * 0.028)}px system-ui, sans-serif`
        ctx.fillText('⚠️ BERSIAPLAH... ⚠️', w / 2, h * 0.70)
      }

      // ---- Death overlay ----
      if (deathTimer > 0) {
        const deathAlpha = Math.min(1, deathTimer * 0.8)
        // Red flash
        ctx.fillStyle = `rgba(220,38,38,${0.15 * deathAlpha})`; ctx.fillRect(0, 0, w, h)
        // Dark overlay
        ctx.fillStyle = `rgba(0,0,0,${0.5 * deathAlpha})`; ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = `rgba(239,68,68,${deathAlpha})`
        ctx.font = `bold ${Math.min(22, w * 0.06)}px system-ui, sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('💀 KALAH!', w / 2, h * 0.33)
        ctx.fillStyle = `rgba(252,211,77,${deathAlpha})`
        ctx.font = `${Math.min(14, w * 0.035)}px system-ui, sans-serif`
        ctx.fillText(`Nyawa tersisa: ${bossLives}`, w / 2, h * 0.41)
        ctx.font = `${Math.min(11, w * 0.028)}px system-ui, sans-serif`
        ctx.fillStyle = `rgba(251,191,36,${deathAlpha * 0.7})`
        ctx.fillText('Monster akan berevolusi...', w / 2, h * 0.48)
      }

      // ---- Final defeat overlay ----
      if (done) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#fbbf24'
        ctx.font = `bold ${Math.min(24, w * 0.055)}px system-ui, sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('🏆 BOSS DIKALAHKAN!', w / 2, h * 0.38)
        ctx.font = `${Math.min(14, w * 0.035)}px system-ui, sans-serif`
        ctx.fillStyle = '#fcd34d'
        ctx.fillText('Semua 9 nyawa telah habis!', w / 2, h * 0.46)
      }

      ctx.restore()

      if (!done || particles.length > 0) {
        animId = requestAnimationFrame(loop)
      }
    }
    animId = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMM)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('touchmove', onTM)
      canvas.removeEventListener('touchstart', onTS)
    }
  }, [round])

  // ======== RENDER — Fullscreen Game ========
  return (
    <div className="fixed inset-0 z-[100]" style={{ background: '#0c0a09', width: '100vw', height: '100dvh' }}>
      {/* Game Canvas — fills entire viewport */}
      <canvas
        ref={canvasRef}
        className="block cursor-crosshair"
        style={{ touchAction: 'none', width: '100vw', height: '100dvh' }}
      />

      {/* Round indicator (top center) */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[101] flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-amber-800/30 pointer-events-none">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${round >= 1 ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-600'}`}>
          Round 1
        </span>
        <span className="text-amber-400 text-[10px]">→</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${round >= 2 ? 'bg-red-500 text-white' : 'bg-stone-700 text-stone-400'}`}>
          Round 2 BOSS
        </span>
      </div>

      {/* Instruction text (bottom) */}
      {!showCompletePopup && (
        <p className="fixed bottom-4 left-0 right-0 text-center text-[10px] text-amber-500/50 italic z-[101] pointer-events-none">
          👆 Geser untuk arahkan roket, tap untuk tembak!
        </p>
      )}

      {/* ====== GAME COMPLETE POPUP (centered) ====== */}
      <AnimatePresence>
        {showCompletePopup && (
          <motion.div
            className="fixed inset-0 z-[102] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="bg-gradient-to-b from-stone-800 to-stone-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl shadow-amber-500/20"
            >
              <motion.p
                className="text-5xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🏆
              </motion.p>

              <h3 className="text-2xl font-bold text-amber-400 font-[Dancing_Script]">
                Misi Selesai!
              </h3>

              <p className="text-sm text-amber-300/80">
                Boss berhasil dikalahkan melewati 9 nyawa! 🎉
              </p>

              <div className="text-xs text-amber-200/70 bg-black/40 rounded-xl p-3 leading-relaxed max-h-32 overflow-y-auto border border-amber-800/30 no-scrollbar">
                🤲 {BOSS_FINAL_MESSAGE}
              </div>

              <motion.button
                onClick={onComplete}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-700
                           text-white rounded-2xl font-bold shadow-lg cursor-pointer text-base
                           relative overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(217,119,6,0.3)' }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Lanjut →</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
