const BrandLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7bfd0] via-[#f9dfe9] to-[#bee8ff] shadow-[0_10px_25px_rgba(188,141,168,0.28)] ring-2 ring-white/80">
        <span className="text-lg font-black tracking-tight text-[#4a3b4d]">M</span>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#8d7b8b]">Manga</p>
        <p className="text-xl font-black tracking-tight text-[#3a2c3c]">MoonShelf</p>
      </div>
    </div>
  );
};

export default BrandLogo;
