import { useEffect, useState } from 'react'
import Blog from './Blog'
import logoSrc from './assets/logo.png'

const WA_NUMBER = '51999999999'
const waLink = (msg: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

let cached: string | null = null
function useLogo() {
  const [url, setUrl] = useState<string | null>(cached)
  useEffect(() => {
    if (cached) return
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = 425
      const x = c.getContext('2d')!
      x.drawImage(img, 0, 0)
      const d = x.getImageData(0, 0, c.width, c.height)
      const bg = [d.data[(5 * c.width + 5) * 4], d.data[(5 * c.width + 5) * 4 + 1], d.data[(5 * c.width + 5) * 4 + 2]]
      for (let i = 0; i < d.data.length; i += 4) {
        const m = Math.max(Math.abs(d.data[i] - bg[0]), Math.abs(d.data[i + 1] - bg[1]), Math.abs(d.data[i + 2] - bg[2]))
        d.data[i + 3] = Math.min(255, Math.max(0, Math.round(((m - 6) * 255) / 50)))
      }
      x.putImageData(d, 0, 0)
      cached = c.toDataURL()
      setUrl(cached)
    }
    img.src = logoSrc
  }, [])
  return url
}

function Plant({ className = '', animate = false }: { className?: string; animate?: boolean }) {
  const url = useLogo()
  if (!url) return <div className={className} style={{ aspectRatio: '946/425' }} />
  return <img src={url} alt="K&C EXPANDER SAC." className={`${className} ${animate ? 'grow-logo' : ''}`} style={{ aspectRatio: '946/425' }} />
}

const products = [
  { id: 'granulada', f: '46-0-0', name: 'Urea Granulada', n: 46, tag: 'La favorita del campo', color: '#e0352b', desc: 'Gránulo uniforme y resistente, ideal para aplicación al voleo o con maquinaria. Libera nitrógeno rápido para arrancar el cultivo con fuerza.', crops: ['Arroz', 'Maíz', 'Caña de azúcar', 'Papa'], pack: ['Saco 50 kg', 'Big bag 1 TM'], dose: 250 },
  { id: 'perlada', f: '46-0-0', name: 'Urea Perlada', n: 46, tag: 'Fácil de esparcir', color: '#3f9f55', desc: 'Perla pequeña y lisa que fluye sin apelmazarse. Excelente solubilidad para fertirriego y aplicaciones foliares dirigidas.', crops: ['Palto', 'Arándano', 'Uva', 'Espárrago'], pack: ['Saco 50 kg', 'Big bag 1 TM'], dose: 200 },
  { id: 'premium', f: '46-0-0', name: 'Urea Bajo Biuret', n: 46, tag: 'Cuidado del cultivo', color: '#c9a227', desc: 'Selección con bajo contenido de biuret, pensada para cultivos sensibles y aplicaciones foliares sin riesgo de fitotoxicidad.', crops: ['Cítricos', 'Hortalizas', 'Mango', 'Banano'], pack: ['Saco 25 kg', 'Saco 50 kg'], dose: 150 },
  { id: 'agricola', f: '46-0-0', name: 'Urea Agrícola', n: 46, tag: 'Rendimiento y precio', color: '#1f6f8b', desc: 'La opción económica para grandes extensiones. Mismo 46% de nitrógeno, con despacho por volumen y entregas programadas.', crops: ['Pastos', 'Algodón', 'Trigo', 'Cebada'], pack: ['Saco 50 kg', 'Big bag 1 TM', 'Granel'], dose: 220 },
  { id: 'protegida', f: '46-0-0', name: 'Urea Protegida', n: 46, tag: 'Menos pérdidas', color: '#7b4fa3', desc: 'Con inhibidor de ureasa que reduce la volatilización del nitrógeno. Más nutriente llega a la raíz y menos se pierde al aire.', crops: ['Maíz', 'Arroz', 'Palto', 'Café'], pack: ['Saco 50 kg', 'Big bag 1 TM'], dose: 200 },
  { id: 'azufrada', f: '40-0-0 +5S', name: 'Urea Azufrada', n: 40, tag: 'Nitrógeno + azufre', color: '#e07a1f', desc: 'Combina nitrógeno con 5% de azufre para suelos deficientes. Favorece proteínas y aceites en el cultivo.', crops: ['Soya', 'Cebolla', 'Ajo', 'Quinua'], pack: ['Saco 50 kg', 'Big bag 1 TM'], dose: 240 },
  { id: 'soluble', f: '46-0-0', name: 'Urea Soluble', n: 46, tag: 'Para fertirriego', color: '#0f9d8a', desc: 'Se disuelve rápido y sin residuos, perfecta para riego por goteo y aspersión. Dosificación precisa y uniforme.', crops: ['Arándano', 'Fresa', 'Tomate', 'Vid'], pack: ['Saco 25 kg', 'Saco 50 kg'], dose: 120 },
]

function Bag({ color, name, f, big = false }: { color: string; name: string; f: string; big?: boolean }) {
  return (
    <div className={`relative ${big ? 'w-48 sm:w-60 md:w-64' : 'w-20 sm:w-24'} aspect-[3/4] rounded-2xl sm:rounded-[1.2rem] shadow-[0_18px_30px_-12px_rgba(20,69,42,.5)] overflow-hidden shrink-0`} style={{ background: color }}>
      <div className="absolute inset-x-0 top-0 h-[7%] bg-black/15" />
      <div className="absolute inset-x-[10%] top-[16%] bottom-[10%] rounded-xl bg-paper flex flex-col items-center justify-center text-center p-2">
        <Plant className={big ? 'w-20 sm:w-24' : 'w-8 sm:w-10'} />
        <span className={`font-display font-black leading-none text-urea ${big ? 'text-4xl sm:text-5xl mt-2' : 'text-base sm:text-lg'}`}>UREA</span>
        {big && <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-soil mt-1 px-1 line-clamp-1">{f} · {name.toUpperCase()}</span>}
        {big && <span className="text-[8px] sm:text-[9px] font-bold text-leaf mt-1.5 sm:mt-2">K&C EXPANDER SAC.</span>}
      </div>
    </div>
  )
}

function Catalog() {
  const [sel, setSel] = useState(0)
  const [ha, setHa] = useState(5)
  const p = products[sel]
  const kg = ha * p.dose
  const presets = [1, 5, 10, 20, 50]

  return (
    <section id="catalogo" className="bg-forest text-paper py-12 sm:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <p className="font-bold text-lime tracking-widest text-xs sm:text-sm">CATÁLOGO INTERACTIVO</p>
        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl mt-2 sm:mt-3 max-w-2xl leading-[1.05]">Elige tu urea, mira cómo rinde.</h2>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 sm:gap-8 items-start">
          <div key={p.id} className="rise relative min-w-0 rounded-2xl sm:rounded-[2rem] bg-lime/15 border border-lime/30 pt-12 pb-8 sm:pt-16 sm:pb-10 flex justify-center">
            <div className="floaty"><Bag big color={p.color} name={p.name} f={p.f} /></div>
            <span className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-lime text-forest font-extrabold text-[11px] sm:text-xs rounded-full px-3 py-1 shadow-sm">{p.tag}</span>
          </div>

          <div className="min-w-0">
            {/* Scrollable products list with mobile hint */}
            <div className="flex items-center justify-between text-xs text-paper/70 font-bold mb-2 lg:hidden">
              <span>Desliza para elegir:</span>
              <span className="text-lime">{sel + 1} de {products.length}</span>
            </div>
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto snap-x scroll-smooth pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x" role="tablist">
              {products.map((x, i) => (
                <button key={x.id} role="tab" aria-selected={i === sel} onClick={() => setSel(i)}
                  className={`shrink-0 snap-center rounded-2xl p-2.5 sm:p-3 flex flex-col items-center gap-2 border-2 transition active:scale-95 ${i === sel ? 'bg-paper text-forest border-lime -translate-y-1 shadow-md' : 'border-white/15 hover:border-lime/60'}`}>
                  <Bag color={x.color} name={x.name} f={x.f} />
                  <span className="text-[11px] sm:text-xs font-extrabold text-center max-w-[85px] leading-tight">{x.name.replace('Urea ', '')}</span>
                </button>
              ))}
            </div>

            <div key={p.id + 'i'} className="rise mt-5 sm:mt-6">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl">{p.name}</h3>
              <p className="mt-2 text-paper/85 text-sm sm:text-base leading-relaxed">{p.desc}</p>

              <div className="mt-4 sm:mt-5">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span>Concentración de Nitrógeno (N)</span>
                  <span className="text-lime font-black">{p.n}%</span>
                </div>
                <div className="h-3.5 sm:h-4 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-leaf to-lime transition-all duration-700" style={{ width: `${p.n * 2}%` }} />
                </div>
              </div>

              <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                {p.crops.map(c => <span key={c} className="rounded-full bg-white/10 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold">🌱 {c}</span>)}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
                {p.pack.map(c => <span key={c} className="rounded-full border border-lime/50 text-lime px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-bold">{c}</span>)}
              </div>

              {/* Mobile-optimized calculator card */}
              <div className="mt-6 rounded-2xl sm:rounded-3xl bg-paper text-bark p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-bold text-xs sm:text-sm text-soil" htmlFor="ha">
                    Área a abonar:
                  </label>
                  <div className="flex items-center gap-1.5 bg-forest/5 px-2.5 py-1 rounded-xl">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={ha}
                      onChange={e => setHa(Math.max(1, Math.min(500, +e.target.value || 1)))}
                      className="w-14 text-right font-display font-black text-lg text-forest bg-transparent focus:outline-none"
                    />
                    <span className="font-bold text-xs text-soil/60">ha</span>
                  </div>
                </div>

                {/* Quick preset chips for phone screen */}
                <div className="flex gap-1.5 sm:gap-2 mt-2.5 overflow-x-auto pb-1">
                  {presets.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHa(val)}
                      className={`px-3 py-1 text-xs font-black rounded-lg transition active:scale-95 ${ha === val ? 'bg-forest text-paper shadow-sm' : 'bg-forest/10 hover:bg-forest/15 text-forest'}`}
                    >
                      {val} ha
                    </button>
                  ))}
                </div>

                <input
                  id="ha"
                  type="range"
                  min={1}
                  max={100}
                  value={ha}
                  onChange={e => setHa(+e.target.value)}
                  className="w-full accent-[#3f9f55] mt-3 cursor-pointer h-2 bg-soil/20 rounded-lg"
                />

                <div className="mt-4 pt-4 border-t border-soil/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-soil/60 font-semibold uppercase tracking-wider">Estimado de fertilizante</p>
                    <div className="flex items-baseline gap-2 flex-wrap mt-0.5">
                      <b className="font-display text-2xl sm:text-3xl text-forest">{kg.toLocaleString('es-PE')} kg</b>
                      <span className="text-xs font-bold text-soil/70">(≈ {Math.ceil(kg / 50)} sacos de 50 kg)</span>
                    </div>
                  </div>
                  <a
                    href={waLink(`Hola K&C Expander, quiero cotizar ${p.name} para ${ha} ha (≈ ${kg.toLocaleString('es-PE')} kg).`)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-full bg-urea text-white font-black text-sm px-6 py-3.5 shadow-md active:scale-95 hover:brightness-105 transition"
                  >
                    <WaIcon /> Cotizar por WhatsApp
                  </a>
                </div>
                <p className="text-[11px] text-soil/50 mt-2.5">Dosis referencial de {p.dose} kg/ha. Consulta la dosis exacta según análisis de suelo con nuestro equipo técnico.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const WaIcon = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor"><path d="M16 3a13 13 0 0 0-11 19.8L3 29l6.400-2A13 13 0 1 0 16 3Zm0 23.700a10.700 10.700 0 0 1-5.500-1.500l-.4-.2-3.800 1.200 1.200-3.700-.3-.4A10.700 10.700 0 1 1 16 26.700Zm5.900-8c-.3-.200-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.700 8.700 0 0 1-4.300-3.800c-.3-.600.3-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.3-.6-.5-.5-.7-.5h-.6a1.200 1.200 0 0 0-.9.400 3.700 3.700 0 0 0-1.100 2.700 6.400 6.400 0 0 0 1.300 3.400 14.600 14.600 0 0 0 5.600 4.900c2 .8 2.800.9 3.800.7a3.200 3.200 0 0 0 2.100-1.500 2.600 2.600 0 0 0 .2-1.500c-.1-.100-.3-.200-.6-.4Z" /></svg>
)

export default function App() {
  const [route, setRoute] = useState(location.hash)
  const blog = route.startsWith('#/blog')
  const [splash, setSplash] = useState(!location.hash.startsWith('#/blog'))
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => {
      setRoute(location.hash)
      setMenuOpen(false)
      if (location.hash.startsWith('#/blog') || location.hash === '' || location.hash === '#') scrollTo(0, 0)
    }
    addEventListener('hashchange', h)
    return () => removeEventListener('hashchange', h)
  }, [])

  const [dark, setDark] = useState(() => localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const benefits = [
    { big: '46%', sm: 'de nitrógeno', desc: 'La concentración más alta entre los fertilizantes nitrogenados sólidos.', bg: 'bg-lime/30 dark:bg-lime/20 border border-lime/40 text-forest dark:text-lime' },
    { big: '100%', sm: 'importada', desc: 'Origen seleccionado, con control de calidad en cada lote para máxima pureza.', bg: 'bg-leaf text-white shadow-lg' },
    { big: '24-72h', sm: 'despacho', desc: 'Entregas programadas a tu fundo o almacén, con acompañamiento técnico continuo.', bg: 'bg-white dark:bg-white/10 border border-forest/10 dark:border-white/10 text-soil' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Splash Screen with Skip button and click-to-dismiss */}
      {splash && (
        <div
          className="splash fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center px-6 select-none"
          onClick={() => setSplash(false)}
          onAnimationEnd={e => { if (e.target === e.currentTarget) setSplash(false) }}
        >
          <button
            onClick={e => { e.stopPropagation(); setSplash(false) }}
            className="absolute top-5 right-5 text-xs font-black tracking-wider bg-forest/10 dark:bg-lime/20 text-soil px-3.5 py-1.5 rounded-full hover:bg-forest/20 active:scale-95 transition"
          >
            Saltar ✕
          </button>
          <Plant animate className="w-full max-w-xs sm:max-w-sm" />
          <p className="rise font-black text-2xl sm:text-3xl mt-6 tracking-tight text-center" style={{ animationDelay: '1.2s', fontFamily: 'Arial Black, Arial, sans-serif' }}>
            <span className="text-urea">K&C</span> <span className="text-soil">EXPANDER</span> <span className="text-leaf">SAC.</span>
          </p>
          <p className="text-xs text-soil/50 mt-4 animate-pulse">Toca la pantalla para continuar</p>
        </div>
      )}

      {/* Responsive Header */}
      <header className="sticky top-0 z-40 bg-cream/90 dark:bg-[#0e1a12]/90 backdrop-blur-md border-b border-forest/10 dark:border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 gap-2">
          {/* Logo */}
          <a href="#" onClick={() => { if (blog) setMenuOpen(false) }} className="flex items-center gap-2 font-display font-black text-base sm:text-lg shrink-0">
            <Plant className="w-10 sm:w-12 shrink-0" />
            <span className="tracking-tight whitespace-nowrap"><span className="text-urea">K&C</span> EXPANDER</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 font-bold text-sm">
            <a href="#catalogo" className="hover:text-leaf transition">Catálogo</a>
            <a href="#/blog" className={`hover:text-leaf transition ${blog ? 'text-leaf' : ''}`}>Blog</a>
            <a href="#ventajas" className="hover:text-leaf transition">Ventajas</a>
            <a href="#contacto" className="hover:text-leaf transition">Contacto</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Blog button when on main page, or Home button when on blog */}
            {blog ? (
              <a href="#" className="font-extrabold text-xs sm:text-sm px-2.5 py-1.5 rounded-full bg-forest/10 dark:bg-lime/20 text-leaf">← Inicio</a>
            ) : (
              <a href="#/blog" className="hidden sm:inline-flex font-extrabold text-xs sm:text-sm px-2.5 py-1.5 hover:text-leaf transition">Blog</a>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDark(!dark)}
              aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-forest/20 dark:border-lime/40 grid place-items-center text-base sm:text-lg hover:bg-lime/30 active:scale-95 transition"
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {/* WhatsApp CTA */}
            <a
              href={waLink('Hola K&C Expander, quiero información sobre la urea.')}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-leaf text-white font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 py-2 hover:bg-forest active:scale-95 transition"
            >
              <span>Escríbenos</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú de navegación"
              className="md:hidden w-9 h-9 rounded-full border border-forest/20 dark:border-lime/40 flex flex-col items-center justify-center gap-1 active:scale-95 transition"
            >
              <span className={`block w-4 h-0.5 bg-soil transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-4 h-0.5 bg-soil transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-4 h-0.5 bg-soil transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[53px] sm:top-[61px] bottom-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col" onClick={() => setMenuOpen(false)}>
            <nav
              className="bg-cream dark:bg-[#0e1a12] border-b border-forest/15 dark:border-white/10 px-5 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200"
              onClick={e => e.stopPropagation()}
            >
              <a
                href="#"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl font-black text-base hover:bg-forest/10 dark:hover:bg-white/10 transition"
              >
                <span>🏠</span> Inicio
              </a>
              <a
                href="#catalogo"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl font-black text-base hover:bg-forest/10 dark:hover:bg-white/10 transition"
              >
                <span>📦</span> Catálogo de Urea
              </a>
              <a
                href="#ventajas"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl font-black text-base hover:bg-forest/10 dark:hover:bg-white/10 transition"
              >
                <span>⭐</span> Ventajas y Calidad
              </a>
              <a
                href="#/blog"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl font-black text-base hover:bg-forest/10 dark:hover:bg-white/10 transition ${blog ? 'bg-forest/10 dark:bg-white/10 text-leaf' : ''}`}
              >
                <span>📰</span> Blog y Consejos Técnicos
              </a>
              <a
                href="#contacto"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl font-black text-base hover:bg-forest/10 dark:hover:bg-white/10 transition"
              >
                <span>📞</span> Contacto y Despachos
              </a>

              <div className="pt-3">
                <a
                  href={waLink('Hola K&C Expander, quiero hacer una consulta desde mi celular.')}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#25a244] text-white font-black py-3.5 shadow-md active:scale-95 transition"
                >
                  <WaIcon /> Chatear por WhatsApp
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1">
        {blog ? (
          <Blog />
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 grid lg:grid-cols-[1.3fr_1fr] gap-8 sm:gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/40 dark:bg-lime/20 text-forest dark:text-lime font-black text-[11px] sm:text-xs tracking-widest px-3.5 py-1.5 border border-lime/50">
                  <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                  FERTILIZANTE IMPORTADO
                </span>
                <h1 className="font-display font-black text-[clamp(3.5rem,15vw,9.5rem)] leading-[.85] text-urea mt-3 sm:mt-4 -ml-0.5">
                  UREA
                </h1>
                <p className="font-display font-extrabold text-xl sm:text-3xl lg:text-4xl text-leaf mt-3 sm:mt-4 leading-tight max-w-xl">
                  “Producto de calidad, que ofrece soluciones en la agricultura”
                </p>
                <p className="mt-3 text-soil/75 text-sm sm:text-base max-w-lg leading-relaxed">
                  Importación directa con 46% de nitrógeno garantizado. Abastecimiento oportuno para tus campañas agrícolas en todo el Perú.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href={waLink('Hola K&C Expander, quiero cotizar urea.')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-[#25a244] text-white font-black text-base px-6 sm:px-7 py-3.5 sm:py-4 shadow-lg hover:brightness-105 active:scale-95 transition"
                  >
                    <WaIcon /> Cotiza por WhatsApp
                  </a>
                  <a
                    href="#catalogo"
                    className="w-full sm:w-auto text-center rounded-full border-2 border-forest dark:border-lime text-forest dark:text-lime font-black text-base px-6 sm:px-7 py-3.5 sm:py-4 hover:bg-forest hover:text-paper active:scale-95 transition"
                  >
                    Ver catálogo interactivo
                  </a>
                </div>
              </div>
              <div className="relative flex justify-center order-first lg:order-last py-2 sm:py-6">
                <div className="absolute inset-x-4 sm:inset-x-8 inset-y-2 rounded-[45%_55%_50%_50%] bg-lime/30 dark:bg-lime/15 -z-10" />
                <Plant className="relative w-52 sm:w-80 lg:w-96 sway" />
              </div>
            </section>

            {/* Interactive Catalog */}
            <Catalog />

            {/* Benefits Section */}
            <section id="ventajas" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
              <p className="font-bold text-leaf tracking-widest text-xs sm:text-sm">RESPALDO Y RENDIMIENTO</p>
              <h2 className="font-display font-black text-3xl sm:text-5xl max-w-xl leading-tight mt-2">
                Soluciones que echan raíces.
              </h2>
              <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {benefits.map((b) => (
                  <div key={b.big} className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition hover:-translate-y-1 ${b.bg}`}>
                    <p className="font-display font-black text-5xl sm:text-6xl leading-none">{b.big}</p>
                    <p className="font-extrabold uppercase tracking-wider text-xs sm:text-sm mt-2">{b.sm}</p>
                    <p className="mt-3 text-sm sm:text-base opacity-85 leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Responsive Footer */}
      <footer id="contacto" className="bg-bark text-paper pb-[max(5rem,env(safe-area-inset-bottom))] sm:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <Plant className="w-16 sm:w-20" />
              <p className="font-display font-black text-xl sm:text-2xl">
                <span className="text-urea">K&C</span> EXPANDER <span className="text-lime">SAC.</span>
              </p>
            </div>
            <p className="mt-3 sm:mt-4 text-paper/70 text-sm sm:text-base max-w-sm leading-relaxed">
              Importadores de fertilizante UREA de alta pureza. Producto garantizado que ofrece soluciones integrales para la agricultura peruana.
            </p>
            <div className="mt-4 space-y-1 text-xs text-paper/60">
              <p>📍 Envíos y despachos directos a nivel nacional</p>
              <p>⏱️ Atención técnica de Lunes a Sábado</p>
            </div>
          </div>
          <div>
            <h3 className="font-display font-black text-2xl sm:text-3xl leading-tight">
              ¿Hablamos de tu próxima campaña?
            </h3>
            <p className="mt-2 text-paper/75 text-sm">
              Escríbenos directamente o llámanos para cotizaciones por mayor y pedidos programados.
            </p>
            <a
              href={waLink('Hola K&C Expander, quiero información sobre precios y despachos de urea.')}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25a244] text-white font-extrabold text-sm px-6 py-3.5 shadow-md hover:brightness-105 active:scale-95 transition"
            >
              <WaIcon /> Cotizar por WhatsApp
            </a>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              {[
                ['Facebook', 'https://facebook.com'],
                ['Instagram', 'https://instagram.com'],
                ['TikTok', 'https://tiktok.com'],
                ['LinkedIn', 'https://linkedin.com'],
              ].map(([n, u]) => (
                <a
                  key={n}
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-paper/30 px-3.5 py-1.5 text-xs sm:text-sm font-bold hover:bg-lime hover:text-forest active:scale-95 transition"
                >
                  {n}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-paper/50 px-4">
          © 2026 K&C EXPANDER SAC. Todos los derechos reservados.
        </p>
      </footer>

      {/* Floating WhatsApp Action Button (Safe-area aware) */}
      <a
        href={waLink('Hola K&C Expander, quiero hacer una consulta rápida.')}
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-5 right-4 sm:right-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25a244] text-white grid place-items-center shadow-2xl hover:scale-105 active:scale-90 transition-transform"
        style={{ bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))' }}
      >
        <WaIcon />
      </a>
    </div>
  )
}
