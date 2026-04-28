import { useState } from "react"
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ThumbsUp,
  ThumbsDown,
  Monitor,
  Apple,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Gamepad2,
  Globe,
  Clock,
  Users,
  Award,
  Shield,
  Zap,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const GAME = {
  title: "Crimson Desert",
  subtitle: "PC & Mac (Steam)",
  backgroundImage:
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/library_hero.jpg",
  coverImage:
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/library_600x900.jpg",
  developer: "Pearl Abyss",
  publisher: "Pearl Abyss",
  releaseDate: "18 marzo 2026",
  genres: ["Azione", "Avventura", "RPG", "Open World"],
  rating: "PEGI 18",
  steamReviews: { label: "Molto positiva", count: 88836, score: 88 },
  platforms: ["PC", "Mac"],
  editions: [
    {
      id: "standard-eu",
      name: "Standard Edizione",
      region: "Europe & USA & Canada",
      originalPrice: 70,
      discountedPrice: 49.99,
      discount: 29,
      contents: [
        "Crimson Desert",
        "5 contenuti bonus in-game",
        "Accesso anticipato",
      ],
      badge: "Più venduto",
    },
    {
      id: "standard-latam",
      name: "Standard Edizione",
      region: "Latin America",
      originalPrice: 70,
      discountedPrice: 30.59,
      discount: 56,
      contents: ["Crimson Desert", "5 contenuti bonus in-game"],
      badge: "Miglior prezzo",
    },
    {
      id: "deluxe",
      name: "Deluxe Edizione",
      region: "Global",
      originalPrice: 80,
      discountedPrice: 35.19,
      discount: 56,
      contents: [
        "Crimson Desert",
        "Elmo a piastre di Kairos",
        "Guanti a piastre di Kairos",
        "Stivali a piastre di Kairos",
        "Mantello di Kairos",
        "Armatura a piastre di Kairos",
        "Scudo di Balgran",
        "Testiera di Exclaire",
        "Bardatura di Exclaire",
        "Sella di Exclaire",
        "Staffe di Exclaire",
      ],
      badge: "Deluxe",
    },
  ],
  description: `Nel continente di Pywel, le fazioni rivali di Pailune mantenevano un fragile equilibrio. Al fianco di Kliff combattevano i suoi fedeli compagni Mantogrigio, ma una devastante imboscata nel cuore della notte, orchestrata dai loro giurati nemici, gli Orsi Neri, lascia molti Mantogrigio morti o dispersi per tutto il continente.

Kliff, dopo aver perso i suoi compagni, coloro che considera una famiglia, è determinato a riunire i sopravvissuti e ricostruire la fazione. Ma in un viaggio in cui si stringono alleanze, i pericoli sono ovunque e misteriose fazioni emergono dall'ombra, Kliff incontrerà coloro che cercano di sconvolgere l'ordine stesso del continente e dovrà affrontare una missione diversa da qualsiasi altra abbia mai conosciuto.

Benvenuto a Pywel. Qui troverai paesaggi di straordinaria bellezza naturale e vaste terre selvagge, da verdi pianure, rigogliose foreste, aridi deserti fino a montagne impervie, accanto a città vivaci e tranquilli villaggi. Il tuo viaggio ti porterà inevitabilmente anche verso il cielo, fino al misterioso regno conosciuto come l'Abisso, dove un mistico squilibrio che minaccia il mondo dovrà essere ristabilito.`,
  screenshots: [
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/ss_1.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/ss_2.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/ss_3.jpg",
    "https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/ss_4.jpg",
  ],
  systemRequirements: {
    windows: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Ryzen 5 2600X / i5-8500",
        memory: "16 GB RAM",
        graphics: "RX 5500 XT / GTX 1060",
        directx: "Version 12",
        storage: "150 GB SSD",
      },
      recommended: {
        os: "Windows 11 64-bit",
        processor: "Ryzen 7 5800X / i7-10700K",
        memory: "32 GB RAM",
        graphics: "RX 6800 XT / RTX 3080",
        directx: "Version 12",
        storage: "150 GB NVMe SSD",
      },
    },
    mac: {
      minimum: {
        os: "macOS 15.0 o successivo",
        processor: "Apple M2 Pro, M3, M4",
        memory: "16 GB RAM",
        graphics: "M2 Pro, M3, M4",
        storage: "150 GB",
      },
    },
  },
  features: [
    "Single-player",
    "Supporto controller Xbox",
    "Supporto DualSense",
    "Achievements Steam",
    "Cloud Saves",
    "HDR",
  ],
  reviews: [
    {
      id: 1,
      author: "GiocatoreEpico",
      date: "16 Aprile 2026",
      rating: 9,
      title: "Un capolavoro visivo con profondità",
      text: "Crimson Desert non è semplicemente un gioco. È uno di quei titoli che, quando lo avvii, capisci subito che vuole alzare l'asticella… e lo fa senza chiedere permesso. Graficamente è fuori scala. Ho giocato tutto su preset Cinematic, e la sensazione è quella di essere dentro un mondo vivo, non solo bello da vedere.",
      pros: ["Grafica mozzafiato", "Mondo vivo e dettagliato", "Ottimizzazione eccellente"],
      cons: ["Prime ore lente", "Input lag iniziale (ora risolto)"],
      helpful: 142,
    },
    {
      id: 2,
      author: "Avventuriero_IT",
      date: "25 Aprile 2026",
      rating: 7,
      title: "Diamante grezzo con molto potenziale",
      text: "Gran bel gioco, tanto da fare e volendo ci si perde nell'esplorazione e nelle secondarie. Ogni tanto i comandi sono un po' macchinosi ma ci si abitua facilmente dopo qualche ora di gioco.",
      pros: ["Grafica", "Longevità", "Esplorazione"],
      cons: ["Comandi complessi"],
      helpful: 87,
    },
    {
      id: 3,
      author: "RPGmaster99",
      date: "21 Marzo 2026",
      rating: 10,
      title: "Finalmente un gioco immersivo",
      text: "Finalmente un gioco veramente immersivo, e che non ti prende in braccio. Devo scoprire tutto da solo, solo i comandi sono un po' snervanti ma ci saranno sicuramente aggiornamenti e patch. Grafica e ambientazioni magnifiche!",
      pros: ["Immersività", "Libertà di gioco"],
      cons: ["Curva di apprendimento ripida"],
      helpful: 63,
    },
    {
      id: 4,
      author: "CriticoVideoludico",
      date: "24 Aprile 2026",
      rating: 5,
      title: "Sopravvalutato, ma con ottima grafica",
      text: "Per me vincerà il premio di gioco più sopravvalutato dell'anno. Mettete insieme The Witcher 3, Assassin's Creed Valhalla, Breath of the Wild sfiorandone la superficie, e avrete questo prodotto che dopo 80 ore di gioco non ha saputo coinvolgermi.",
      pros: ["Grafica eccezionale", "Paesaggi mozzafiato"],
      cons: ["Quest banali", "NPC vuoti", "Sistema di combattimento deludente"],
      helpful: 34,
    },
  ],
  news: [
    {
      id: 1,
      title: "I dipendenti hanno ricevuto un bonus di 2.900€ grazie al successo del gioco",
      excerpt:
        "Con oltre 5 milioni di copie vendute in tutto il mondo, Pearl Abyss ha regalato 5 milioni di won a ciascun dipendente.",
      date: "28 Aprile 2026",
    },
    {
      id: 2,
      title: "Crimson Desert ha ricevuto la sua importante patch 1.04.00",
      excerpt:
        "Pearl Abyss ha rilasciato il nuovo aggiornamento. La patch aggiunge opzioni di difficoltà e molte novità.",
      date: "20 Aprile 2026",
    },
    {
      id: 3,
      title: "La patch della prossima settimana sarà davvero imponente",
      excerpt:
        "Pearl Abyss ha dichiarato che la prossima settimana verrà distribuita una patch con numerose correzioni.",
      date: "14 Aprile 2026",
    },
  ],
  similarGames: [
    { title: "The Elder Scrolls IV: Oblivion Remastered", price: 40.99, platform: "Steam" },
    { title: "Avowed", price: 49.99, platform: "Microsoft Store" },
    { title: "Tales of Zestiria", price: 3.06, platform: "Steam" },
    { title: "Elex II", price: 7.13, platform: "Steam" },
  ],
  usersOnPage: 120,
}

function StarRating({ score }: { score: number }) {
  const filled = Math.round(score / 20)
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < filled ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
          )}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: (typeof GAME.reviews)[0] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-[#1a1d2e] rounded-xl p-5 flex flex-col gap-3 border border-white/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {review.author[0]}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{review.author}</p>
            <p className="text-gray-500 text-xs">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StarRating score={review.rating * 10} />
          <span className="text-orange-400 font-bold text-sm">{review.rating}/10</span>
        </div>
      </div>
      <div>
        <p className="text-white font-semibold text-sm mb-1">{review.title}</p>
        <p className={cn("text-gray-400 text-sm leading-relaxed", !expanded && "line-clamp-3")}>
          {review.text}
        </p>
        {review.text.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-orange-400 text-xs mt-1 flex items-center gap-1 hover:text-orange-300"
          >
            {expanded ? (
              <>Mostra meno <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Mostra di più <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="flex gap-4 text-xs">
          {review.pros.length > 0 && (
            <div className="flex-1">
              {review.pros.map((p) => (
                <div key={p} className="flex items-center gap-1 text-green-400 mb-1">
                  <ThumbsUp className="w-3 h-3" /> {p}
                </div>
              ))}
            </div>
          )}
          {review.cons.length > 0 && (
            <div className="flex-1">
              {review.cons.map((c) => (
                <div key={c} className="flex items-center gap-1 text-red-400 mb-1">
                  <ThumbsDown className="w-3 h-3" /> {c}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-gray-500 text-xs">Utile?</span>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 text-gray-500 hover:text-green-400 text-xs transition-colors">
            <ThumbsUp className="w-3 h-3" /> {review.helpful}
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-red-400 text-xs transition-colors">
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

function EditionCard({
  edition,
  selected,
  onSelect,
}: {
  edition: (typeof GAME.editions)[0]
  selected: boolean
  onSelect: () => void
}) {
  const [showAll, setShowAll] = useState(false)
  const visibleContents = showAll ? edition.contents : edition.contents.slice(0, 3)
  return (
    <div
      onClick={onSelect}
      className={cn(
        "rounded-xl p-5 cursor-pointer border-2 transition-all duration-200",
        selected
          ? "border-orange-500 bg-orange-500/10"
          : "border-white/10 bg-[#1a1d2e] hover:border-white/30"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-white font-bold text-sm">{edition.name}</span>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-semibold",
              edition.badge === "Miglior prezzo"
                ? "bg-green-500/20 text-green-400"
                : edition.badge === "Deluxe"
                ? "bg-purple-500/20 text-purple-400"
                : "bg-orange-500/20 text-orange-400"
            )}>
              {edition.badge}
            </span>
          </div>
          <span className="text-gray-500 text-xs flex items-center gap-1">
            <Globe className="w-3 h-3" /> {edition.region}
          </span>
        </div>
        <div className="text-right">
          <div className="text-gray-500 line-through text-xs">{edition.originalPrice}€</div>
          <div className="text-white font-bold text-xl">{edition.discountedPrice}€</div>
          <div className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full inline-block">
            -{edition.discount}%
          </div>
        </div>
      </div>
      <ul className="space-y-1">
        {visibleContents.map((item) => (
          <li key={item} className="flex items-center gap-2 text-gray-400 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      {edition.contents.length > 3 && (
        <button
          onClick={(e) => { e.stopPropagation(); setShowAll(!showAll) }}
          className="text-orange-400 text-xs mt-2 flex items-center gap-1 hover:text-orange-300"
        >
          {showAll ? (
            <><ChevronUp className="w-3 h-3" /> Mostra meno</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> +{edition.contents.length - 3} contenuti</>
          )}
        </button>
      )}
    </div>
  )
}

export default function GameDetailPage() {
  const [selectedEdition, setSelectedEdition] = useState(GAME.editions[0].id)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [activeScreenshot, setActiveScreenshot] = useState(0)

  const selected = GAME.editions.find((e) => e.id === selectedEdition)!

  return (
    <div className="min-h-screen bg-[#0f1117] text-white font-sans">
      {/* Hero / Background section */}
      <div className="relative w-full overflow-hidden" style={{ height: "480px" }}>
        <img
          src={GAME.backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&q=80"
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1117] via-[#0f1117]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent" />

        {/* Nav breadcrumb */}
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="hover:text-white cursor-pointer transition-colors">Home</span>
            <span>/</span>
            <span className="hover:text-white cursor-pointer transition-colors">Giochi</span>
            <span>/</span>
            <span className="hover:text-white cursor-pointer transition-colors">Azione</span>
            <span>/</span>
            <span className="text-white">{GAME.title}</span>
          </div>
        </div>

        {/* Users on page indicator */}
        <div className="absolute top-6 right-0 max-w-7xl mx-auto px-6 w-full flex justify-end">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm">
            <Users className="w-4 h-4 text-orange-400" />
            <span className="text-white font-semibold">{GAME.usersOnPage}</span>
            <span className="text-gray-400">utenti su questa pagina</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-6">
          <div className="flex items-end gap-6">
            <img
              src={GAME.coverImage}
              alt={GAME.title}
              className="w-32 h-44 object-cover rounded-xl shadow-2xl border border-white/10 flex-shrink-0 hidden sm:block"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "https://via.placeholder.com/128x176/1a1d2e/666?text=Cover"
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {GAME.genres.map((g) => (
                  <span key={g} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-1 drop-shadow-lg">
                {GAME.title}
              </h1>
              <p className="text-gray-400 text-lg mb-3">{GAME.subtitle}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <StarRating score={GAME.steamReviews.score} />
                  <span className="text-green-400 font-semibold">{GAME.steamReviews.label}</span>
                  <span className="text-gray-500">({GAME.steamReviews.count.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Shield className="w-4 h-4" />
                  {GAME.rating}
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-4 h-4" />
                  {GAME.releaseDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - main info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Screenshots */}
            <section>
              <div className="rounded-xl overflow-hidden bg-[#1a1d2e] border border-white/5">
                <div className="relative aspect-video bg-black">
                  <img
                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/ss_${activeScreenshot + 1}.600x338.jpg`}
                    alt={`Screenshot ${activeScreenshot + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80`
                    }}
                  />
                  <button
                    onClick={() => setActiveScreenshot((p) => Math.max(0, p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button
                    onClick={() => setActiveScreenshot((p) => Math.min(GAME.screenshots.length - 1, p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {GAME.screenshots.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveScreenshot(i)}
                      className={cn(
                        "flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden border-2 transition-all",
                        i === activeScreenshot ? "border-orange-500" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/1845980/ss_${i + 1}.116x65.jpg`}
                        alt={`Thumb ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=120&q=60`
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Tabs: Description / Requirements / Reviews / News */}
            <Tabs defaultValue="description">
              <TabsList className="bg-[#1a1d2e] border border-white/5 w-full h-auto p-1 flex-wrap">
                {[
                  { value: "description", label: "Descrizione" },
                  { value: "requirements", label: "Requisiti" },
                  { value: "reviews", label: `Recensioni (${GAME.reviews.length})` },
                  { value: "news", label: "Notizie" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 text-gray-400 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-none rounded-lg text-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div className="bg-[#1a1d2e] rounded-xl p-6 border border-white/5">
                  <div className={cn("text-gray-300 leading-relaxed text-sm whitespace-pre-line", !descExpanded && "line-clamp-6")}>
                    {GAME.description}
                  </div>
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="mt-3 text-orange-400 text-sm flex items-center gap-1 hover:text-orange-300"
                  >
                    {descExpanded ? (
                      <><ChevronUp className="w-4 h-4" /> Mostra meno</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> Leggi di più</>
                    )}
                  </button>

                  {/* Features */}
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <h3 className="text-white font-semibold mb-3 text-sm">Caratteristiche</h3>
                    <div className="flex flex-wrap gap-2">
                      {GAME.features.map((f) => (
                        <span key={f} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Gamepad2 className="w-3 h-3 text-orange-400" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Game info table */}
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <h3 className="text-white font-semibold mb-3 text-sm">Informazioni</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                      {[
                        { label: "Sviluppatore", value: GAME.developer },
                        { label: "Publisher", value: GAME.publisher },
                        { label: "Data di rilascio", value: GAME.releaseDate },
                        { label: "Voto", value: GAME.rating },
                        { label: "Generi", value: GAME.genres.join(", ") },
                        {
                          label: "Recensioni Steam",
                          value: `${GAME.steamReviews.label} (${GAME.steamReviews.count.toLocaleString()})`,
                        },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex gap-2">
                          <span className="text-gray-500 w-36 flex-shrink-0">{label}:</span>
                          <span className="text-gray-200">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="mt-4">
                <div className="bg-[#1a1d2e] rounded-xl p-6 border border-white/5">
                  <Tabs defaultValue="windows">
                    <TabsList className="bg-[#0f1117] border border-white/5 mb-6">
                      <TabsTrigger value="windows" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 flex items-center gap-2">
                        <Monitor className="w-4 h-4" /> Windows
                      </TabsTrigger>
                      <TabsTrigger value="mac" className="data-[state=active]:bg-gray-600 data-[state=active]:text-white text-gray-400 flex items-center gap-2">
                        <Apple className="w-4 h-4" /> macOS
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="windows">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(["minimum", "recommended"] as const).map((tier) => {
                          const req = GAME.systemRequirements.windows[tier]
                          return (
                            <div key={tier}>
                              <h4 className={cn("font-bold text-sm mb-3 uppercase tracking-wide", tier === "minimum" ? "text-yellow-400" : "text-green-400")}>
                                {tier === "minimum" ? "Minimi" : "Consigliati"}
                              </h4>
                              <div className="space-y-2">
                                {Object.entries(req).map(([k, v]) => (
                                  <div key={k} className="flex gap-2 text-sm">
                                    <span className="text-gray-500 capitalize w-24 flex-shrink-0">{k}:</span>
                                    <span className="text-gray-300">{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </TabsContent>
                    <TabsContent value="mac">
                      <div className="max-w-sm">
                        <h4 className="font-bold text-sm mb-3 uppercase tracking-wide text-yellow-400">Minimi</h4>
                        <div className="space-y-2">
                          {Object.entries(GAME.systemRequirements.mac.minimum).map(([k, v]) => (
                            <div key={k} className="flex gap-2 text-sm">
                              <span className="text-gray-500 capitalize w-24 flex-shrink-0">{k}:</span>
                              <span className="text-gray-300">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="flex flex-col gap-4">
                  {/* Score summary */}
                  <div className="bg-[#1a1d2e] rounded-xl p-6 border border-white/5 flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-black text-orange-400">
                        {(GAME.reviews.reduce((acc, r) => acc + r.rating, 0) / GAME.reviews.length).toFixed(1)}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">su 10</div>
                      <StarRating score={(GAME.reviews.reduce((acc, r) => acc + r.rating, 0) / GAME.reviews.length) * 10} />
                    </div>
                    <div className="flex-1">
                      {[10, 8, 6, 4, 2].map((score) => {
                        const count = GAME.reviews.filter((r) => r.rating >= score && r.rating < score + 2).length
                        const pct = (count / GAME.reviews.length) * 100
                        return (
                          <div key={score} className="flex items-center gap-2 mb-1">
                            <span className="text-gray-500 text-xs w-10">{score}-{score + 1}</span>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-gray-500 text-xs w-4">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className="text-2xl font-bold text-white">{GAME.reviews.length}</div>
                      <div className="text-gray-500 text-xs">recensioni</div>
                      <Award className="w-8 h-8 text-orange-400 mx-auto mt-2" />
                    </div>
                  </div>

                  {GAME.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="news" className="mt-4">
                <div className="flex flex-col gap-4">
                  {GAME.news.map((item) => (
                    <div key={item.id} className="bg-[#1a1d2e] rounded-xl p-5 border border-white/5 hover:border-orange-500/30 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm mb-2 group-hover:text-orange-400 transition-colors">{item.title}</p>
                          <p className="text-gray-400 text-xs leading-relaxed">{item.excerpt}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0 group-hover:text-orange-400 transition-colors mt-0.5" />
                      </div>
                      <p className="text-gray-600 text-xs mt-3">{item.date}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Similar games */}
            <section>
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-400" />
                Giochi simili
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {GAME.similarGames.map((game) => (
                  <div key={game.title} className="bg-[#1a1d2e] rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer group">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <Gamepad2 className="w-10 h-10 text-gray-600" />
                    </div>
                    <div className="p-3">
                      <p className="text-white text-xs font-semibold line-clamp-2 mb-1 group-hover:text-orange-400 transition-colors">{game.title}</p>
                      <p className="text-gray-500 text-xs mb-1">{game.platform}</p>
                      <p className="text-orange-400 font-bold text-sm">{game.price}€</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column - purchase box */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 flex flex-col gap-4">
              {/* Platforms */}
              <div className="bg-[#1a1d2e] rounded-xl p-4 border border-white/5 flex gap-3">
                {GAME.platforms.includes("PC") && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-300">
                    <Monitor className="w-4 h-4" /> PC
                  </div>
                )}
                {GAME.platforms.includes("Mac") && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-300">
                    <Apple className="w-4 h-4" /> Mac
                  </div>
                )}
              </div>

              {/* Editions */}
              <div className="flex flex-col gap-3">
                {GAME.editions.map((edition) => (
                  <EditionCard
                    key={edition.id}
                    edition={edition}
                    selected={selectedEdition === edition.id}
                    onSelect={() => setSelectedEdition(edition.id)}
                  />
                ))}
              </div>

              {/* Buy CTA */}
              <div className="bg-[#1a1d2e] rounded-xl p-5 border border-white/5">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-gray-500 line-through text-sm mr-2">{selected.originalPrice}€</span>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{selected.discount}%</span>
                  </div>
                  <span className="text-3xl font-black text-white">{selected.discountedPrice}€</span>
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                  <ShoppingCart className="w-5 h-5" />
                  Aggiungi al carrello
                </button>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all",
                      isWishlisted
                        ? "border-pink-500 bg-pink-500/10 text-pink-400"
                        : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isWishlisted && "fill-pink-400")} />
                    {isWishlisted ? "Aggiunto" : "Wishlist"}
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:border-white/30 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                    <Share2 className="w-4 h-4" />
                    Condividi
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  {[
                    { icon: Shield, text: "Pagamento sicuro garantito" },
                    { icon: Zap, text: "Consegna digitale istantanea" },
                    { icon: Award, text: "Chiave ufficiale Steam" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                      <Icon className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Controller support */}
              <div className="bg-[#1a1d2e] rounded-xl p-4 border border-white/5">
                <p className="text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wide">Controller supportati</p>
                <div className="flex flex-col gap-2">
                  {["Supporto controller Xbox", "Supporto DualSense"].map((c) => (
                    <div key={c} className="flex items-center gap-2 text-gray-300 text-xs">
                      <Gamepad2 className="w-4 h-4 text-orange-400" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
