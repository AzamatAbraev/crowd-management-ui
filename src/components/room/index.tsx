import type { Room } from "../../types/dashboard";
import { occupancyBg, occupancyColor } from "../../utils";

export const RoomCard = ({ room }: { room: Room }) => {
  const color = occupancyColor(room.occupancy);
  const sizeClass = room.size === "large" ? "col-span-2 row-span-2" : room.size === "medium" ? "col-span-1 row-span-2" : "col-span-1 row-span-1";
  return (
    <div
      className={`${sizeClass} relative rounded-xl border p-3 flex flex-col justify-between cursor-pointer group transition-all`}
      style={{
        background: "rgba(16,183,127,0.03)",
        borderColor: room.occupancy >= 80 ? "rgba(239,68,68,0.3)" : room.occupancy >= 50 ? "rgba(234,179,8,0.25)" : "rgba(16,183,127,0.15)",
      }}
    >
      <div className="flex justify-between items-start gap-1">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(16,183,127,0.5)" }}>{room.id.replace(/(\d{3})/, "ROOM $1")}</p>
          <p className="text-xs font-semibold text-slate-200 mt-0.5 leading-tight">{room.name}</p>
        </div>
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${occupancyBg(room.occupancy)}`}>
          {room.occupancy}%
        </span>
      </div>
      {room.size !== "small" && (
        <div className="mt-2">
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${room.occupancy}%`, background: color }} />
          </div>
          {room.activeUsers && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex -space-x-1">
                {[...Array(Math.min(3, Math.round(room.activeUsers / 10)))].map((_, i) => (
                  <div key={i} className="size-4 rounded-full border border-[#0d1f18]" style={{ background: `hsl(${150 + i * 25},60%,40%)` }} />
                ))}
              </div>
              {room.activeUsers > 30 && (
                <span className="text-[9px] font-bold" style={{ color: "rgba(16,183,127,0.6)" }}>+{room.activeUsers - 3}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
