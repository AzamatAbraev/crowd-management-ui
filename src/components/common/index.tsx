export const LiveOccupancyBar = ({ value, color }: { value: number; color: string }) => (
  <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
    <div
      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
      style={{ width: `${value}%`, background: color }}
    />
  </div>
);

export const MiniSparkline = ({ data, color = "#10b77f" }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const h = 32, w = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};