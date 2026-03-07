import { TREND_DATA } from "../../data/dashboard";

export const OccupancyTrendsChart = () => {
  const w = 700, h = 260;
  const pad = { t: 20, r: 20, b: 30, l: 40 };
  const cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;

  const toPath = (data: number[]) =>
    data.map((v, i) => {
      const x = pad.l + (i / (data.length - 1)) * cw;
      const y = pad.t + (1 - v / 100) * ch;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  const toArea = (data: number[]) =>
    toPath(data) + ` L${(pad.l + cw).toFixed(1)},${(pad.t + ch).toFixed(1)} L${pad.l},${(pad.t + ch).toFixed(1)} Z`;

  const gridYs = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="libGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b77f" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b77f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridYs.map(pct => {
        const y = pad.t + (1 - pct / 100) * ch;
        return (
          <g key={pct}>
            <line x1={pad.l} y1={y} x2={pad.l + cw} y2={y} stroke="#10b77f" strokeOpacity="0.07" strokeDasharray="4 4" />
            <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#10b77f" fillOpacity="0.4">{pct}%</text>
          </g>
        );
      })}
      {["Month 1", "Month 2", "Month 3"].map((label, i) => {
        const x = pad.l + (i / 2) * cw;
        return (
          <text key={label} x={x} y={h - 4} textAnchor="middle" fontSize="9" fill="#10b77f" fillOpacity="0.4" fontWeight="700" style={{ textTransform: "uppercase", letterSpacing: 1 }}>
            {label}
          </text>
        );
      })}
      <path d={toArea(TREND_DATA.library)} fill="url(#libGrad)" />
      <path d={toPath(TREND_DATA.library)} fill="none" stroke="#10b77f" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={toPath(TREND_DATA.union)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.85" />
      <path d={toPath(TREND_DATA.science)} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.85" />
    </svg>
  );
};
