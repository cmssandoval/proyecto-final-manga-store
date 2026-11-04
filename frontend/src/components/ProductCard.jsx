const ProductCard = ({ product }) => {
  const cardStyle = {
    background: `linear-gradient(135deg, ${product.colors[0]}, ${product.colors[1]})`,
  };

  return (
    <article className="group overflow-hidden rounded-[26px] border border-[#f1dfe8] bg-white p-3 shadow-[0_18px_40px_rgba(173,126,154,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(171,124,154,0.12)]">
      <div className="relative overflow-hidden rounded-[20px] p-3" style={cardStyle}>
        <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[#4b3949]">
          <span className="rounded-full bg-white/60 px-2 py-1 backdrop-blur-sm">Nuevo</span>
          <span className="rounded-full bg-[#fffafc] px-2 py-1 text-[#694b5d]">{product.tag}</span>
        </div>

        <div className="relative mx-auto flex h-52 w-40 items-end justify-center overflow-hidden rounded-[18px] border border-white/35 bg-white/10 shadow-inner backdrop-blur-sm">
          <div className="absolute inset-x-3 top-3 h-24 rounded-full bg-white/20 blur-2xl" />
          <div className="relative flex h-40 w-28 items-center justify-center rounded-[16px] bg-[#fff7fb]/80 text-4xl font-black text-[#533c4b] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)]">
            {product.short}
          </div>
        </div>
      </div>

      <div className="px-1 pb-2 pt-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8d7b8b]">{product.series}</p>
        <h3 className="text-lg font-black text-[#3a2d39]">{product.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d6e7b]">{product.volume}</span>
          <span className="text-xl font-black text-[#3d2a3c]">{product.price}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
