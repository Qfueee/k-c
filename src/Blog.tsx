import { useEffect, useState } from 'react'

type Post = { id: string; title: string; category: string; body: string; image: string; author: string; date: string }

const CATS = ['Cultivos', 'Fertilización', 'Mercado', 'Novedades']
const KEY = 'kc-posts'

const seed: Post[] = [
  { id: 's1', title: 'Cómo aplicar urea al voleo sin perder nitrógeno', category: 'Fertilización', author: 'Equipo técnico K&C', date: '2026-09-28', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&h=600&fit=crop&auto=format',
    body: 'La urea pierde nitrógeno por volatilización cuando se deja sobre el suelo seco y caliente. Aplícala antes de un riego o una lluvia ligera, o incorpórala en los primeros días.\n\nFracciona la dosis en dos o tres momentos del cultivo: siembra, macollaje y panojamiento en arroz, por ejemplo. Así la planta aprovecha mejor cada kilo.' },
  { id: 's2', title: 'Maíz amarillo: etapas clave para abonar con nitrógeno', category: 'Cultivos', author: 'Equipo técnico K&C', date: '2026-09-12', image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=900&h=600&fit=crop&auto=format',
    body: 'El maíz absorbe la mayor parte del nitrógeno entre V6 y la floración. Una primera aplicación al inicio y una segunda hacia V8-V10 suele dar el mejor rendimiento por hectárea.\n\nSi tienes dudas sobre tu dosis, escríbenos por WhatsApp con tu análisis de suelo.' },
  { id: 's3', title: 'Llegó nuevo lote de urea granulada importada', category: 'Novedades', author: 'K&C EXPANDER SAC.', date: '2026-08-30', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&h=600&fit=crop&auto=format',
    body: 'Ya contamos con stock disponible en sacos de 50 kg y big bags de 1 TM para la próxima campaña. Coordina tu despacho con anticipación y asegura precio.' },
]

const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '') as Post[] } catch { return seed }
  })
  const [cat, setCat] = useState('Todas')
  const [open, setOpen] = useState<Post | null>(null)
  const [writing, setWriting] = useState(false)
  const [f, setF] = useState({ title: '', category: CATS[0], body: '', image: '', author: '' })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(posts)) }, [posts])
  useEffect(() => { document.body.style.overflow = open || writing ? 'hidden' : '' }, [open, writing])

  const shown = cat === 'Todas' ? posts : posts.filter(p => p.category === cat)
  const field = 'w-full rounded-xl border-2 border-forest/15 dark:border-lime/25 bg-transparent px-3.5 py-2.5 sm:px-4 sm:py-3 text-base focus:outline-none focus:border-leaf text-soil'

  const publish = (e: React.FormEvent) => {
    e.preventDefault()
    const p: Post = { id: crypto.randomUUID(), ...f, author: f.author.trim() || 'K&C EXPANDER SAC.', date: new Date().toISOString().slice(0, 10) }
    setPosts([p, ...posts])
    setF({ title: '', category: CATS[0], body: '', image: '', author: '' })
    setWriting(false)
    setCat('Todas')
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-20 sm:pb-24 min-h-[80vh]">
      {/* Mobile back link */}
      <a href="#" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-leaf hover:underline mb-3">
        <span>←</span> Volver a la página principal
      </a>

      <p className="font-bold text-leaf tracking-widest text-xs sm:text-sm">BLOG TÉCNICO K&C</p>
      <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl leading-[1.05] mt-1.5">Notas del campo.</h1>
      <p className="mt-3 max-w-xl text-soil/80 text-sm sm:text-base leading-relaxed">
        Consejos agronómicos sobre fertilización con urea, recomendaciones para tus cultivos y novedades del mercado agrícola.
      </p>

      <div className="mt-5 sm:mt-6">
        <button
          onClick={() => setWriting(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-urea text-white font-black text-sm px-6 py-3.5 shadow-md active:scale-95 hover:brightness-105 transition"
        >
          <span>✍️</span> Nueva publicación
        </button>
      </div>

      {/* Categories chips (Touch scrollable) */}
      <div className="mt-6 flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 touch-pan-x snap-x scroll-smooth">
        {['Todas', ...CATS].map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={c === cat}
            className={`shrink-0 snap-center rounded-full px-4 py-2 font-black text-xs sm:text-sm border-2 transition active:scale-95 ${c === cat ? 'bg-forest text-paper border-forest dark:bg-lime dark:text-forest dark:border-lime shadow-sm' : 'border-forest/20 dark:border-lime/30 text-soil hover:border-leaf'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="mt-12 text-center py-12 px-4 rounded-3xl bg-forest/5 dark:bg-white/5 border border-forest/10">
          <p className="text-4xl mb-3">🌾</p>
          <p className="font-black text-lg">Aún no hay publicaciones en esta categoría</p>
          <p className="text-xs text-soil/60 mt-1">Sé el primero en compartir una experiencia agronómica.</p>
        </div>
      )}

      {/* Responsive Posts Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {shown.map((p, i) => (
          <article key={p.id} className="rise group rounded-2xl sm:rounded-[1.75rem] overflow-hidden bg-white dark:bg-white/10 shadow-sm hover:shadow-md border border-forest/10 dark:border-white/10 flex flex-col active:scale-[0.99] transition duration-200" style={{ animationDelay: `${i * 60}ms` }}>
            <button onClick={() => setOpen(p)} className="text-left flex flex-col flex-1 w-full focus:outline-none">
              <div className="aspect-[16/10] sm:aspect-[3/2] bg-lime/40 overflow-hidden relative">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={e => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <div className="w-full h-full grid place-items-center text-5xl">🌱</div>
                )}
                <span className="absolute top-3 left-3 rounded-full bg-cream/90 dark:bg-black/80 backdrop-blur-sm text-forest dark:text-lime text-[11px] font-black px-2.5 py-1 shadow-sm">
                  {p.category}
                </span>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <h2 className="font-display font-extrabold text-lg sm:text-xl leading-snug text-soil group-hover:text-leaf transition">
                  {p.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-soil/75 line-clamp-3 leading-relaxed">
                  {p.body}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between text-[11px] sm:text-xs font-bold text-soil/55 border-t border-forest/5 dark:border-white/5">
                  <span className="truncate max-w-[180px]">{p.author}</span>
                  <span>{fmt(p.date)}</span>
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>

      {/* Post Detail Bottom-Sheet / Modal */}
      {open && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setOpen(null)}>
          <div className="rise bg-cream dark:bg-[#0e1a12] text-soil w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl relative flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Mobile drag handle */}
            <div className="w-12 h-1 bg-soil/25 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

            {/* Sticky Header with Close Button */}
            <div className="sticky top-0 z-10 bg-cream/95 dark:bg-[#0e1a12]/95 backdrop-blur px-4 sm:px-6 py-3 border-b border-forest/10 dark:border-white/10 flex items-center justify-between">
              <span className="rounded-full bg-lime/60 dark:bg-lime/20 text-forest dark:text-lime text-xs font-black px-3 py-1">
                {open.category}
              </span>
              <button
                onClick={() => setOpen(null)}
                aria-label="Cerrar modal"
                className="w-8 h-8 rounded-full bg-forest/10 dark:bg-white/10 hover:bg-forest/20 grid place-items-center font-black text-sm active:scale-95 transition"
              >
                ✕
              </button>
            </div>

            {open.image && (
              <img src={open.image} alt={open.title} className="w-full aspect-[16/9] sm:aspect-[2/1] object-cover shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />
            )}

            <div className="p-4 sm:p-6 space-y-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight text-soil">
                {open.title}
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-soil/60">
                <span>Por {open.author}</span>
                <span>•</span>
                <span>{fmt(open.date)}</span>
              </div>
              <div className="space-y-3 leading-relaxed text-sm sm:text-base text-soil/85 border-t border-forest/10 dark:border-white/10 pt-4">
                {open.body.split('\n').filter(Boolean).map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setOpen(null)}
                  className="flex-1 rounded-full bg-leaf text-white font-black text-sm py-3.5 shadow-md active:scale-95 hover:bg-forest transition"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar esta publicación?')) {
                      setPosts(posts.filter(p => p.id !== open.id))
                      setOpen(null)
                    }
                  }}
                  className="rounded-full border-2 border-urea text-urea font-black text-sm px-5 py-3.5 active:scale-95 hover:bg-urea hover:text-white transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal Form */}
      {writing && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setWriting(false)}>
          <form
            onSubmit={publish}
            className="rise bg-cream dark:bg-[#0e1a12] text-soil w-full sm:max-w-xl max-h-[94dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl relative flex flex-col p-4 sm:p-6 space-y-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="w-12 h-1 bg-soil/25 rounded-full mx-auto -mt-1 sm:hidden shrink-0" />

            <div className="flex items-center justify-between pb-2 border-b border-forest/10 dark:border-white/10">
              <h2 className="font-display font-black text-2xl sm:text-3xl">Nueva publicación</h2>
              <button
                type="button"
                onClick={() => setWriting(false)}
                aria-label="Cerrar modal"
                className="w-8 h-8 rounded-full bg-forest/10 dark:bg-white/10 grid place-items-center font-black text-sm active:scale-95 transition"
              >
                ✕
              </button>
            </div>

            <label className="block text-xs sm:text-sm font-bold">
              Título
              <input
                required
                maxLength={120}
                value={f.title}
                onChange={e => setF({ ...f, title: e.target.value })}
                className={field + ' mt-1 font-normal'}
                placeholder="Ej. Dosis de urea recomendada para maíz"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-xs sm:text-sm font-bold">
                Categoría
                <select
                  value={f.category}
                  onChange={e => setF({ ...f, category: e.target.value })}
                  className={field + ' mt-1 font-normal bg-cream dark:bg-[#0e1a12]'}
                >
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <label className="block text-xs sm:text-sm font-bold">
                Autor
                <input
                  maxLength={40}
                  value={f.author}
                  onChange={e => setF({ ...f, author: e.target.value })}
                  className={field + ' mt-1 font-normal'}
                  placeholder="Tu nombre o empresa"
                />
              </label>
            </div>

            <label className="block text-xs sm:text-sm font-bold">
              Contenido
              <textarea
                required
                rows={5}
                value={f.body}
                onChange={e => setF({ ...f, body: e.target.value })}
                className={field + ' mt-1 font-normal resize-y'}
                placeholder="Escribe tus consejos o experiencia con el fertilizante. Separa párrafos con Enter."
              />
            </label>

            <label className="block text-xs sm:text-sm font-bold">
              Imagen (enlace opcional)
              <input
                type="url"
                value={f.image}
                onChange={e => setF({ ...f, image: e.target.value })}
                className={field + ' mt-1 font-normal'}
                placeholder="https://ejemplo.com/foto.jpg"
              />
            </label>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWriting(false)}
                className="w-full sm:w-auto rounded-full border-2 border-forest/30 dark:border-lime/40 font-black text-sm px-6 py-3.5 active:scale-95 transition text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-urea text-white font-black text-sm py-3.5 shadow-md active:scale-95 hover:brightness-105 transition"
              >
                Publicar en el Blog
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

