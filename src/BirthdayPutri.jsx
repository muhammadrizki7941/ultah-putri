import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import SpaceShooter from './SpaceShooterGame'

// ============================================================
// PERJALANAN ULANG TAHUN PUTRI ALMEYDA
// 16 Bab cerita bermakna — dari pintu pertama hingga doa terakhir
// Setiap bab punya makna tersembunyi yang menjadi benang merah
// ============================================================

// ============================================================
// DEV MODE — set false sebelum deploy/production
// ============================================================
const DEV_MODE = true

const CHAPTERS = [
  { id: 0, num: '', title: 'Pintu Awal', icon: '🚪', meaning: 'Setiap cerita besar dimulai dari keberanian membuka pintu pertama.', mood: 'mystery' },
  { id: 1, num: 'I', title: 'Ritual Persiapan', icon: '🛡️', meaning: 'Yang indah butuh ruang. Yang tulus butuh ketenangan.', mood: 'calm' },
  { id: 2, num: 'II', title: 'Menembus Waktu', icon: '⏳', meaning: 'Sabar bukan menunggu, tapi percaya bahwa yang baik sedang disiapkan.', mood: 'mystery' },
  { id: 3, num: 'III', title: 'Cermin Kejujuran', icon: '🪞', meaning: 'Mengenali diri sendiri adalah langkah pertama mencintai diri sendiri.', mood: 'calm' },
  { id: 4, num: 'IV', title: 'Api Kebenaran', icon: '🔥', meaning: 'Kekurangan bukan aib — itu yang bikin kamu istimewa.', mood: 'warm' },
  { id: 5, num: 'V', title: 'Arena Tantangan', icon: '🎮', meaning: 'Hal terbaik dalam hidup memang harus diperjuangkan.', mood: 'fun' },
  { id: 6, num: 'VI', title: 'Kode Takdir', icon: '💻', meaning: 'Ada hal yang gak bisa di-debug — perasaan ini salah satunya.', mood: 'code' },
  { id: 7, num: 'VII', title: 'Teka-Teki Hati', icon: '🧩', meaning: 'Kadang jawabannya bukan di pilihan, tapi di perasaan.', mood: 'fun' },
  { id: 8, num: 'VIII', title: 'Lorong Kenangan', icon: '📸', meaning: 'Foto bisa pudar, tapi momen yang kita rasakan akan selamanya hidup.', mood: 'nostalgic' },
  { id: 9, num: 'IX', title: 'Surat Tak Terkirim', icon: '💌', meaning: 'Hal yang paling jujur sering kali paling sulit diucapkan.', mood: 'emotional' },
  { id: 10, num: 'X', title: 'Waktu yang Berjalan', icon: '🕰️', meaning: 'Bertambah umur bukan soal menua, tapi soal bertumbuh.', mood: 'emotional' },
  { id: 11, num: 'XI', title: 'Kata yang Tertahan', icon: '🫠', meaning: 'Diam bukan berarti kosong — justru penuh yang tak bisa diucapkan.', mood: 'emotional' },
  { id: 12, num: 'XII', title: 'Konstelasi Putri', icon: '🌌', meaning: 'Setiap bintang punya cerita — dan kamu adalah konstelasi favoritku.', mood: 'emotional' },
  { id: 13, num: 'XIII', title: 'Misi Luar Angkasa', icon: '🚀', meaning: 'Di antara bintang-bintang, kamu tetap yang paling bersinar.', mood: 'fun' },
  { id: 14, num: 'XIV', title: 'Hari Istimewa', icon: '🎂', meaning: 'Kamu layak dirayakan — bukan karena sempurna, tapi karena kamu ada.', mood: 'celebration' },
  { id: 15, num: 'XV', title: 'Kejutan Terakhir', icon: '🎁', meaning: 'Hidup penuh kejutan — yang penting, siapa yang menemanimu.', mood: 'fun' },
  { id: 16, num: 'XVI', title: 'Doa & Harapan', icon: '🤲', meaning: 'Doa terbaik adalah yang dipanjatkan tanpa diminta.', mood: 'spiritual' },
  { id: 17, num: 'XVII', title: 'Di Balik Layar', icon: '🎬', meaning: 'Yang tulus tidak perlu sempurna — cukup nyata.', mood: 'bts' },
]

const MOOD_GRADIENTS = {
  mystery: 'linear-gradient(135deg, #1c1917 0%, #451a03 50%, #1c1917 100%)',
  calm: 'linear-gradient(135deg, #fffbeb 0%, #fff7ed 50%, #f5f5f4 100%)',
  warm: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #fef3c7 100%)',
  fun: 'linear-gradient(135deg, #fffbeb 0%, #fefce8 50%, #fff7ed 100%)',
  code: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%)',
  nostalgic: 'linear-gradient(135deg, #fef3c7 0%, #fff7ed 50%, #fffbeb 100%)',
  emotional: 'linear-gradient(135deg, #fffbeb 0%, #fff1f2 50%, #f5f5f4 100%)',
  celebration: 'linear-gradient(135deg, #fef3c7 0%, #fefce8 50%, #fff7ed 100%)',
  spiritual: 'linear-gradient(135deg, #f5f5f4 0%, #fffbeb 50%, #fef3c7 100%)',
  bts: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
}

const MOOD_EMOJIS = {
  mystery: ['✨', '🌙', '⭐', '💫', '🔮'],
  calm: ['🍃', '☁️', '🌿', '🫧', '✨'],
  warm: ['🤎', '☕', '🍂', '🍪', '✨'],
  fun: ['🎈', '🎊', '⭐', '🎮', '💫'],
  code: ['⌨️', '💡', '🖥️', '⚡', '🔧'],
  nostalgic: ['📸', '🤎', '🍂', '✨', '🌸'],
  emotional: ['💌', '🤍', '🕊️', '✨', '🫧'],
  celebration: ['🎉', '🎊', '🎈', '⭐', '🎂'],
  spiritual: ['🤍', '✨', '🕊️', '🌙', '💫'],
  bts: ['🎬', '📷', '🤍', '✨', '🖤'],
}

// ---------- Animated Floating Particles ----------
function DynamicParticles({ mood }) {
  const particles = useMemo(() => {
    const emojis = MOOD_EMOJIS[mood] || MOOD_EMOJIS.calm
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 8,
      size: 10 + Math.random() * 14,
    }))
  }, [mood])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={`${mood}-${p.id}`}
          className="absolute"
          style={{ left: `${p.left}%`, fontSize: p.size, bottom: '-20px', opacity: 0.15 }}
          animate={{ y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 100 : 900)] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  )
}

// ---------- Opening Title Card ----------
function TitleCard({ onStart }) {
  return (
    <motion.div
      key="title-card"
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0c0a09, #1c1917, #0c0a09)' }}
      onClick={onStart}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating star particles */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            background: `rgba(217, 119, 6, ${0.2 + Math.random() * 0.4})`,
          }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Radiating glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="text-center z-10 px-8">
        <motion.p
          className="text-5xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
        >
          ✨
        </motion.p>

        <motion.p
          className="text-amber-500/60 text-xs sm:text-sm tracking-[0.2em] uppercase mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Sebuah Cerita Untukmu
        </motion.p>

        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-amber-400 font-[Dancing_Script] mb-4 animate-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Putri Almeyda
        </motion.h1>

        <motion.div
          className="w-16 h-px bg-amber-500/30 mx-auto mb-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        />

        <motion.p
          className="text-amber-300/40 text-xs italic max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
        >
          "Buka pelan-pelan. Ini bukan sekadar ucapan."
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <motion.div
            className="inline-block px-8 py-3 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium"
            animate={{
              boxShadow: [
                '0 0 0px rgba(217,119,6,0)',
                '0 0 25px rgba(217,119,6,0.3)',
                '0 0 0px rgba(217,119,6,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap untuk memulai ✦
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ---------- Cinematic Chapter Intro ----------
function ChapterIntro({ chapter, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0c0a09, #1c1917, #0c0a09)' }}
      onClick={onComplete}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient floating dots */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 1 + Math.random(),
            height: 1 + Math.random(),
          }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Radiating ring */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-amber-500/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5], opacity: [0.3, 0] }}
        transition={{ delay: 0.5, duration: 2, ease: 'easeOut' }}
      />

      <div className="text-center z-10 px-8">
        {chapter.num && (
          <motion.p
            className="text-amber-600/40 text-xs tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Bab {chapter.num}
          </motion.p>
        )}

        <motion.p
          className="text-5xl mb-5"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          {chapter.icon}
        </motion.p>

        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-amber-400 font-[Dancing_Script] mb-5 animate-glow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {chapter.title}
        </motion.h2>

        <motion.div
          className="w-12 h-px bg-amber-500/30 mx-auto mb-5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />

        <motion.p
          className="text-amber-300/50 text-xs italic max-w-xs mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          &ldquo;{chapter.meaning}&rdquo;
        </motion.p>

        <motion.p
          className="text-amber-500/25 text-[10px] mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ delay: 2.5, duration: 1.5, repeat: Infinity }}
        >
          tap untuk lanjut
        </motion.p>
      </div>
    </motion.div>
  )
}

// ---------- Journey Map Overlay ----------
function JourneyMap({ current, chapters, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 50%, #0c0a09 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[70] w-10 h-10 flex items-center justify-center
                   bg-stone-800 rounded-full text-amber-400 text-lg border border-amber-800/30
                   hover:bg-stone-700 cursor-pointer transition-colors"
      >
        ✕
      </button>

      <div className="max-w-sm mx-auto py-16 px-6">
        <h3 className="text-center text-amber-400 font-[Dancing_Script] text-xl mb-2">
          Peta Perjalanan
        </h3>
        <p className="text-center text-amber-500/40 text-[10px] mb-8">
          {current + 1} dari {chapters.length} bab telah dilalui
        </p>

        <div className="relative">
          {/* Background line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-amber-900/20" />
          {/* Animated progress line */}
          <motion.div
            className="absolute left-5 top-0 w-px bg-gradient-to-b from-amber-400 to-amber-600"
            initial={{ height: 0 }}
            animate={{ height: `${(current / Math.max(chapters.length - 1, 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {chapters.map((ch, i) => {
            const isActive = i === current
            const isPast = i < current
            const isFuture = i > current
            return (
              <motion.div
                key={i}
                className="relative flex items-start gap-4 pb-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isFuture ? 0.2 : 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0 transition-all
                    ${isActive
                      ? 'bg-amber-500 shadow-lg shadow-amber-500/40 scale-110'
                      : isPast
                      ? 'bg-amber-800/80 border border-amber-600/30'
                      : 'bg-stone-800/80 border border-stone-700/50'
                    }`}
                >
                  {ch.icon}
                </div>
                <div className="pt-1 min-w-0">
                  <p className={`text-[10px] ${isPast || isActive ? 'text-amber-500/60' : 'text-stone-600'}`}>
                    {ch.num ? `Bab ${ch.num}` : 'Prolog'}
                  </p>
                  <p className={`text-sm font-semibold truncate ${isActive ? 'text-amber-300' : isPast ? 'text-amber-400/70' : 'text-stone-600'}`}>
                    {ch.title}
                  </p>
                  {(isPast || isActive) && (
                    <p className="text-[9px] text-amber-500/35 italic mt-0.5 leading-snug">
                      &ldquo;{ch.meaning}&rdquo;
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ---------- Journey Indicator (Top Bar) ----------
function JourneyIndicator({ current, total, chapter, onOpenMap }) {
  return (
    <div className="fixed top-0 left-0 w-full z-40">
      <div className="h-1 bg-amber-200/20">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-r-full"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/50 backdrop-blur-sm">
        <motion.button
          onClick={onOpenMap}
          className="flex items-center gap-1.5 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="text-xs">🗺️</span>
          <span className="text-[10px] text-amber-600 tracking-wider font-medium">
            {chapter.icon} {chapter.num ? `Bab ${chapter.num}` : 'Prolog'} · {chapter.title}
          </span>
        </motion.button>
        <span className="text-[10px] text-amber-400/50 font-medium">
          {current + 1}/{total}
        </span>
      </div>
    </div>
  )
}

// ---------- Scene Card ----------
function SceneCard({ children, mood = 'calm' }) {
  const isDark = mood === 'mystery' || mood === 'code'
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative w-full max-w-md mx-auto backdrop-blur-md rounded-3xl shadow-xl
                  p-5 sm:p-7 md:p-9 z-10 border overflow-hidden
                  ${isDark
                    ? 'bg-stone-900/90 shadow-amber-500/10 border-amber-800/20'
                    : 'bg-white/85 shadow-amber-200/40 border-amber-100'
                  }`}
    >
      {/* Subtle shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(217,119,6,0.04), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(217,119,6,0.03), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-200% 0', '200% 0'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// ---------- Next Button ----------
function NextBtn({ onClick, label = 'Lanjut →' }) {
  return (
    <motion.button
      onClick={onClick}
      className="mt-4 sm:mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700
                 text-white rounded-2xl font-semibold shadow-md cursor-pointer relative overflow-hidden"
      whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(217,119,6,0.3)' }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Sweeping glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative z-10">{label}</span>
    </motion.button>
  )
}

// ---------- Runaway Button (Mini Game) ----------
function RunawayButton({ label, onCaught }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [caught, setCaught] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const runAway = useCallback(() => {
    setAttempts((a) => a + 1)
    setPos({
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 120,
    })
  }, [])

  const handleClick = () => {
    if (attempts >= 5) {
      setCaught(true)
      onCaught()
    } else {
      runAway()
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-40 sm:h-48">
      {!caught ? (
        <>
          <p className="text-sm text-amber-500 mb-2">
            {attempts === 0
              ? 'Coba klik hadiahnya! 🎁'
              : attempts < 3
              ? 'Hehe, cepetan dong! 😜'
              : attempts < 5
              ? 'Hampir dapet tuh... 🤏'
              : 'Sekali lagi... pasti bisa! 🔥'}
          </p>
          <motion.button
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseEnter={attempts < 5 ? runAway : undefined}
            onClick={handleClick}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full
                       font-semibold shadow-lg text-lg cursor-pointer select-none"
          >
            🎁 {label}
          </motion.button>
        </>
      ) : (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-amber-700 font-semibold">Yeay, dapet! Lanjut ya~</p>
        </motion.div>
      )}
    </div>
  )
}


// SpaceShooter component moved to SpaceShooterGame.jsx

// ---------- Typewriter Text (Cinematic) ----------
function TypewriterText({ text, delay = 0, speed = 35, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const textStr = typeof text === 'string' ? text : ''
  const hasJSX = typeof text !== 'string'

  useEffect(() => {
    if (hasJSX) {
      const timer = setTimeout(() => setDone(true), delay * 1000)
      return () => clearTimeout(timer)
    }
    setDisplayed('')
    setDone(false)
    let i = 0
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(textStr.slice(0, i))
        if (i >= textStr.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay * 1000)
    return () => clearTimeout(startTimer)
  }, [textStr, delay, speed, hasJSX])

  if (hasJSX) {
    return (
      <motion.p
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {text}
      </motion.p>
    )
  }

  return (
    <p className={className}>
      {displayed}
      {!done && <span className="inline-block w-[2px] h-[1em] bg-amber-500/70 ml-0.5 animate-pulse align-middle" />}
    </p>
  )
}

// ---------- Constellation Star (Interactive) ----------
function ConstellationStar({ star, index, isActive, onActivate, hasBeenTapped }) {
  const showAbove = star.y > 45
  const alignLeft = star.x > 65 ? 'right-0' : star.x < 35 ? 'left-0' : 'left-1/2 -translate-x-1/2'
  return (
    <motion.div
      className="absolute z-[2]"
      style={{ left: `${star.x}%`, top: `${star.y}%`, transform: 'translate(-50%, -50%)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.25, type: 'spring', stiffness: 200 }}
    >
      <motion.button
        onClick={() => onActivate(index)}
        className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center cursor-pointer"
        animate={{
          scale: hasBeenTapped ? [1, 1.3, 1] : [1, 1.15, 1],
          filter: hasBeenTapped
            ? 'drop-shadow(0 0 8px rgba(251,191,36,0.8))'
            : ['drop-shadow(0 0 3px rgba(251,191,36,0.3))', 'drop-shadow(0 0 8px rgba(251,191,36,0.6))', 'drop-shadow(0 0 3px rgba(251,191,36,0.3))']
        }}
        transition={{ repeat: hasBeenTapped ? 0 : Infinity, duration: 2, delay: index * 0.3 }}
      >
        <span className="text-lg sm:text-xl">{hasBeenTapped ? '🌟' : '⭐'}</span>
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: showAbove ? -5 : 5, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`absolute w-40 sm:w-48 bg-black/90 backdrop-blur-md
                       rounded-xl p-2.5 sm:p-3 border border-amber-400/30 shadow-lg shadow-amber-500/20
                       z-[10] ${showAbove ? 'bottom-9 sm:bottom-10' : 'top-9 sm:top-10'} ${alignLeft}`}
          >
            <p className="text-[10px] sm:text-[11px] text-amber-300 leading-snug text-center">
              {star.msg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ---------- Chapter Meaning Footer ----------
function ChapterMeaning({ meaning }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
      className="mt-5 pt-3 border-t border-amber-200/20"
    >
      <p className="text-[10px] text-amber-400/40 italic text-center leading-relaxed">
        ✦ &ldquo;{meaning}&rdquo;
      </p>
    </motion.div>
  )
}

// =============================================
//  MAIN COMPONENT
// =============================================
export default function BirthdayPutri() {
  const [chapter, setChapter] = useState(-1)  // -1 = title card
  const [showIntro, setShowIntro] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [muted, setMuted] = useState(false)
  const [devOpen, setDevOpen] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [jokeAnswer, setJokeAnswer] = useState(null)
  const [giftCaught, setGiftCaught] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const [prankOpened, setPrankOpened] = useState(false)
  const [activeStarIdx, setActiveStarIdx] = useState(null)
  const [tappedStars, setTappedStars] = useState(new Set())

  const musicStartedRef = useRef(false)
  const bgm1Ref = useRef(null)
  const bgm2Ref = useRef(null)
  const bgm3Ref = useRef(null)
  const warmingUpRef = useRef(new Set())
  const fadeIntervalsRef = useRef([])

  const currentChapter = chapter >= 0 ? CHAPTERS[chapter] : null
  const currentMood = currentChapter?.mood || 'mystery'

  const bgGradient = chapter === -1 || showIntro
    ? 'linear-gradient(135deg, #0c0a09, #1c1917, #0c0a09)'
    : (MOOD_GRADIENTS[currentMood] || MOOD_GRADIENTS.calm)

  // Try start music + pre-unlock all audio tracks
  const tryPlayBgm = () => {
    if (musicStartedRef.current) return
    const bgm1 = bgm1Ref.current
    if (!bgm1) return
    bgm1.volume = 0.4
    bgm1.play().then(() => {
      musicStartedRef.current = true
      // Pre-unlock bgm2 and bgm3 so browser allows playback later
      ;[bgm2Ref.current, bgm3Ref.current].forEach(a => {
        if (!a) return
        warmingUpRef.current.add(a)
        a.volume = 0
        a.play().then(() => {
          // Only pause if still in warmup (not taken over by fadeIn)
          if (warmingUpRef.current.has(a)) {
            a.pause()
            a.currentTime = 0
            warmingUpRef.current.delete(a)
          }
        }).catch(() => { warmingUpRef.current.delete(a) })
      })
    }).catch(() => {})
  }

  // Navigate to next chapter
  const next = useCallback(() => {
    const newChapter = chapter + 1
    if (newChapter >= CHAPTERS.length) return
    const skipIntro = [2].includes(newChapter)
    setChapter(newChapter)
    setShowIntro(!skipIntro)
    window.scrollTo({ top: 0, behavior: 'instant' })
    tryPlayBgm()
  }, [chapter])

  // Start from title card
  const startFromTitle = () => {
    setChapter(0)
    tryPlayBgm()
  }

  // Complete chapter intro
  const completeIntro = useCallback(() => {
    setShowIntro(false)
  }, [])

  // Auto-advance for fake loading (chapter 2)
  useEffect(() => {
    if (chapter === 2 && !showIntro) {
      const timer = setTimeout(() => {
        setChapter(3)
        setShowIntro(true)
        window.scrollTo({ top: 0, behavior: 'instant' })
      }, 12000)
      return () => clearTimeout(timer)
    }
  }, [chapter, showIntro])

  // BGM switching (bgm1 for 0-7, bgm2 for 8-12, bgm3 for 13+)
  useEffect(() => {
    if (!musicStartedRef.current) return
    // Clear any previous fade intervals to prevent overlap
    fadeIntervalsRef.current.forEach(id => clearInterval(id))
    fadeIntervalsRef.current = []
    const trackInterval = (id) => { fadeIntervalsRef.current.push(id); return id }
    const fadeOut = (audio) => {
      if (!audio || audio.paused) return
      trackInterval(setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05)
        } else {
          audio.pause()
          audio.volume = 0
          clearInterval(fadeIntervalsRef.current.pop())
        }
      }, 80))
    }
    const fadeIn = (audio) => {
      if (!audio) return
      // Cancel warmup so it won't pause this audio
      warmingUpRef.current.delete(audio)
      if (!audio.paused) return
      audio.volume = 0
      audio.play().then(() => {
        trackInterval(setInterval(() => {
          if (audio.volume < 0.35) {
            audio.volume = Math.min(0.4, audio.volume + 0.05)
          } else {
            clearInterval(fadeIntervalsRef.current.pop())
          }
        }, 80))
      }).catch(() => {})
    }
    // Determine which track should play
    let active, others
    if (chapter >= 13) {
      active = bgm3Ref.current
      others = [bgm1Ref.current, bgm2Ref.current]
    } else if (chapter >= 8) {
      active = bgm2Ref.current
      others = [bgm1Ref.current, bgm3Ref.current]
    } else {
      active = bgm1Ref.current
      others = [bgm2Ref.current, bgm3Ref.current]
    }
    others.forEach(fadeOut)
    fadeIn(active)
    return () => {
      fadeIntervalsRef.current.forEach(id => clearInterval(id))
      fadeIntervalsRef.current = []
    }
  }, [chapter])

  // Mute/unmute
  useEffect(() => {
    if (bgm1Ref.current) bgm1Ref.current.muted = muted
    if (bgm2Ref.current) bgm2Ref.current.muted = muted
    if (bgm3Ref.current) bgm3Ref.current.muted = muted
  }, [muted])

  // Confetti on final chapter
  useEffect(() => {
    if (chapter === CHAPTERS.length - 1 && !showIntro) {
      const dur = 4000
      const end = Date.now() + dur
      const frame = () => {
        confetti({
          particleCount: 4, angle: 60, spread: 55, origin: { x: 0 },
          colors: ['#d97706', '#b45309', '#f59e0b', '#fbbf24', '#fde68a'],
        })
        confetti({
          particleCount: 4, angle: 120, spread: 55, origin: { x: 1 },
          colors: ['#d97706', '#b45309', '#f59e0b', '#fbbf24', '#fde68a'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [chapter, showIntro])

  // =============== RENDER SCENES ===============
  const renderScene = () => {
    switch (chapter) {
      // ======== BAB 0: Pintu Awal (Gate Portal) ========
      case 0:
        return (
          <SceneCard mood="mystery">
            <div className="text-center space-y-4">
              <motion.p
                className="text-5xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                🔐
              </motion.p>
              <motion.h1
                className="text-lg font-bold text-amber-400"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                ⚠️ Anomali Terdeteksi
              </motion.h1>
              <motion.p
                className="text-amber-300/70 text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Server mendeteksi ada makhluk yang hari ini bertambah tua.
                Identitas berhasil ditelusuri...
              </motion.p>
              <motion.p
                className="text-2xl font-bold text-amber-400 font-[Dancing_Script] animate-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
              >
                ✨ Putri Almeyda ✨
              </motion.p>
              <motion.p
                className="text-xs text-amber-500/50 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                Misi: Buka kado digital ini. Berani gak?
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
              >
                <NextBtn onClick={next} label="🔓 Siapa takut, Buka ajalah" />
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[0].meaning} />
          </SceneCard>
        )

      // ======== BAB I: Ritual Persiapan ========
      case 1: {
        const prepItems = [
          '📍 Cari tempat yang nyaman dan tenang dulu.',
          '🔇 Jauh dari keramaian. Fokus ke sini aja.',
          '👀 Pastiin gak ada yang ngintip layar kamu.',
          '☕ Kalau bisa, siapin minum. Biar makin adem.',
        ]
        return (
          <SceneCard mood="calm">
            <div className="text-center space-y-3">
              {/* Animated room check area */}
              <div className="relative h-32 sm:h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100">
                {/* Window */}
                <div className="absolute left-3 top-3">
                  <div className="relative w-14 h-16 border-2 border-amber-400 rounded-md bg-sky-100 overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-2 gap-px p-px">
                      <div className="bg-sky-200/60 rounded-sm" />
                      <div className="bg-sky-200/60 rounded-sm" />
                      <div className="bg-sky-200/60 rounded-sm" />
                      <div className="bg-sky-200/60 rounded-sm" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-amber-700/90 rounded-sm origin-left flex items-center justify-center"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 2.5, duration: 0.5, ease: 'easeIn' }}
                    >
                      <span className="text-[10px]">🔒</span>
                    </motion.div>
                  </div>
                  <p className="text-[9px] text-amber-500 mt-0.5 text-center">Jendela</p>
                </div>

                {/* Door */}
                <div className="absolute right-3 top-3">
                  <div className="relative w-12 h-18 border-2 border-amber-400 rounded-t-md bg-amber-100 overflow-hidden">
                    <div className="absolute inset-0 bg-amber-200/60" />
                    <div className="absolute right-1.5 top-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <motion.div
                      className="absolute inset-0 bg-amber-700/90 rounded-sm origin-right flex items-center justify-center"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 5, duration: 0.5, ease: 'easeIn' }}
                    >
                      <span className="text-[10px]">🔒</span>
                    </motion.div>
                  </div>
                  <p className="text-[9px] text-amber-500 mt-0.5 text-center">Pintu</p>
                </div>

                {/* Curtain */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <motion.div
                    className="flex gap-0"
                    initial={{ y: -40 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 7.5, duration: 0.6, ease: 'easeOut' }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-6 h-8 bg-amber-600/70 rounded-b-full border-b border-amber-700/30" />
                    ))}
                  </motion.div>
                  <motion.p
                    className="text-[9px] text-amber-500 text-center mt-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 8 }}
                  >
                    Gorden ✓
                  </motion.p>
                </div>

                {/* Status bubbles */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  {[
                    { text: '👀 Mengecek...', delay: 0.5, dur: 2 },
                    { text: '🪟 Jendela ditutup ✓', delay: 2.8, dur: 1.5 },
                    { text: '🚪 Pintu ditutup ✓', delay: 5.3, dur: 1.5 },
                    { text: '🫧 Gorden ditarik ✓', delay: 7.8, dur: 1.5 },
                    { text: '✅ Aman! Gak ada yang ngintip.', delay: 9, dur: 99 },
                  ].map((s, i) => (
                    <motion.p
                      key={i}
                      className="text-[11px] font-semibold text-amber-800 whitespace-nowrap absolute left-1/2 -translate-x-1/2
                                 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border border-amber-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        delay: s.delay,
                        duration: s.dur,
                        times: s.dur > 10 ? [0, 0.05, 1, 1] : [0, 0.1, 0.85, 1],
                      }}
                    >
                      {s.text}
                    </motion.p>
                  ))}
                </div>

                {/* Putri head moving */}
                <motion.img
                  src="/putri-head.png"
                  alt="Putri celingukan"
                  className="absolute w-16 h-16 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
                  style={{ left: 'calc(50% - 32px)', top: 'calc(50% - 24px)' }}
                  animate={{
                    x: [0, -55, -55, 0, 55, 55, 0, 0, 0],
                    y: [0, -15, -15, 0, -15, -15, 0, -25, 0],
                    rotate: [0, -12, -12, 0, 12, 12, 0, 0, 0],
                  }}
                  transition={{
                    duration: 9.5,
                    ease: 'easeInOut',
                    times: [0, 0.12, 0.27, 0.35, 0.42, 0.55, 0.65, 0.75, 0.9],
                  }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>

              <motion.h2
                className="text-base font-bold text-amber-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Eh, bentar. Jangan buru-buru.
              </motion.h2>

              <motion.p
                className="text-xs sm:text-sm text-amber-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Sebelum lanjut, pastiin dulu beberapa hal ya:
              </motion.p>

              <div className="space-y-1.5 sm:space-y-2 text-left">
                {prepItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 1.2, duration: 0.5, type: 'spring' }}
                  >
                    <p className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 sm:p-3 text-amber-800 text-xs sm:text-sm">
                      {item.split('').map((char, ci) => (
                        <motion.span
                          key={ci}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 + i * 1.2 + ci * 0.025 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 9.5 }}
                className="pt-1 space-y-2"
              >
                <div className="bg-amber-50/60 border border-dashed border-amber-300 rounded-xl p-3">
                  <p className="text-[11px] sm:text-xs text-amber-600 leading-relaxed">
                    <span className="font-semibold">📹 Opsional:</span> Kalau dibolehin sih, coba rekam reaksi kamu pas buka ini.
                    Bukan maksa ya — tapi aku penasaran aja gimana ekspresi kamu.
                    Kalau gak mau juga gapapa, kakak santai kok.
                  </p>
                </div>
                <NextBtn onClick={next} label="Oke, udah siap. Lanjut →" />
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[1].meaning} />
          </SceneCard>
        )
      }

      // ======== BAB II: Menembus Waktu (Fake Loading) ========
      case 2:
        return (
          <SceneCard mood="mystery">
            <div className="text-center space-y-4 sm:space-y-5">
              {/* Spinning portal */}
              <div className="relative w-24 h-24 mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-amber-500/30"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-amber-400/20"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full border border-amber-300/10"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
                />
                <motion.p
                  className="absolute inset-0 flex items-center justify-center text-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ⏳
                </motion.p>
              </div>

              <p className="text-amber-400 font-semibold">
                Menembus dimensi waktu...
              </p>

              <div className="w-full bg-amber-900/30 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 10, ease: 'easeInOut' }}
                />
              </div>

              <div className="text-xs text-amber-500/60 space-y-1.5">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  ▸ Ngumpulin doa dari berbagai penjuru...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  ▸ Nyiapin kejutan kecil-kecilan...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
                  ▸ Menghitung level pendiem Putri... (tinggi banget ternyata)
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }}>
                  ▸ Menyusun kata yang selama ini tertahan...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8 }}>
                  ▸ Hampir selesai... sabar ya ✨
                </motion.p>
              </div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[2].meaning} />
          </SceneCard>
        )

      // ======== BAB III: Cermin Kejujuran (Quiz) ========
      case 3:
        return (
          <SceneCard mood="calm">
            <div className="text-center space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                🪞
              </motion.p>
              <h2 className="text-base font-bold text-amber-700">
                Verifikasi Dulu
              </h2>
              <p className="text-xs sm:text-sm text-amber-600">
                Jawab dulu biar aku tau kamu beneran Putri apa bukan:
              </p>
              <p className="text-sm font-semibold text-amber-800">
                &ldquo;Putri Almeyda itu menurut dia sendiri gimana?&rdquo;
              </p>
              <div className="space-y-2">
                {[
                  { text: 'Baik banget 🥰', resp: 'Wkwk, PD amat. Tapi ya... bener sih 😏' },
                  { text: 'Suka ngambek 😤', resp: 'Nah ini sih, kayaknya 4 hari terakhir aku di ngambekin deh💀' },
                  { text: 'Keras kepala 🪨', resp: 'Aku gak kaget. Data sudah mendukung. 📊' },
                  { text: 'Pendiem 🤫', resp: 'Iya, tapi diam-diam kayaknya suka aku deh? 🫠' },
                  { text: 'Cuek 🤫', resp: 'Iya, tapi cueknya bikin tambah suka 🫠' },
                ].map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setQuizAnswer(opt.resp)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, type: 'spring' }}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100
                               border border-amber-200 rounded-xl text-amber-800 text-xs sm:text-sm
                               font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {opt.text}
                  </motion.button>
                ))}
              </div>
              {quizAnswer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="mt-2 p-3 bg-amber-600 border border-amber-700 rounded-xl"
                >
                  <p className="text-xs sm:text-sm text-white font-medium">{quizAnswer}</p>
                </motion.div>
              )}
              {quizAnswer && <NextBtn onClick={next} />}
            </div>
            <ChapterMeaning meaning={CHAPTERS[3].meaning} />
          </SceneCard>
        )

      // ======== BAB IV: Api Kebenaran (Roast) ========
      case 4:
        return (
          <SceneCard mood="warm">
            <div className="text-center space-y-2 sm:space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🔥
              </motion.p>
              <h2 className="text-base font-bold text-amber-700">
                Fakta Tentang Putri Almeyda
              </h2>
              <p className="text-[11px] text-amber-500 italic">
                *jangan baper ya, ini bentuk perhatian 😌*
              </p>
              <div className="max-h-[45vh] sm:max-h-none overflow-y-auto space-y-2 sm:space-y-3 text-left pr-1 no-scrollbar">
                {[
                  '🤫 Pendiem banget. Kadang aku bingung, ini lagi oke atau lagi ngambek.',
                  '😶 Kalau ngambek? Diem. Gak ngomong. Tapi auranya terasa se-ruangan.',
                  '📱 Chat-nya irit banget. "Iya", "Oh", "Hm". Hemat kuota ya?',
                  '👂 Lebih suka dengerin daripada cerita. Padahal aku pengen denger cerita kamu juga.',
                  '😳 Pemalu, tapi diam-diam perhatian. Peduli lewat tindakan, bukan kata-kata.',
                  '🍕 Ditanya "mau makan apa?" — "apa aja ikut". si paling ngikut dan aura gak enakanya tebel banget.',
                  '🫠 Tipe yang bikin orang mikir "dia peduli gak sih?" — ternyata peduli banget, cuma gak bisa nunjukin.',
                ].map((roast, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.25, type: 'spring', stiffness: 120 }}
                  >
                    <p className="text-[11px] sm:text-sm text-amber-800 bg-amber-50 p-2.5 sm:p-3 rounded-xl border border-amber-100">
                      {roast}
                    </p>
                  </motion.div>
                ))}
              </div>
              <motion.p
                className="text-[11px] text-amber-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                Tapi justru itu semua yang bikin <span className="font-bold text-amber-700">Putri Almeyda</span> gak bisa dilupain 🫠
              </motion.p>
              <NextBtn onClick={next} />
            </div>
            <ChapterMeaning meaning={CHAPTERS[4].meaning} />
          </SceneCard>
        )

      // ======== BAB V: Arena Tantangan (Mini Game) ========
      case 5:
        return (
          <SceneCard mood="fun">
            <div className="text-center space-y-2 sm:space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🎮
              </motion.p>
              <h2 className="text-base font-bold text-amber-700">
                Mini Game: Tangkap Hadiahnya!
              </h2>
              <p className="text-xs sm:text-sm text-amber-600">
                Hadiahnya nakal nih, coba tangkap kalau bisa~
              </p>
              <RunawayButton
                label="Ambil Hadiah"
                onCaught={() => setGiftCaught(true)}
              />
              {giftCaught && <NextBtn onClick={next} />}
            </div>
            <ChapterMeaning meaning={CHAPTERS[5].meaning} />
          </SceneCard>
        )

      // ======== BAB VI: Kode Takdir (Coding Jokes) ========
      case 6:
        return (
          <SceneCard mood="code">
            <div className="text-center space-y-2 sm:space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                💻🫠
              </motion.p>
              <h2 className="text-base font-bold text-amber-400">
                Kode Receh buat Putri
              </h2>
              <div className="space-y-2.5 sm:space-y-3">
                {[
                  { code: 'const putri = "irreplaceable"', desc: 'Kamu itu const — mau di-overwrite juga gak bisa ✋' },
                  { code: 'while(true) { kepikiran(putri); }', desc: 'Infinite loop. Gak ada break-nya. Gak ngerti kenapa 🔁' },
                  { code: 'if (putri.online()) fokus = null', desc: 'Putri online? Konsentrasi auto buyar 📵' },
                  { code: 'try { moveOn() } catch { return kePutriLagi }', desc: 'Mau move on? Runtime error terus 🐛' },
                  { code: '// TODO: berhenti mikirin putri', desc: 'Udah jadi TODO setahun. Status: never resolved 🫠' },
                ].map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.3, type: 'spring', stiffness: 120 }}
                    className="bg-black/60 backdrop-blur rounded-xl p-3 sm:p-3.5 text-left border border-green-500/10"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-400/80" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400/80" />
                      <div className="w-2 h-2 rounded-full bg-green-400/80" />
                    </div>
                    <code className="text-green-400 text-[11px] sm:text-xs font-mono">{g.code}</code>
                    <p className="text-amber-400/80 text-[11px] sm:text-xs mt-1.5">{g.desc}</p>
                  </motion.div>
                ))}
              </div>
              <NextBtn onClick={next} />
            </div>
            <ChapterMeaning meaning={CHAPTERS[6].meaning} />
          </SceneCard>
        )

      // ======== BAB VII: Teka-Teki Hati (Quiz Absurd) ========
      case 7:
        return (
          <SceneCard mood="fun">
            <div className="text-center space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🧩
              </motion.p>
              <h2 className="text-base font-bold text-amber-700">
                Quiz Absurd Spesial
              </h2>
              <p className="text-xs sm:text-sm text-amber-600">
                Apa persamaan Putri sama notifikasi HP?
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { text: 'Dua-duanya bikin deg-degan pas muncul 📳', resp: '❌ Salah— tapi kok relate ya 😏' },
                  { text: 'Sama-sama bikin penasaran pas gak muncul 🫠', resp: '⚠️ Putri kalau baca ini pasti cuma diem... tapi dalam hati senyum 😤' },
                  { text: 'Dua-duanya bikin aku buka HP tiap 5 menit 💀', resp: '✅ BENAR! Aku benci betapa akuratnya ini 🏆' },
                  { text: 'Notif bisa di-mute, Putri gak bisa 🔇', resp: '🔥 FACTS. Mau di-mute juga tetep kepikiran 💀' },
                ].map((opt, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setJokeAnswer(opt.resp)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.12, type: 'spring' }}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100
                               border border-amber-200 rounded-xl text-amber-800 text-xs sm:text-sm
                               font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {opt.text}
                  </motion.button>
                ))}
              </div>
              {jokeAnswer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="p-3 bg-amber-700 border border-amber-800 rounded-xl"
                >
                  <p className="text-xs sm:text-sm text-white font-medium">{jokeAnswer}</p>
                </motion.div>
              )}
              {jokeAnswer && <NextBtn onClick={next} />}
            </div>
            <ChapterMeaning meaning={CHAPTERS[7].meaning} />
          </SceneCard>
        )

      // ======== BAB VIII: Lorong Kenangan (Photo Gallery) ========
      case 8: {
        const photos = [
          { src: '/foto1.jpg', caption: 'Ini muka yang bikin aku susah fokus. Gak nyadar kan? 🫠' },
          { src: '/foto2.jpg', caption: 'Berduaan gini aja udah bikin hari aku lebih baik 😊' },
          { src: '/foto3.jpg', caption: 'semoga bisa nyelip ada "akunya" di antara foto keluarga ini🌸' },
        ]
        const photo = photos[photoIdx]
        return (
          <SceneCard mood="nostalgic">
            <div className="text-center space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                📸
              </motion.p>
              <h2 className="text-base font-bold text-amber-700">
                Galeri (yang Putri gak tau aku bakal simpan terus) 📂
              </h2>

              {/* Polaroid-style photo frame */}
              <motion.div
                key={photoIdx}
                initial={{ opacity: 0, rotate: -3, scale: 0.9 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="relative bg-white rounded-lg p-2 pb-12 shadow-lg mx-auto max-w-[280px] sm:max-w-none"
                style={{ transform: `rotate(${photoIdx % 2 === 0 ? -1 : 1}deg)` }}
              >
                <img
                  src={photo.src}
                  alt={`Kenangan ${photoIdx + 1}`}
                  className="w-full h-40 sm:h-56 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div
                  className="hidden w-full h-40 sm:h-56 bg-gradient-to-br from-amber-100 to-amber-50
                              rounded items-center justify-center"
                >
                  <p className="text-amber-500 text-xs sm:text-sm">📷 Taruh foto di /public/foto{photoIdx + 1}.jpg</p>
                </div>
                <p className="absolute bottom-3 left-0 right-0 text-xs text-amber-600 italic px-3 text-center">
                  {photo.caption}
                </p>
              </motion.div>

              <div className="flex justify-center gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIdx(i)}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      i === photoIdx ? 'bg-amber-600 scale-125' : i <= photoIdx ? 'bg-amber-400' : 'bg-amber-200'
                    }`}
                  />
                ))}
              </div>

              {photoIdx < photos.length - 1 ? (
                <NextBtn
                  onClick={() => setPhotoIdx((p) => p + 1)}
                  label={`Foto berikutnya (${photoIdx + 1}/${photos.length}) →`}
                />
              ) : (
                <NextBtn onClick={next} label="Udah semua, lanjut →" />
              )}
            </div>
            <ChapterMeaning meaning={CHAPTERS[8].meaning} />
          </SceneCard>
        )
      }

      // ======== BAB IX: Surat Tak Terkirim (Warm Message) ========
      case 9:
        return (
          <SceneCard mood="emotional">
            <div className="text-center space-y-3">
              {/* Envelope opening animation */}
              <div className="relative w-20 h-16 mx-auto mb-2">
                <motion.div
                  className="absolute bottom-0 w-20 h-12 bg-amber-100 rounded-b-lg border-2 border-amber-300"
                />
                <motion.div
                  className="absolute top-0 w-20 h-10 bg-amber-200 border-2 border-amber-300 origin-bottom"
                  style={{ clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)' }}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: 180 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                />
                <motion.p
                  className="absolute inset-0 flex items-center justify-center text-3xl"
                  initial={{ y: 0 }}
                  animate={{ y: -20, scale: 1.3 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  💌
                </motion.p>
              </div>

              <motion.h2
                className="text-lg font-bold text-amber-700 font-[Dancing_Script]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Hei, Putri.
              </motion.h2>

              <div className="text-xs sm:text-sm text-amber-800 leading-relaxed space-y-2.5 sm:space-y-3 text-left">
                <TypewriterText
                  text="Aku tau kamu orangnya pendiem. Gak banyak cerita. Lebih sering dengerin daripada ngomong."
                  delay={2}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Tapi justru itu yang bikin aku ngerasa... kamu beda. Kamu tipe yang peduli lewat hal kecil, yang gak perlu bilang apa-apa tapi kehadirannya kerasa."
                  delay={5}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Kamu mungkin gak sadar, tapi orang kayak kamu itu langka. Yang diem, tapi bikin orang di sekitarnya ngerasa aman."
                  delay={11}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Kamu penting. Kamu berarti. Lebih dari yang kamu tau. 🤍"
                  delay={16}
                  className="text-amber-800 font-semibold text-center text-base pt-1"
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 19 }}
              >
                <NextBtn onClick={next} />
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[9].meaning} />
          </SceneCard>
        )

      // ======== BAB X: Waktu yang Berjalan (Growing Up) ========
      case 10:
        return (
          <SceneCard mood="emotional">
            <div className="text-center space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              >
                🕰️
              </motion.p>
              <h2 className="text-base font-bold text-amber-700">
                Soal Bertambah Umur...
              </h2>
              <div className="text-xs sm:text-sm text-amber-800 leading-relaxed space-y-2.5 sm:space-y-3 text-left">
                <TypewriterText
                  text="Aku tau bertambah umur itu kadang bikin mikir banyak. Tanggung jawab nambah, ekspektasi orang makin tinggi, dan waktu rasanya makin gak bisa dipelanin."
                  delay={0.5}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Tapi coba deh lihat ke belakang sebentar. Semua yang udah kamu lewatin — yang berat, yang bikin nangis, yang bikin kamu hampir nyerah — kamu berhasil melewatinya. Semua. Tanpa terkecuali."
                  delay={6}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Setiap luka yang pelan-pelan sembuh, setiap malam yang akhirnya berubah jadi pagi, setiap senyum yang awalnya dipaksain tapi lama-lama jadi tulus — itu semua bukti bahwa kamu jauh lebih kuat dari yang kamu akui."
                  delay={13}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Jadi gak perlu takut tumbuh. Aku percaya sama kamu. 🤍"
                  delay={21}
                  className="text-amber-800 font-semibold text-center pt-1"
                />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 24 }}>
                <NextBtn onClick={next} />
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[10].meaning} />
          </SceneCard>
        )

      // ======== BAB XI: Kata yang Tertahan (Honest Feelings) ========
      case 11:
        return (
          <SceneCard mood="emotional">
            <div className="text-center space-y-3">
              <motion.p
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🫠
              </motion.p>
              <motion.h2
                className="text-lg font-bold text-amber-700 font-[Dancing_Script]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Ini agak jujur. Maaf.
              </motion.h2>
              <div className="text-xs sm:text-sm text-amber-800 leading-relaxed space-y-2.5 sm:space-y-3">
                <TypewriterText
                  text="Aku gak tau harus bilang ini kapan, jadi ya sekarang aja."
                  delay={0.8}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Kamu itu pendiem. Jarang cerita. Suka diem kalau lagi ngerasa sesuatu. Dan jujur, kadang aku bingung — kamu lagi oke atau lagi ngambek."
                  delay={3}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text="Tapi anehnya, justru karena kamu kayak gitu, aku malah jadi lebih pengen ngerti kamu. Kamu bikin aku peduli lebih dari yang aku rencanain, dan kehadiran kamu itu bikin hal-hal yang biasa jadi terasa beda."
                  delay={8}
                  className="text-xs sm:text-sm text-amber-800 leading-relaxed"
                />
                <TypewriterText
                  text={'\u201cKamu itu ketenangan yang gak aku cari, tapi ternyata aku butuhkan.\u201d 🫠'}
                  delay={16}
                  className="text-base text-amber-800 font-semibold pt-2 text-center"
                />
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 20 }}>
                <NextBtn onClick={next} />
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[11].meaning} />
          </SceneCard>
        )

      // ======== BAB XII: Konstelasi Putri (Interactive Constellation) ========
      case 12: {
        const constellationStars = [
          { x: 18, y: 18, msg: 'Kamu tipe yang nolak makanan tapi takut bikin orang kecewa 🍕' },
          { x: 50, y: 10, msg: 'Bilang "gapapa" tapi dalemnya udah overthinking 🤯' },
          { x: 82, y: 20, msg: 'Lebih milih diem daripada bikin ribet orang lain 🫠' },
          { x: 30, y: 42, msg: 'Sering ngalah bukan karena lemah, tapi karena gak enakan 🤍' },
          { x: 70, y: 40, msg: 'Kamu selalu mikirin perasaan orang lain duluan sebelum diri sendiri 🌙' },
          { x: 15, y: 68, msg: 'Terlalu baik sampe kadang lupa — kamu juga boleh egois 🥺' },
          { x: 50, y: 62, msg: 'Si paling gak enakan, tapi justru itu yang bikin kamu spesial ✨' },
          { x: 82, y: 70, msg: 'Kamu bintang yang terang tapi gak pernah ngerasa bersinar 🌌' },
        ]
        return (
          <SceneCard mood="emotional">
            <div className="text-center space-y-3 sm:space-y-4">
              <motion.p
                className="text-4xl"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                🌌
              </motion.p>
              <h2 className="text-lg font-bold text-amber-700 font-[Dancing_Script]">
                Konstelasi Putri
              </h2>
              <p className="text-xs sm:text-sm text-amber-600">
                Tap setiap bintang untuk membaca pesan tersembunyi ✨
              </p>

              {/* Interactive Night Sky */}
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0c0a09] via-[#1a1520] to-[#0c0a09] border border-amber-800/20">
                {/* Twinkling background stars */}
                {Array.from({ length: 40 }, (_, i) => (
                  <motion.div
                    key={`bg-${i}`}
                    className="absolute w-[2px] h-[2px] bg-white rounded-full"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{ opacity: [0.1, 0.6, 0.1] }}
                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
                  />
                ))}

                {/* Constellation lines (connect stars) */}
                <svg className="absolute inset-0 w-full h-full z-[1]">
                  {constellationStars.slice(0, -1).map((star, i) => {
                    const next = constellationStars[i + 1]
                    return (
                      <motion.line
                        key={`line-${i}`}
                        x1={`${star.x}%`} y1={`${star.y}%`}
                        x2={`${next.x}%`} y2={`${next.y}%`}
                        stroke="rgba(251,191,36,0.15)"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.3, duration: 0.8 }}
                      />
                    )
                  })}
                </svg>

                {/* Interactive constellation stars — only one popup visible at a time */}
                {constellationStars.map((star, i) => (
                  <ConstellationStar
                    key={i}
                    star={star}
                    index={i}
                    isActive={activeStarIdx === i}
                    hasBeenTapped={tappedStars.has(i)}
                    onActivate={(idx) => {
                      setActiveStarIdx((prev) => prev === idx ? null : idx)
                      setTappedStars((prev) => new Set(prev).add(idx))
                    }}
                  />
                ))}

                {/* Shooting star */}
                <motion.div
                  className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]"
                  initial={{ left: '10%', top: '10%', opacity: 0 }}
                  animate={{
                    left: ['10%', '80%'],
                    top: ['10%', '40%'],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 6, ease: 'easeIn' }}
                />
              </div>

              <motion.p
                className="text-[11px] text-amber-500/60 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                Setiap bintang punya cerita tentang kamu 🌙
              </motion.p>

              <NextBtn onClick={next} />
            </div>
            <ChapterMeaning meaning={CHAPTERS[12].meaning} />
          </SceneCard>
        )
      }

      // ======== BAB XIII: Misi Luar Angkasa (Space Shooter) ========
      case 13:
        return <SpaceShooter onComplete={next} />

      // ======== BAB XIV: Hari Istimewa (Birthday Wish) ========
      case 14:
        return (
          <SceneCard mood="celebration">
            <div className="text-center space-y-3">
              {/* Animated cake with candle glow */}
              <div className="relative inline-block">
                <motion.p
                  className="text-6xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  🎂
                </motion.p>
                {/* Candle glow */}
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.4), transparent)' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>

              <motion.h2
                className="text-xl font-bold text-amber-800 font-[Dancing_Script]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Barakallah Fi Umrik, Putri
              </motion.h2>
              <motion.h3
                className="text-lg font-bold text-amber-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Putri Almeyda 🎉
              </motion.h3>

              <div className="text-xs sm:text-sm text-amber-800 leading-relaxed space-y-2">
                {[
                  'Di umur yang baru ini, aku doain kamu dapet kebahagiaan yang bahkan kamu sendiri gak nyangka bakal dateng.',
                  'Semua mimpi yang kamu simpen diam-diam, yang gak pernah kamu ceritain ke siapapun — semoga satu per satu mulai jadi nyata.',
                  'Semoga hati kamu tenang, langkah kamu dijaga, dan kamu dikelilingi orang-orang yang beneran tulus.',
                ].map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.5 }}
                  >
                    {text}
                  </motion.p>
                ))}
                <motion.p
                  className="text-xs text-amber-500 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8 }}
                >
                  (termasuk aku. yang diem-diem aja. tapi tulus. percaya deh. 🫠)
                </motion.p>
              </div>

              <div className="flex justify-center gap-2 text-2xl py-2">
                {['🎈', '🎁', '🎊', '🎀', '🎉'].map((e, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}>
                <NextBtn onClick={next} label="Terakhir... 🤲" />
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[14].meaning} />
          </SceneCard>
        )

      // ======== BAB XV: Kejutan Terakhir (Prank Gift) ========
      case 15:
        return (
          <SceneCard mood="fun">
            <div className="text-center space-y-3">
              {!prankOpened ? (
                <>
                  <motion.p
                    className="text-4xl"
                    animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    🎁
                  </motion.p>
                  <h2 className="text-lg font-bold text-amber-700 font-[Dancing_Script]">
                    Sekarang Boleh Buka Kadonya!
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-600">
                    Ada kado spesial buat kamu. Siap?
                  </p>

                  {/* Gift Box */}
                  <div
                    className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 cursor-pointer"
                    onClick={() => setPrankOpened(true)}
                  >
                    <motion.div
                      className="absolute bottom-0 w-full h-28 sm:h-32 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg shadow-lg border-2 border-amber-700"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-red-500/80" />
                      <div className="absolute top-1/2 -translate-y-1/2 w-full h-4 bg-red-500/80" />
                    </motion.div>
                    <motion.div
                      className="absolute top-4 sm:top-2 w-full h-10 bg-gradient-to-b from-amber-300 to-amber-500 rounded-t-lg border-2 border-amber-700 shadow-md"
                      animate={{ y: [0, -4, 0], rotate: [0, 1, -1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🎀</div>
                    </motion.div>
                  </div>
                  <motion.p
                    className="text-[11px] text-amber-500"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Tap kotak untuk buka →
                  </motion.p>
                </>
              ) : (
                <>
                  <motion.div className="relative mx-auto w-40 h-44 sm:w-48 sm:h-52">
                    {/* Lid flying off */}
                    <motion.div
                      className="absolute top-0 w-full h-10 bg-gradient-to-b from-amber-300 to-amber-500 rounded-t-lg border-2 border-amber-700"
                      initial={{ y: 0, rotate: 0, opacity: 1 }}
                      animate={{ y: -120, rotate: 30, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🎀</div>
                    </motion.div>

                    <div className="absolute bottom-0 w-full h-28 sm:h-32 bg-gradient-to-b from-amber-400 to-amber-600 rounded-lg shadow-lg border-2 border-amber-700 overflow-hidden">
                      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-full bg-red-500/80" />
                      <div className="absolute top-1/2 -translate-y-1/2 w-full h-4 bg-red-500/80" />
                    </div>

                    {/* Putri photo pops out */}
                    <motion.img
                      src="/putri-prank.png"
                      alt="SURPRISE!"
                      className="absolute bottom-16 sm:bottom-20 left-1/2 w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-xl z-10"
                      initial={{ y: 60, x: '-50%', scale: 0, rotate: -10 }}
                      animate={{ y: -10, x: '-50%', scale: 1, rotate: [0, -8, 8, -5, 3, 0] }}
                      transition={{
                        y: { delay: 0.3, duration: 0.5, type: 'spring', stiffness: 200 },
                        scale: { delay: 0.3, duration: 0.4, type: 'spring' },
                        rotate: { delay: 0.8, duration: 1, ease: 'easeOut' },
                      }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />

                    {/* Confetti burst */}
                    {[...Array(10)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-lg"
                        style={{ left: '50%' }}
                        initial={{ y: 40, x: 0, opacity: 1 }}
                        animate={{
                          y: -60 - Math.random() * 60,
                          x: (Math.random() - 0.5) * 160,
                          opacity: 0,
                          rotate: Math.random() * 360,
                        }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 1.2, ease: 'easeOut' }}
                      >
                        {['✨', '🎊', '⭐', '🎉', '💫', '🌟', '🎀', '🤎', '🎈', '🎁'][i]}
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, type: 'spring' }}
                  >
                    <p className="text-2xl font-bold text-amber-700">😂 KENA PRANK! 😂</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="space-y-2"
                  >
                    <p className="text-xs sm:text-sm text-amber-700">
                      Hehe maaf ya bercanda... 🙏
                    </p>
                    <p className="text-xs sm:text-sm text-amber-800 font-medium">
                      Sekarang buka kado yang beneran ya.
                      Maaf ya bukan barang mewah, tapi semoga bisa bermanfaat ya dek...
                    </p>
                    <p className="text-base font-bold text-amber-800 font-[Dancing_Script]">
                      Happy Birthday, Putri! 🎂✨
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
                  >
                    <NextBtn onClick={next} label="Lanjut ke doa terakhir 🤲" />
                  </motion.div>
                </>
              )}
            </div>
            <ChapterMeaning meaning={CHAPTERS[15].meaning} />
          </SceneCard>
        )

      // ======== BAB XVI: Doa & Harapan (Final Prayer + Confetti) ========
      case 16:
        return (
          <SceneCard mood="spiritual">
            <div className="text-center space-y-3">
              <motion.p
                className="text-4xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                🤲
              </motion.p>
              <h2 className="text-lg font-bold text-amber-800 font-[Dancing_Script]">
                Doa buat Putri Almeyda
              </h2>

              <motion.div
                className="bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-5 text-xs sm:text-sm text-amber-900 leading-relaxed space-y-2 sm:space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-semibold text-amber-800 text-base">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                <p>
                  Ya Allah, di hari istimewa hamba-Mu <span className="font-bold text-amber-800">Putri Almeyda</span>,
                  aku memohon kepada-Mu...
                </p>
                <p>
                  Berkahilah umurnya, lapangkanlah rezekinya,
                  mudahkanlah setiap urusannya, dan jauhkanlah dia
                  dari segala hal yang menyakiti hatinya.
                </p>
                <p>
                  Jadikanlah dia hamba-Mu yang selalu bersyukur,
                  kuat dalam ujian, dan tulus dalam memberi.
                </p>
                <p>
                  Berikanlah dia kebahagiaan yang nyata — di dunia dan akhirat.
                  Lindungilah dia, keluarganya, dan semua orang yang ada di hidupnya.
                </p>
                <motion.p
                  className="font-bold text-amber-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  Aamiin Ya Rabbal &apos;Aalamiin 🤍
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="space-y-2"
              >
                <p className="text-sm text-amber-700 font-semibold">
                  — Dari orang yang diam-diam selalu doain kamu 🫠
                </p>
                <p className="text-xs text-amber-500">
                  Website ini aku bikin khusus buat kamu. Selamat ulang tahun, Putri 🎂✨
                </p>
              </motion.div>

              <div className="flex justify-center gap-3 text-3xl pt-2">
                {['🎉', '🎊', '✨', '🎂', '💖'].map((e, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -15, 0], rotate: [0, 20, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>

              {/* Credits */}
              <motion.div
                className="pt-4 border-t border-amber-200/30 space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
              >
                <p className="text-[10px] text-amber-400/40">Dibuat dengan penuh perasaan 🤍</p>
                <p className="text-[10px] text-amber-400/30">— untuk Putri Almeyda, selamanya —</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.5 }}
              >
                <NextBtn onClick={next} label="Lihat di balik layar 🎬" />
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[16].meaning} />
          </SceneCard>
        )

      // ======== BAB XVII: Di Balik Layar (BTS) ========
      case 17:
        return (
          <SceneCard mood="bts">
            <div className="text-center space-y-5">
              <motion.p
                className="text-4xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                🎬
              </motion.p>
              <h2 className="text-lg font-bold text-amber-200 font-[Dancing_Script]">
                Behind the Scene
              </h2>
              <motion.p
                className="text-xs text-amber-400/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Proses di balik semua ini...
              </motion.p>

              {/* BTS Photos */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                {['/bts1.jpg', '/bts2.jpg'].map((src, i) => (
                  <motion.div
                    key={i}
                    className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-700/30"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.5 }}
                  >
                    <img
                      src={src}
                      alt={`Behind the scene ${i + 1}`}
                      className="w-full h-auto object-cover rounded-2xl"
                      style={{ maxHeight: 320 }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Heartfelt message */}
              <motion.div
                className="bg-stone-800/60 border border-amber-700/30 rounded-2xl p-4 sm:p-5 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <p className="text-sm sm:text-base text-amber-100 leading-relaxed">
                  Maaf ya dek, effort kakak cuma baru segini, dan belom bisa kasih yang mewah dan lebih.
                </p>
              </motion.div>

              <motion.p
                className="text-xs text-amber-500/50 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                Tapi semua ini tulus dari hati 🤍
              </motion.p>

              {/* Final credits */}
              <motion.div
                className="pt-4 border-t border-amber-700/20 space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
              >
                <p className="text-[10px] text-amber-500/30">— fin —</p>
              </motion.div>
            </div>
            <ChapterMeaning meaning={CHAPTERS[17].meaning} />
          </SceneCard>
        )

      default:
        return null
    }
  }

  // =============== MAIN RETURN ===============
  return (
    <div
      className="min-h-screen min-h-dvh relative overflow-x-hidden"
      style={{ background: bgGradient, transition: 'background 1s ease' }}
    >
      {/* Background music */}
      <audio ref={bgm1Ref} src="/bgm1.mp3" loop preload="auto" />
      <audio ref={bgm2Ref} src="/bgm2.mp3" loop preload="auto" />
      <audio ref={bgm3Ref} src="/bgm3.mp3" loop preload="auto" />

      {/* Dynamic particles */}
      {chapter >= 0 && !showIntro && <DynamicParticles mood={currentMood} />}

      {/* Mute toggle — hidden during fullscreen game (ch 13) */}
      {chapter >= 0 && !showIntro && chapter !== 13 && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="fixed top-2 right-3 z-50 w-9 h-9 flex items-center justify-center
                     bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-200
                     text-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}

      {/* DEV: Scene Jumper */}
      {DEV_MODE && (
        <div className="fixed bottom-0 left-0 z-[999]">
          <button
            onClick={() => setDevOpen((o) => !o)}
            className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-tr-lg
                       cursor-pointer hover:bg-red-500 transition-colors"
          >
            {devOpen ? 'x DEV' : '⚙️ DEV'}
          </button>
          {devOpen && (
            <div className="bg-black/95 backdrop-blur-md border border-red-500/30 rounded-tr-2xl
                           p-2 max-h-[70vh] overflow-y-auto w-52 no-scrollbar">
              <p className="text-red-400 text-[9px] font-bold mb-1.5 tracking-wider">JUMP TO SCENE</p>
              <button
                onClick={() => { setChapter(-1); setShowIntro(false); setDevOpen(false) }}
                className={`w-full text-left text-[10px] px-2 py-1 rounded mb-0.5 cursor-pointer transition-colors
                  ${chapter === -1 ? 'bg-red-600 text-white' : 'text-amber-300 hover:bg-white/10'}`}
              >
                🎬 Title Card
              </button>
              {CHAPTERS.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => { setChapter(i); setShowIntro(false); setDevOpen(false) }}
                  className={`w-full text-left text-[10px] px-2 py-1 rounded mb-0.5 cursor-pointer transition-colors
                    ${chapter === i ? 'bg-amber-600 text-white' : 'text-amber-300/80 hover:bg-white/10'}`}
                >
                  {ch.icon} {ch.num || '0'} {ch.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Journey indicator — hidden during fullscreen game (ch 13) */}
      {chapter >= 0 && !showIntro && chapter !== 13 && (
        <JourneyIndicator
          current={chapter}
          total={CHAPTERS.length}
          chapter={currentChapter}
          onOpenMap={() => setShowMap(true)}
        />
      )}

      {/* Main content */}
      <div className="w-full flex items-start justify-center px-3 sm:px-4 pt-12 pb-8">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {chapter === -1 ? (
              <TitleCard key="title" onStart={startFromTitle} />
            ) : showIntro ? (
              <ChapterIntro
                key={`intro-${chapter}`}
                chapter={currentChapter}
                onComplete={completeIntro}
              />
            ) : (
              <motion.div
                key={`scene-${chapter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {renderScene()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Journey map overlay */}
      <AnimatePresence>
        {showMap && (
          <JourneyMap
            current={chapter}
            chapters={CHAPTERS}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
