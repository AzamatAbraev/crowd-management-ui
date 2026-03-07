export const occupancyColor = (pct: number) => {
  if (pct >= 80) return "#ef4444";
  if (pct >= 50) return "#eab308";
  return "#10b77f";
};

export const occupancyBg = (pct: number) => {
  if (pct >= 80) return "bg-red-500/20 text-red-400";
  if (pct >= 50) return "bg-yellow-500/20 text-yellow-400";
  return "bg-emerald-500/20 text-emerald-400";
};

export const riskStyle = (risk: string) => {
  if (risk === "High")
    return "bg-red-500/15 text-red-400 border border-red-500/20";
  if (risk === "Moderate")
    return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
  return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
};

export const formatNumber = (n: number) => n.toLocaleString();