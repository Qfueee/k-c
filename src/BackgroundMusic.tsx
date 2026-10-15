import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export interface Track {
  id: string
  title: string
  description: string
  artist: string
  file: string
}

export const TRACKS: Track[] = [
  {
    id: 'carefree',
    title: 'Amanecer en el Campo',
    description: 'Acústico alegre · Ukelele y marimba para cultivos en crecimiento',
    artist: 'Kevin MacLeod (Carefree)',
    file: 'audio/carefree.mp3',
  },
  {
    id: 'life-of-riley',
    title: 'Cosecha Fértil',
    description: 'Folk campestre · Ritmo alegre y optimista de la agricultura',
    artist: 'Kevin MacLeod (Life of Riley)',
    file: 'audio/life-of-riley.mp3',
  },
]

interface MusicContextType {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTrackIndex: number
  currentTrack: Track
  togglePlay: () => void
  toggleMute: () => void
  setVolume: (vol: number) => void
  setTrackIndex: (index: number) => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const MusicContext = createContext<MusicContextType | null>(null)

export function useBackgroundMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) {
    throw new Error('useBackgroundMusic must be used within a BackgroundMusicProvider')
  }
  return ctx
}

export function BackgroundMusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Track selection
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(() => {
    const saved = localStorage.getItem('kc_music_track')
    if (saved !== null) {
      const idx = parseInt(saved, 10)
      if (!isNaN(idx) && idx >= 0 && idx < TRACKS.length) return idx
    }
    return 0
  })

  // Volume (0 to 1, default 0.35)
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('kc_music_volume')
    if (saved !== null) {
      const v = parseFloat(saved)
      if (!isNaN(v) && v >= 0 && v <= 1) return v
    }
    return 0.35
  })

  // Whether user explicitly disabled music
  const [userDisabled, setUserDisabled] = useState<boolean>(() => {
    return localStorage.getItem('kc_music_disabled') === 'true'
  })

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const currentTrack = TRACKS[currentTrackIndex]

  // Resolve base URL for audio asset
  const getAssetUrl = (relativeFile: string) => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
    return `${base}/${relativeFile.replace(/^\//, '')}`
  }

  // Update audio element volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Track change
  useEffect(() => {
    if (!audioRef.current) return
    const wasPlaying = isPlaying
    audioRef.current.src = getAssetUrl(currentTrack.file)
    audioRef.current.load()
    if (wasPlaying && !userDisabled) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    }
    localStorage.setItem('kc_music_track', currentTrackIndex.toString())
  }, [currentTrackIndex])

  // Attempt to play with smooth fade-in
  const playAudio = () => {
    if (!audioRef.current) return
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true)
        setUserDisabled(false)
        localStorage.setItem('kc_music_disabled', 'false')
      })
      .catch((err) => {
        console.warn('Autoplay waiting for user gesture:', err)
        setIsPlaying(false)
      })
  }

  // Pause audio
  const pauseAudio = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setIsPlaying(false)
    setUserDisabled(true)
    localStorage.setItem('kc_music_disabled', 'true')
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val))
    setVolumeState(clamped)
    localStorage.setItem('kc_music_volume', clamped.toString())
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
    if (isMuted && clamped > 0) {
      setIsMuted(false)
    }
  }

  const setTrackIndex = (idx: number) => {
    if (idx >= 0 && idx < TRACKS.length) {
      setCurrentTrackIndex(idx)
    }
  }

  // Set up audio autoplay on first interaction
  useEffect(() => {
    const disabledPreviously = localStorage.getItem('kc_music_disabled') === 'true'

    if (!disabledPreviously) {
      const handleFirstInteraction = () => {
        if (!audioRef.current) return
        const disabledNow = localStorage.getItem('kc_music_disabled') === 'true'
        if (!disabledNow && audioRef.current.paused) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch(() => {})
        }
        cleanupListeners()
      }

      const cleanupListeners = () => {
        window.removeEventListener('click', handleFirstInteraction)
        window.removeEventListener('touchstart', handleFirstInteraction)
        window.removeEventListener('keydown', handleFirstInteraction)
      }

      window.addEventListener('click', handleFirstInteraction, { passive: true })
      window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
      window.addEventListener('keydown', handleFirstInteraction, { passive: true })

      return () => {
        cleanupListeners()
      }
    }
  }, [])

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTrackIndex,
        currentTrack,
        togglePlay,
        toggleMute,
        setVolume,
        setTrackIndex,
        audioRef,
      }}
    >
      <audio
        ref={(el) => {
          audioRef.current = el
          if (el) {
            el.volume = isMuted ? 0 : volume
          }
        }}
        src={getAssetUrl(currentTrack.file)}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
      {children}
    </MusicContext.Provider>
  )
}

/**
 * Animated Equalizer Bars Indicator
 */
export function EqualizerBars({ isPlaying, className = '' }: { isPlaying: boolean; className?: string }) {
  return (
    <div className={`flex items-end justify-center gap-0.5 h-4 w-4 ${className}`} aria-hidden="true">
      <span className={`w-0.5 bg-current rounded-full transition-all duration-300 ${isPlaying ? 'animate-eq-1' : 'h-1'}`} />
      <span className={`w-0.5 bg-current rounded-full transition-all duration-300 ${isPlaying ? 'animate-eq-2' : 'h-2'}`} />
      <span className={`w-0.5 bg-current rounded-full transition-all duration-300 ${isPlaying ? 'animate-eq-3' : 'h-1.5'}`} />
      <span className={`w-0.5 bg-current rounded-full transition-all duration-300 ${isPlaying ? 'animate-eq-4' : 'h-1'}`} />
    </div>
  )
}

/**
 * Header Music Toggle Button
 * Clean, tactile button placed right next to the dark-mode toggle in the sticky navbar.
 */
export function HeaderMusicToggle() {
  const { isPlaying, togglePlay, currentTrack } = useBackgroundMusic()

  return (
    <button
      onClick={togglePlay}
      aria-label={isPlaying ? 'Apagar música de fondo' : 'Reproducir música de fondo'}
      title={
        isPlaying
          ? `Música de fondo activa: "${currentTrack.title}". Haz clic para apagar.`
          : 'Música de fondo apagada. Haz clic para encender música alegre.'
      }
      className={`relative group w-9 h-9 sm:w-10 sm:h-10 rounded-full border grid place-items-center transition active:scale-95 ${
        isPlaying
          ? 'border-leaf/50 dark:border-lime/50 bg-lime/20 dark:bg-lime/15 text-forest dark:text-lime shadow-sm'
          : 'border-forest/20 dark:border-lime/40 text-soil/60 dark:text-soil/70 hover:bg-forest/5 dark:hover:bg-white/5'
      }`}
    >
      {isPlaying ? (
        <div className="flex items-center justify-center">
          <EqualizerBars isPlaying={true} className="text-leaf dark:text-lime" />
        </div>
      ) : (
        <span className="text-sm sm:text-base leading-none" role="img" aria-label="Música apagada">
          🔇
        </span>
      )}

      {/* Subtle indicator dot when playing */}
      {isPlaying && (
        <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-leaf ring-2 ring-cream dark:ring-[#0e1a12] animate-pulse" />
      )}
    </button>
  )
}

/**
 * Mobile Drawer Menu Music Toggle
 * Large friendly button integrated into the mobile slide-out drawer menu.
 */
export function MobileDrawerMusicToggle() {
  const { isPlaying, togglePlay, currentTrack } = useBackgroundMusic()

  return (
    <div className="p-3 rounded-2xl bg-forest/5 dark:bg-white/5 border border-forest/10 dark:border-white/10 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${
            isPlaying ? 'bg-leaf text-white' : 'bg-soil/15 text-soil'
          }`}
        >
          {isPlaying ? <EqualizerBars isPlaying={true} className="text-white" /> : <span>🔇</span>}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black truncate">{isPlaying ? currentTrack.title : 'Música en pausa'}</p>
          <p className="text-[10px] text-soil/60 dark:text-paper/60 truncate">Música de fondo para el agro</p>
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlay}
        className={`px-3 py-1.5 rounded-xl font-black text-xs shrink-0 transition active:scale-95 ${
          isPlaying
            ? 'bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 border border-red-500/30'
            : 'bg-leaf text-white hover:bg-forest shadow-sm'
        }`}
      >
        {isPlaying ? 'Apagar' : 'Encender'}
      </button>
    </div>
  )
}

/**
 * Floating Music Widget
 * Positioned at bottom-left (opposite to WhatsApp button at bottom-right).
 * Shows track name, lively visualizer, and a quick "Apagar / Encender" button + volume/track controls.
 */
export function FloatingMusicWidget() {
  const { isPlaying, togglePlay, currentTrack, currentTrackIndex, setTrackIndex, volume, setVolume } =
    useBackgroundMusic()
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <aside
      aria-label="Reproductor de música de fondo"
      className="fixed z-40 flex flex-col items-start transition-all"
      style={{
        left: 'max(1rem, env(safe-area-inset-left, 0px))',
        bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
      }}
    >
      {/* Expanded Control Box */}
      {expanded && (
        <div className="mb-2 w-72 sm:w-80 rounded-2xl bg-paper dark:bg-[#0c1810] text-soil dark:text-paper p-4 shadow-2xl border border-forest/15 dark:border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-soil/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">🌾</span>
              <div>
                <p className="text-xs font-black leading-tight text-forest dark:text-lime">Música de Fondo K&C</p>
                <p className="text-[10px] text-soil/60 dark:text-paper/60">Ambiente alegre para el agro</p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-soil/40 dark:text-paper/40 hover:text-soil text-sm p-1"
              aria-label="Cerrar panel"
            >
              ✕
            </button>
          </div>

          {/* Current track selector */}
          <div className="mt-3 space-y-1.5">
            <p className="text-[11px] font-extrabold text-soil/70 dark:text-paper/70 uppercase tracking-wider">
              Pistas disponibles:
            </p>
            {TRACKS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setTrackIndex(idx)}
                className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between ${
                  currentTrackIndex === idx
                    ? 'bg-leaf/15 text-forest dark:text-lime font-black border border-leaf/30'
                    : 'hover:bg-soil/5 dark:hover:bg-white/5 font-semibold text-soil/80 dark:text-paper/80'
                }`}
              >
                <div className="truncate mr-2">
                  <p className="truncate">{t.title}</p>
                  <p className="text-[10px] opacity-70 truncate">{t.description}</p>
                </div>
                {currentTrackIndex === idx && isPlaying && (
                  <EqualizerBars isPlaying={true} className="text-leaf dark:text-lime shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="mt-3 pt-3 border-t border-soil/10 dark:border-white/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-soil/70 dark:text-paper/70 mb-1">
              <span>Volumen</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume === 0 ? 0.35 : 0)}
                className="text-xs p-1 hover:opacity-70"
                aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
              >
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#3f9f55] cursor-pointer h-1.5 bg-soil/20 dark:bg-white/20 rounded-lg"
              />
            </div>
          </div>

          {/* Master Turn Off / Turn On button */}
          <div className="mt-3 pt-2">
            <button
              onClick={togglePlay}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-sm ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-leaf hover:bg-forest text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <span>⏹</span>
                  <span>Apagar música de fondo</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>Encender música alegre</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <div className="flex items-center gap-1.5 bg-paper/95 dark:bg-[#0e1a12]/95 backdrop-blur-md rounded-full shadow-[0_8px_24px_-4px_rgba(20,69,42,0.25)] border border-forest/15 dark:border-white/15 p-1.5 pl-2.5 transition-all">
        {/* Equalizer / Speaker button (opens panel) */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 cursor-pointer pr-1 group"
          title="Configurar música de fondo (pistas y volumen)"
          aria-expanded={expanded}
        >
          <div
            className={`w-7 h-7 rounded-full grid place-items-center transition ${
              isPlaying
                ? 'bg-leaf/20 dark:bg-lime/20 text-leaf dark:text-lime'
                : 'bg-soil/10 dark:bg-white/10 text-soil/60'
            }`}
          >
            {isPlaying ? (
              <EqualizerBars isPlaying={true} className="text-leaf dark:text-lime" />
            ) : (
              <span className="text-xs">🔇</span>
            )}
          </div>
          <div className="hidden sm:block text-left max-w-[130px]">
            <p className="text-[11px] font-black leading-tight text-forest dark:text-lime truncate">
              {isPlaying ? currentTrack.title : 'Música apagada'}
            </p>
            <p className="text-[9px] font-bold text-soil/60 dark:text-paper/60 uppercase tracking-wider">
              {isPlaying ? 'Reproduciendo' : 'Toca encender'}
            </p>
          </div>
        </button>

        {/* Dedicated APAGAR / ENCENDER button as requested by user */}
        <button
          onClick={togglePlay}
          className={`font-black text-xs px-3 py-1.5 rounded-full transition active:scale-90 flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-soil/10 hover:bg-red-500 hover:text-white dark:bg-white/10 dark:hover:bg-red-500 text-soil dark:text-paper border border-forest/10 dark:border-white/10'
              : 'bg-leaf text-white hover:bg-forest shadow-sm'
          }`}
          title={isPlaying ? 'Haz clic para apagar la música' : 'Haz clic para encender la música'}
        >
          {isPlaying ? (
            <>
              <span className="w-2 h-2 rounded-sm bg-red-500" />
              <span>Apagar</span>
            </>
          ) : (
            <>
              <span className="text-[10px]">▶</span>
              <span>Encender</span>
            </>
          )}
        </button>

        {/* Quick expand/settings button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-7 h-7 rounded-full grid place-items-center text-xs text-soil/60 hover:text-forest dark:text-paper/60 hover:bg-soil/5 dark:hover:bg-white/5 transition"
          aria-label="Ajustes de música"
          title="Ajustes de música"
        >
          {expanded ? '▾' : '⚙️'}
        </button>
      </div>
    </aside>
  )
}
