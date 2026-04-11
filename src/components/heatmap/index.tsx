const HEATMAP_DATA = [
  [10, 20, 10, 20, 10, 5, 5],
  [60, 80, 90, 70, 50, 20, 10],
  [40, 50, 60, 50, 40, 10, 5],
  [20, 20, 30, 20, 20, 30, 40],
];
const HEATMAP_TIMES = ["08:00", "12:00", "16:00", "20:00"];
const HEATMAP_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const PeakHeatmap = () => (
  <div>
    <div className="grid gap-1" style={{ gridTemplateColumns: "40px repeat(7, 1fr)" }}>
      <div />
      {HEATMAP_DAYS.map((d, i) => (
        <div key={i} className="text-center text-[9px] font-bold" style={{ color: "#10b77f", opacity: 0.5 }}>{d}</div>
      ))}
      {HEATMAP_DATA.map((row, ri) => (
        <>
          <div key={`t${ri}`} className="text-[9px] font-bold flex items-center" style={{ color: "#10b77f", opacity: 0.5 }}>{HEATMAP_TIMES[ri]}</div>
          {row.map((val, ci) => (
            <div
              key={ci}
              className="aspect-square rounded-sm transition-all"
              style={{ background: `rgba(16,183,127,${val / 100})` }}
              title={`${HEATMAP_TIMES[ri]} ${HEATMAP_DAYS[ci]}: ${val}%`}
            />
          ))}
        </>
      ))}
    </div>
    <div className="mt-4 flex items-center justify-between gap-2">
      <span className="text-[10px] font-medium" style={{ color: "rgba(16,183,127,0.5)" }}>Low Activity</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "linear-gradient(to right, rgba(16,183,127,0.1), #10b77f)" }} />
      <span className="text-[10px] font-medium" style={{ color: "rgba(16,183,127,0.7)" }}>Peak</span>
    </div>
  </div>
);
