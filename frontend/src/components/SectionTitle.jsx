const SectionTitle = ({ eyebrow, title, action }) => {
  return (
    <div className="mb-6 flex items-end justify-between gap-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#9a7d8a]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-[#342a35]">{title}</h2>
      </div>
      {action && (
        <button className="rounded-full border border-[#ecd2de] bg-white px-4 py-2 text-sm font-semibold text-[#4d3b50] shadow-sm transition hover:bg-[#fff3f9]">
          {action}
        </button>
      )}
    </div>
  );
};

export default SectionTitle;
