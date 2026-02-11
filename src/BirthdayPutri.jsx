import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// ============================================================
// BirthdayPutri.jsx — Website Kado Ulang Tahun Putri Almeyda
// Single-page React + Tailwind + Framer Motion
// Flow: usil → lucu → gombal → hangat → menyentuh → doa
// ============================================================

const TOTAL_SCENES = 15

// ---------- Komponen Tombol Kabur (Funny Running Button) ----------
function RunawayButton({ label, onCaught }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [caught, setCaught] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const containerRef = useRef(null)

  const runAway = useCallback(() => {
    setAttempts((a) => a + 1)
    const maxX = 200
    const maxY = 180
    setPos({
      x: (Math.random() - 0.5) * maxX,
      y: (Math.random() - 0.5) * maxY,
    })
  }, [])

  // Setelah 6 kali gagal, biarkan ketangkap
  const handleClick = () => {
    if (attempts >= 5) {
      setCaught(true)
      onCaught()
    } else {
      runAway()
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-center h-48">
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
                       font-semibold shadow-lg hover:shadow-xl text-lg cursor-pointer select-none"
          >
            🎁 {label}
          </motion.button>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-amber-700 font-semibold">Yeay, dapet! Lanjut ya~</p>
        </motion.div>
      )}
    </div>
  )
}

// ---------- Komponen Progress Bar ----------
function ProgressBar({ current, total }) {
  const pct = ((current + 1) / total) * 100
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1.5 bg-amber-100">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-center text-[11px] text-amber-500 mt-1 font-medium">
        {current + 1} / {total}
      </p>
    </div>
  )
}

// ---------- Komponen Floating Hearts Background ----------
function FloatingHearts() {
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    dur: 6 + Math.random() * 6,
    size: 12 + Math.random() * 18,
    emoji: ['🤎', '☕', '🍂', '✨', '🌿', '🍪'][i % 6],
  }))
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute opacity-20"
          style={{ left: `${h.left}%`, fontSize: h.size, top: '105%' }}
          animate={{ y: [0, -(window.innerHeight + 200)] }}
          transition={{
            duration: h.dur,
            repeat: Infinity,
            delay: h.delay,
            ease: 'linear',
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  )
}

// ---------- Komponen Card Wrapper ----------
function SceneCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="relative w-full max-w-md mx-auto bg-white/80 backdrop-blur-md 
                 rounded-3xl shadow-xl shadow-amber-200/40 p-7 md:p-9 
                 border border-amber-100 z-10"
    >
      {children}
    </motion.div>
  )
}

// ---------- Tombol Next ----------
function NextBtn({ onClick, label = 'Lanjut →' }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700 
                 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg 
                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      {label}
    </button>
  )
}

// =============================================
//  KOMPONEN UTAMA
// =============================================
export default function BirthdayPutri() {
  const [scene, setScene] = useState(0)
  const [fakeLoading, setFakeLoading] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [jokeAnswer, setJokeAnswer] = useState(null)
  const [giftCaught, setGiftCaught] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const audioRef = useRef(null)

  const next = () => setScene((s) => Math.min(s + 1, TOTAL_SCENES - 1))

  // Confetti di scene terakhir
  useEffect(() => {
    if (scene === TOTAL_SCENES - 1) {
      const dur = 4000
      const end = Date.now() + dur
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#d97706', '#b45309', '#f59e0b', '#fbbf24', '#fde68a'],
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#d97706', '#b45309', '#f59e0b', '#fbbf24', '#fde68a'],
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [scene])

  // =============== RENDER SCENES ===============
  const renderScene = () => {
    switch (scene) {
      // -------- SCENE 0: Gate Portal --------
      case 0:
        return (
          <SceneCard key="s0">
            <div className="text-center space-y-4">
              <motion.p
                className="text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🔐
              </motion.p>
              <h1 className="text-xl font-bold text-amber-700">
                ⚠️ Alert: Anomali Terdeteksi
              </h1>
              <p className="text-amber-600 text-sm leading-relaxed">
                Server mendeteksi ada makhluk yang hari ini bertambah tua.
                Identitas berhasil ditelusuri...
              </p>
              <p className="text-2xl font-bold text-amber-800 font-[Dancing_Script]">
                ✨ Putri Almeyda ✨
              </p>
              <p className="text-xs text-amber-500 italic">
                Misi: Buka kado digital ini. Berani gak?
              </p>
              <NextBtn onClick={next} label="🔓 Siapa takut, Buka ajalah" />
            </div>
          </SceneCard>
        )

      // -------- SCENE 1: Persiapan Sebelum Buka --------
      case 1: {
        const prepItems = [
          '📍 Cari tempat yang nyaman dan tenang dulu.',
          '🔇 Jauh dari keramaian. Fokus ke sini aja.',
          '👀 Pastiin gak ada yang ngintip layar kamu.',
          '☕ Kalau bisa, siapin minum. Biar makin adem.',
        ]
        // Timeline: 0s tengah → 1s ke jendela → 2.5s tutup jendela →
        //           3.5s ke pintu → 5s tutup pintu → 6s ke gorden →
        //           7.5s tutup gorden → 8.5s balik tengah aman
        return (
          <SceneCard key="s1">
            <div className="text-center space-y-4">
              {/* === Area animasi Putri cek ruangan === */}
              <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-100">

                {/* Jendela kiri */}
                <div className="absolute left-3 top-3">
                  <div className="relative w-14 h-16 border-2 border-amber-400 rounded-md bg-sky-100 overflow-hidden">
                    {/* kaca jendela */}
                    <div className="absolute inset-0 grid grid-cols-2 gap-px p-px">
                      <div className="bg-sky-200/60 rounded-sm" />
                      <div className="bg-sky-200/60 rounded-sm" />
                      <div className="bg-sky-200/60 rounded-sm" />
                      <div className="bg-sky-200/60 rounded-sm" />
                    </div>
                    {/* daun jendela menutup */}
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

                {/* Pintu kanan */}
                <div className="absolute right-3 top-3">
                  <div className="relative w-12 h-18 border-2 border-amber-400 rounded-t-md bg-amber-100 overflow-hidden">
                    {/* pintu */}
                    <div className="absolute inset-0 bg-amber-200/60" />
                    <div className="absolute right-1.5 top-1/2 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {/* pintu menutup / gembok muncul */}
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

                {/* Gorden atas */}
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

                {/* Status teks — speech bubble */}
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

                {/* Kepala Putri bergerak */}
                <motion.img
                  src="/putri-head.png"
                  alt="Putri celingukan"
                  className="absolute w-24 h-24 object-contain drop-shadow-lg"
                  style={{ left: 'calc(50% - 32px)', top: 'calc(50% - 24px)' }}
                  animate={{
                    x:      [0,  -55,  -55,  0,   55,   55,  0,    0,   0],
                    y:      [0,  -15,  -15,  0,  -15,  -15,  0,  -25,   0],
                    rotate: [0,  -12,  -12,  0,   12,   12,  0,    0,   0],
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
                className="text-lg font-bold text-amber-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Eh, bentar. Jangan buru-buru.
              </motion.h2>

              <motion.p
                className="text-sm text-amber-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Sebelum lanjut, pastiin dulu beberapa hal ya:
              </motion.p>

              <div className="space-y-2 text-left">
                {prepItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + i * 1.2, duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    <p className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-amber-800 text-sm">
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
                className="pt-2 space-y-3"
              >
                <div className="bg-amber-50/60 border border-dashed border-amber-300 rounded-xl p-4">
                  <p className="text-xs text-amber-600 leading-relaxed">
                    <span className="font-semibold">📹 Opsional:</span> Kalau dibolehin sih, coba rekam reaksi kamu pas buka ini.
                    Bukan maksa ya — tapi aku penasaran aja gimana ekspresi kamu. 
                    Kalau gak mau juga gapapa, kakak santai kok.
                  </p>
                </div>
                <NextBtn onClick={next} label="Oke, udah siap. Lanjut →" />
              </motion.div>
            </div>
          </SceneCard>
        )
      }

      // -------- SCENE 2: Fake Loading --------
      case 2:
        if (!fakeLoading) {
          setFakeLoading(true)
          setTimeout(() => next(), 12000)
        }
        return (
          <SceneCard key="s2">
            <div className="text-center space-y-5">
              <motion.p
                className="text-4xl"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                ⏳
              </motion.p>
              <p className="text-amber-700 font-semibold">
                Bentar ya. Sabar dikit...
              </p>
              <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-700 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 8 }}
                />
              </div>
              <div className="text-xs text-amber-500 space-y-1">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  ▸ Ngumpulin doa dari berbagai penjuru...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                  ▸ Nyiapin kejutan kecil-kecilan...
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  ▸ Menghitung level pendiem Putri... (tinggi banget ternyata)
                </motion.p>
              </div>
            </div>
          </SceneCard>
        )

      // -------- SCENE 2: Verifikasi Usil --------
      case 3:
        return (
          <SceneCard key="s3">
            <div className="text-center space-y-4">
              <p className="text-4xl">🤔</p>
              <h2 className="text-lg font-bold text-amber-700">
                Verifikasi Dulu
              </h2>
              <p className="text-sm text-amber-600">
                Jawab dulu biar aku tau kamu beneran Putri apa bukan:
              </p>
              <p className="text-base font-semibold text-amber-800">
                "Putri Almeyda itu menurut dia sendiri gimana?"
              </p>
              <div className="space-y-2">
                {[
                  { text: 'Baik banget 🥰', resp: 'Wkwk, PD amat. Tapi ya... bener sih 😏' },
                  { text: 'Suka ngambek 😤', resp: 'Nah ini sih, kayaknya 4 hari terakir aku di ngambekin deh💀' },
                  { text: 'Keras kepala 🪨', resp: 'Aku gak kaget. Data sudah mendukung. 📊' },
                  { text: 'Pendiem 🤫', resp: 'Iya, tapi diam-diam kayaknya suka aku deh? 🫠' },
                  { text: 'Cuek 🤫', resp: 'Iya, tapi cueknya bikin tambah suka 🫠' },
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setQuizAnswer(opt.resp)}
                    className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 
                               border border-amber-200 rounded-xl text-amber-800 text-sm 
                               font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {quizAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl"
                >
                  <p className="text-sm text-amber-800 font-medium">{quizAnswer}</p>
                </motion.div>
              )}
              {quizAnswer && <NextBtn onClick={next} />}
            </div>
          </SceneCard>
        )

      // -------- SCENE 3: Roast Lucu --------
      case 4:
        return (
          <SceneCard key="s4">
            <div className="text-center space-y-4">
              <p className="text-4xl">🔥</p>
              <h2 className="text-lg font-bold text-amber-700">
                Fakta Tentang Putri Almeyda
              </h2>
              <p className="text-xs text-amber-500 italic mb-2">
                *jangan baper ya, ini bentuk perhatian 😌*
              </p>
              <div className="space-y-3 text-left">
                {[
                  '🤫 Pendiem banget. Kadang aku bingung, ini lagi oke atau lagi ngambek.',
                  '😶 Kalau ngambek? Diem. Gak ngomong. Tapi auranya terasa se-ruangan.',
                  '📱 Chat-nya irit banget. "Iya", "Oh", "Hm". Hemat kuota ya?',
                  '👂 Lebih suka dengerin daripada cerita. Padahal aku pengen denger cerita kamu juga.',
                  '😳 Pemalu, tapi diam-diam perhatian. Peduli lewat tindakan, bukan kata-kata.',
                  '🍕 Ditanya "mau makan apa?" — "apa aja ikut". si paling ngikut dan aura gak enakanya tebel banget.',
                  '🫠 Tipe yang bikin orang mikir "dia peduli gak sih?" — ternyata peduli banget, cuma gak bisa nunjukin.',
                ].map((roast, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.3 }}
                    className="text-sm text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-100"
                  >
                    {roast}
                  </motion.p>
                ))}
              </div>
              <p className="text-xs text-amber-500 pt-2">
                Tapi justru itu semua yang bikin <span className="font-bold text-amber-700">Putri Almeyda</span> gak bisa dilupain 🫠
              </p>
              <NextBtn onClick={next} />
            </div>
          </SceneCard>
        )

      // -------- SCENE 4: Mini Game Tombol Kabur --------
      case 5:
        return (
          <SceneCard key="s5">
            <div className="text-center space-y-3">
              <p className="text-4xl">🎮</p>
              <h2 className="text-lg font-bold text-amber-700">
                Mini Game: Tangkap Hadiahnya!
              </h2>
              <p className="text-sm text-amber-600">
                Hadiahnya nakal nih, coba tangkap kalau bisa~
              </p>
              <RunawayButton
                label="Ambil Hadiah"
                onCaught={() => setGiftCaught(true)}
              />
              {giftCaught && <NextBtn onClick={next} />}
            </div>
          </SceneCard>
        )

      // -------- SCENE 5: Gombalan Coding --------
      case 6:
        return (
          <SceneCard key="s6">
            <div className="text-center space-y-4">
              <p className="text-4xl">💻🫠</p>
              <h2 className="text-lg font-bold text-amber-700">
                Kode Receh buat Putri
              </h2>
              <div className="space-y-3">
                {[
                  { code: 'const putri = "irreplaceable"', desc: 'Kamu itu const — mau di-overwrite juga gak bisa ✋' },
                  { code: 'while(true) { kepikiran(putri); }', desc: 'Infinite loop. Gak ada break-nya. Gak ngerti kenapa 🔁' },
                  { code: 'if (putri.online()) fokus = null', desc: 'Putri online? Konsentrasi auto buyar 📵' },
                  { code: 'try { moveOn() } catch { return kePutriLagi }', desc: 'Mau move on? Runtime error terus 🐛' },
                  { code: '// TODO: berhenti mikirin putri', desc: 'Udah jadi TODO setahun. Status: never resolved 🫠' },
                ].map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.35 }}
                    className="bg-gray-900 rounded-xl p-3 text-left"
                  >
                    <code className="text-green-400 text-xs font-mono">{g.code}</code>
                    <p className="text-amber-400 text-xs mt-1">{g.desc}</p>
                  </motion.div>
                ))}
              </div>
              <NextBtn onClick={next} />
            </div>
          </SceneCard>
        )

      // -------- SCENE 6: Pertanyaan Jokes Interaktif --------
      case 7:
        return (
          <SceneCard key="s7">
            <div className="text-center space-y-4">
              <p className="text-4xl">😂</p>
              <h2 className="text-lg font-bold text-amber-700">
                Quiz Absurd Spesial
              </h2>
              <p className="text-sm text-amber-600">
                Apa persamaan Putri sama notifikasi HP?
              </p>
              <div className="space-y-2">
                {[
                  { text: 'Dua-duanya bikin deg-degan pas muncul 📳', resp: '❌ Salah— tapi kok relate ya 😏' },
                  { text: 'Sama-sama bikin penasaran pas gak muncul 🫠', resp: '⚠️ Putri kalau baca ini pasti cuma diem... tapi dalam hati senyum 😤' },
                  { text: 'Dua-duanya bikin aku buka HP tiap 5 menit 💀', resp: '✅ BENAR! Aku benci betapa akuratnya ini 🏆' },
                  { text: 'Notif bisa di-mute, Putri gak bisa 🔇', resp: '🔥 FACTS. Mau di-mute juga tetep kepikiran 💀' },
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setJokeAnswer(opt.resp)}
                    className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 
                               border border-amber-200 rounded-xl text-amber-800 text-sm 
                               font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              {jokeAnswer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl"
                >
                  <p className="text-sm text-yellow-700 font-medium">{jokeAnswer}</p>
                </motion.div>
              )}
              {jokeAnswer && <NextBtn onClick={next} />}
            </div>
          </SceneCard>
        )

      // -------- SCENE 7: Foto Kenangan --------
      case 8: {
        const photos = [
          { src: '/foto1.jpg', caption: 'Ini muka yang bikin aku susah fokus. Gak nyadar kan? 🫠' },
          { src: '/foto2.jpg', caption: 'Berduaan gini aja udah bikin hari aku lebih baik 😊' },
          { src: '/foto3.jpg', caption: 'semoga bisa nyelip ada "akunya" di antara foto keluarga ini🌸' },
        ]
        const photo = photos[photoIdx]
        const allSeen = photoIdx >= photos.length - 1
        return (
          <SceneCard key="s8">
            <div className="text-center space-y-4">
              <p className="text-4xl">📸</p>
              <h2 className="text-lg font-bold text-amber-700">
                Galeri (yang Putri gak tau aku bakal simpan terus) 📂
              </h2>
              <motion.div
                key={photoIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <img
                  src={photo.src}
                  alt={`Kenangan ${photoIdx + 1}`}
                  className="w-full h-56 object-cover rounded-2xl border-4 border-amber-200 shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'flex'
                  }}
                />
                <div
                  className="hidden w-full h-56 bg-gradient-to-br from-amber-100 to-amber-100 
                              rounded-2xl border-4 border-amber-200 shadow-md items-center justify-center"
                >
                  <p className="text-amber-500 text-sm">📷 Taruh foto di /public/foto{photoIdx + 1}.jpg</p>
                </div>
                <p className="mt-2 text-sm text-amber-600 italic">{photo.caption}</p>
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
                <button
                  onClick={() => setPhotoIdx((p) => p + 1)}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700 
                             text-white rounded-2xl font-semibold shadow-md hover:shadow-lg 
                             hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Foto berikutnya ({photoIdx + 1}/{photos.length}) →
                </button>
              ) : (
                <NextBtn onClick={next} label="Udah semua, lanjut →" />
              )}
            </div>
          </SceneCard>
        )
      }

      // -------- SCENE 8: Hangat Personal --------
      case 9:
        return (
          <SceneCard key="s9">
            <div className="text-center space-y-4">
              <p className="text-5xl animate-float">🫂</p>
              <h2 className="text-xl font-bold text-amber-700 font-[Dancing_Script]">
                Hei, Putri.
              </h2>
              <div className="text-sm text-amber-800 leading-relaxed space-y-3 text-left">
                <p>
                  Aku tau kamu orangnya pendiem. Gak banyak cerita.
                  Lebih sering dengerin daripada ngomong.
                </p>
                <p>
                  Tapi justru itu yang bikin aku ngerasa... kamu beda.
                  Kamu tipe yang peduli lewat hal kecil, yang gak perlu bilang apa-apa
                  tapi kehadirannya kerasa.
                </p>
                <p>
                  Kamu mungkin gak sadar, tapi orang kayak kamu itu <span className="font-bold text-amber-800">langka</span>.
                  Yang diem, tapi bikin orang di sekitarnya ngerasa aman.
                </p>
                <p className="text-amber-800 font-semibold text-center text-base">
                  Kamu penting. Kamu berarti. Lebih dari yang kamu tau. 🤍
                </p>
              </div>
              <NextBtn onClick={next} />
            </div>
          </SceneCard>
        )

      // -------- SCENE 9: Emosional - Bertambah Umur --------
      case 10:
        return (
          <SceneCard key="s10">
            <div className="text-center space-y-4">
              <p className="text-5xl">🕰️</p>
              <h2 className="text-lg font-bold text-amber-700">
                Soal Bertambah Umur...
              </h2>
              <div className="text-sm text-amber-800 leading-relaxed space-y-3 text-left">
                <p>
                  Aku tau bertambah umur itu kadang bikin mikir banyak.
                  Tanggung jawab nambah, ekspektasi orang makin tinggi,
                  dan waktu rasanya makin gak bisa dipelanin.
                </p>
                <p>
                  Tapi coba deh lihat ke belakang sebentar.
                  Semua yang udah kamu lewatin — yang berat, yang bikin nangis,
                  yang bikin kamu hampir nyerah — kamu berhasil melewatinya.
                  Semua. Tanpa terkecuali.
                </p>
                <p>
                  Setiap luka yang pelan-pelan sembuh,
                  setiap malam yang akhirnya berubah jadi pagi,
                  setiap senyum yang awalnya dipaksain tapi lama-lama jadi tulus —
                  itu semua bukti bahwa kamu jauh lebih kuat dari yang kamu akui.
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-amber-800 font-semibold text-center"
                >
                  Jadi gak perlu takut tumbuh. Aku percaya sama kamu. 🤍
                </motion.p>
              </div>
              <NextBtn onClick={next} />
            </div>
          </SceneCard>
        )

      // -------- SCENE 10: Jujur Halus --------
      case 11:
        return (
          <SceneCard key="s11">
            <div className="text-center space-y-4">
              <motion.p
                className="text-5xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🫠
              </motion.p>
              <h2 className="text-xl font-bold text-amber-700 font-[Dancing_Script]">
                Ini agak jujur. Maaf.
              </h2>
              <div className="text-sm text-amber-800 leading-relaxed space-y-3">
                <p>
                  Aku gak tau harus bilang ini kapan, jadi ya sekarang aja.
                </p>
                <p>
                  Kamu itu pendiem. Jarang cerita. Suka diem kalau lagi ngerasa sesuatu.
                  Dan jujur, kadang aku bingung — kamu lagi oke atau lagi ngambek.
                </p>
                <p>
                  Tapi anehnya, justru karena kamu kayak gitu,
                  aku malah jadi lebih pengen ngerti kamu.
                  Kamu bikin aku peduli lebih dari yang aku rencanain,
                  dan kehadiran kamu itu bikin hal-hal yang biasa
                  jadi <span className="font-bold text-amber-800">terasa beda</span>.
                </p>
                <p className="text-base text-amber-800 font-semibold">
                  "Kamu itu ketenangan yang gak aku cari,
                  <br />
                  tapi ternyata aku butuhkan." 🫠
                </p>
              </div>
              <NextBtn onClick={next} />
            </div>
          </SceneCard>
        )

      // -------- SCENE 11: Voice Message --------
      case 12:
        return (
          <SceneCard key="s12">
            <div className="text-center space-y-5">
              <motion.p
                className="text-5xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                🎧
              </motion.p>
              <h2 className="text-xl font-bold text-amber-700 font-[Dancing_Script]">
                Voice Note Rahasia
              </h2>
              <p className="text-sm text-amber-600">
                Ada sesuatu yang gak bisa diketik. Jadi aku rekamlah. Dengerin ya.
              </p>
              <audio ref={audioRef} src="/voice.mp3" preload="auto" />
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.paused
                      ? audioRef.current.play()
                      : audioRef.current.pause()
                  }
                }}
                className="mx-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                           from-amber-500 to-amber-700 text-white rounded-full font-semibold 
                           shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 
                           transition-all cursor-pointer"
              >
                <span className="text-xl">▶️</span> Putar Pesan Rahasia
              </button>
              <p className="text-xs text-amber-500 italic">
                *Taruh file voice.mp3 di folder /public*
              </p>
              <NextBtn onClick={next} />
            </div>
          </SceneCard>
        )

      // -------- SCENE 12: Ucapan Ulang Tahun --------
      case 13:
        return (
          <SceneCard key="s13">
            <div className="text-center space-y-4">
              <motion.p
                className="text-6xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                🎂
              </motion.p>
              <h2 className="text-2xl font-bold text-amber-800 font-[Dancing_Script]">
                Happy Birthday, Putri
              </h2>
              <h3 className="text-xl font-bold text-amber-700">
                Putri Almeyda 🎉
              </h3>
              <div className="text-sm text-amber-800 leading-relaxed space-y-2">
                <p>
                  Di umur yang baru ini, aku doain kamu dapet kebahagiaan
                  yang bahkan kamu sendiri gak nyangka bakal dateng.
                </p>
                <p>
                  Semua mimpi yang kamu simpen diam-diam,
                  yang gak pernah kamu ceritain ke siapapun —
                  semoga satu per satu mulai jadi nyata.
                </p>
                <p>
                  Semoga hati kamu tenang, langkah kamu dijaga,
                  dan kamu dikelilingi orang-orang yang beneran tulus.
                </p>
                <p className="text-xs text-amber-500 italic">
                  (termasuk aku. yang diem-diem aja. tapi tulus. percaya deh. 🫠)
                </p>
              </div>
              <div className="flex justify-center gap-2 text-2xl py-2">
                {['🎈', '🎁', '🎊', '🎀', '🎉'].map((e, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
              <NextBtn onClick={next} label="Terakhir... 🤲" />
            </div>
          </SceneCard>
        )

      // -------- SCENE 13: Ending Doa + Confetti --------
      case 14:
        return (
          <SceneCard key="s14">
            <div className="text-center space-y-5">
              <motion.p
                className="text-5xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                🤲
              </motion.p>
              <h2 className="text-xl font-bold text-amber-800 font-[Dancing_Script]">
                Doa buat Putri Almeyda
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900 leading-relaxed space-y-3">
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
                <p className="font-bold text-amber-800">
                  Aamiin Ya Rabbal 'Aalamiin 🤍
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
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
            </div>
          </SceneCard>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-orange-50 via-amber-50 to-stone-100 
                    flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background hearts */}
      <FloatingHearts />

      {/* Progress bar */}
      <ProgressBar current={scene} total={TOTAL_SCENES} />

      {/* Scene content */}
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
    </div>
  )
}
