import HeaderMiniBanner from '../components/HeaderMiniBanner';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';

const featuredProducts = [
  {
    series: 'Shonen',
    title: 'Black Clover',
    volume: 'Vol. 12',
    price: '$14.90',
    short: 'BC',
    tag: 'Top',
    colors: ['#f9d7e4', '#cfeeff'],
  },
  {
    series: 'Shonen',
    title: 'Dorohedoro',
    volume: 'Vol. 7',
    price: '$12.50',
    short: 'AH',
    tag: 'New',
    colors: ['#f7dff8', '#d8f4ff'],
  },
  {
    series: 'Comedia',
    title: 'Nagatoro-san',
    volume: 'Vol. 16',
    price: '$16.20',
    short: 'JK',
    tag: 'Hot',
    colors: ['#f9d7d5', '#d9ebff'],
  },
  {
    series: 'Yuri',
    title: 'Kase-San & Yamada',
    volume: 'Vol. 9',
    price: '$15.00',
    short: 'DS',
    tag: 'Gift',
    colors: ['#f9dfe9', '#dceeff'],
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffafc_0%,_#f8edf3_25%,_#eef7ff_100%)] px-3 py-5 text-[#2f2432] md:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-[#f1dfe9] bg-[#fbf7f9]/80 shadow-[0_30px_80px_rgba(178,126,157,0.14)] backdrop-blur-sm">
        <HeaderMiniBanner />

        <main className="bg-[#f8f6f8] px-4 pb-10 pt-7 md:px-8">
          <section className="relative overflow-hidden rounded-[26px] border border-[#f1dfe8] bg-gradient-to-r from-[#fff8fb] via-[#f9ecf1] to-[#edf9ff] px-5 py-10 shadow-inner md:px-8">
            <div className="absolute -right-8 top-4 h-40 w-40 rounded-full bg-[#d9f1ff]/70 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[#f9d6e6]/80 blur-3xl" />

            <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="mb-4 inline-flex rounded-full border border-[#f0d9e7] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8f7d90]">
                  Colección nueva
                </p>
                <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-[#31243a] md:text-6xl">
                  Descubre tu próxima obsesión manga.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-[#5f4d5f] md:text-lg">
                  Encuentra ediciones premium, clásicos irresistibles y lanzamientos exclusivos para cada fan del manga.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button className="rounded-full bg-[#f7bfd0] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#3d2d3d] shadow-[0_12px_20px_rgba(247,191,208,0.45)] transition hover:-translate-y-0.5">
                    Ver catálogo
                  </button>
                  <button className="rounded-full border border-[#d9edff] bg-white/80 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#3d4f67] transition hover:bg-white">
                    Colecciones
                  </button>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-[30px] border border-white/80 bg-white/60 p-4 shadow-[0_28px_50px_rgba(181,137,169,0.13)] backdrop-blur-sm">
                  <div className="rounded-[24px] bg-gradient-to-br from-[#f9d3df] via-[#f7ebf0] to-[#ddf0ff] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#6a5868]">
                        Best seller
                      </span>
                      <span className="rounded-full bg-[#fff] px-3 py-1 text-sm font-semibold text-[#564553]">$22.90</span>
                    </div>

                    <div className="flex h-72 items-center justify-center rounded-[20px] bg-white/30 shadow-inner">
                      <div className="relative flex h-56 w-40 items-center justify-center rounded-[22px] border border-white/60 bg-gradient-to-b from-[#fffafc] to-[#eed9e5] text-5xl font-black text-[#463947] shadow-[0_25px_40px_rgba(170,136,160,0.14)]">
                        <div className="absolute inset-2 rounded-[18px] border border-[#f4dfe9]" />
                        <span className="relative">M</span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[#513f4d]">
                      <div className="rounded-2xl bg-white/70 px-3 py-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#867385]">Páginas</div>
                        <div className="mt-1 text-lg font-black">220</div>
                      </div>
                      <div className="rounded-2xl bg-white/70 px-3 py-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#867385]">Edición</div>
                        <div className="mt-1 text-lg font-black">Deluxe</div>
                      </div>
                      <div className="rounded-2xl bg-white/70 px-3 py-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#867385]">Rating</div>
                        <div className="mt-1 text-lg font-black">4.9</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <SectionTitle eyebrow="Novedades" title="Títulos del mes" action="Ver más" />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-[#efdfe8] bg-gradient-to-r from-[#fff1f7] to-[#edf8ff] p-6 shadow-[0_18px_45px_rgba(170,124,156,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a37f8f]">Servicios</p>
              <h3 className="mt-3 text-3xl font-black tracking-tight text-[#31263a]">Todo lo que tu colección necesita</h3>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {([
                  { icon: '📦', text: 'Envíos rápidos' },
                  { icon: '🎁', text: 'Gift cards' },
                  { icon: '💬', text: 'Atención real' },
                ]).map(({ icon, text }) => (
                  <div key={text} className="rounded-[22px] border border-white/70 bg-white/70 p-4 text-center shadow-sm">
                    <div className="mb-3 text-3xl">{icon}</div>
                    <p className="font-bold text-[#403246]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#e8dff5] bg-[#ffffff] p-6 shadow-[0_18px_45px_rgba(150,130,186,0.08)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8774a1]">Newsletter</p>
              <h3 className="mt-3 text-3xl font-black tracking-tight text-[#2e2738]">Súmate a los drops</h3>
              <p className="mt-3 text-[#624f5d]">Recibe avisos de lanzamientos, promociones y nuevas colecciones.</p>

              <div className="mt-5 rounded-full border border-[#efdfe8] bg-[#fff9fb] p-2">
                <input
                  type="email"
                  placeholder="Tu correo"
                  className="w-full bg-transparent px-3 py-2 text-sm text-[#433b4a] placeholder:text-[#9a8696] outline-none"
                />
              </div>
              <button className="mt-4 w-full rounded-full bg-[#cfeeff] px-4 py-3 text-sm font-black uppercase tracking-[0.15em] text-[#24384d] transition hover:bg-[#bfe5ff]">
                Suscribirme
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
