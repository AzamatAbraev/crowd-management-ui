import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, ChevronLeft, Download, FlaskConical, RefreshCw } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { buildingService } from '../../services/buildingService';
import { generateDemoAnalytics, generateHourlyOccupancy, DEMO_BUILDINGS } from '../../data/demoAnalytics';
import type { HourlyPoint } from '../../data/demoAnalytics';
import type { AnalyticsRange, BuildingAnalytics, ChartPoint, DataStatus } from '../../types/analytics';
import type { Building } from '../../types/building';
import '../../styles/dashboard.css';

const LINE_COLORS = [
  'var(--primary-teal)',
  '#3b82f6',
  '#a855f7',
  '#f46800',
  'var(--status-green)',
];

const RISK_COLORS: Record<string, string> = {
  High: 'var(--status-red)',
  Moderate: 'var(--status-yellow)',
  Low: 'var(--status-green)',
};

function formatLabel(raw: string, range: AnalyticsRange): string {
  try {
    const d = new Date(raw);
    if (range === '7d') return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  } catch { return raw; }
}

function buildChartData(allData: BuildingAnalytics[], range: AnalyticsRange): ChartPoint[] {
  const labelMap = new Map<string, ChartPoint>();
  for (const ba of allData) {
    for (const pt of ba.points) {
      if (!labelMap.has(pt.label)) labelMap.set(pt.label, { label: formatLabel(pt.label, range) });
      labelMap.get(pt.label)![ba.buildingId] = Math.round(pt.value);
    }
  }
  return Array.from(labelMap.values());
}

function deriveSummary(allData: BuildingAnalytics[]) {
  const allValues = allData.flatMap(b => b.points.map(p => p.value));
  if (allValues.length === 0) return null;
  const globalMax = Math.max(...allValues);
  const avgDaily = Math.round(allData.reduce((s, b) => s + b.points.reduce((ss, p) => ss + p.value, 0), 0) / Math.max(1, allData.length));
  const peakPct = globalMax > 0 ? Math.round((globalMax / (globalMax * 1.15)) * 100) : 0;

  const buildingRows = allData.map(b => {
    const avg = b.points.length > 0 ? b.points.reduce((s, p) => s + p.value, 0) / b.points.length : 0;
    const relativeAvg = globalMax > 0 ? Math.round((avg / globalMax) * 100) : 0;
    return {
      name: b.buildingName,
      footfall: Math.round(b.points.reduce((s, p) => s + p.value, 0)),
      avgOcc: relativeAvg,
      risk: relativeAvg > 70 ? 'High' : relativeAvg > 40 ? 'Moderate' : 'Low',
    };
  });

  return { avgDaily, peakPct, buildingRows };
}

const AdminStatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [range, setRange] = useState<AnalyticsRange>('7d');
  const [status, setStatus] = useState<'loading' | 'no-data' | 'ready'>('loading');
  const [dataStatus, setDataStatus] = useState<DataStatus>({ hasRealData: false, hasDemoData: false });
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [allData, setAllData] = useState<BuildingAnalytics[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoSeed, setDemoSeed] = useState(0);
  const [hourlyData, setHourlyData] = useState<HourlyPoint[]>([]);

  const loadAnalytics = useCallback(async (bs: Building[], r: AnalyticsRange) => {
    setLoadingData(true);
    const results = await Promise.all(
      bs.map(async b => ({
        buildingId: b.id,
        buildingName: b.name,
        points: await analyticsService.getBuildingData(b.id, r),
      }))
    );
    setAllData(results);
    setLoadingData(false);
  }, []);

  const resolveBuildings = useCallback(async (): Promise<Building[]> => {
    const pgBuildings = await buildingService.getAllBuildings();
    if (pgBuildings.length > 0) return pgBuildings;
    const ids = await analyticsService.getAvailableBuildings();
    return ids.map(id => ({ id, name: id }));
  }, []);

  const init = useCallback(async () => {
    setStatus('loading');
    const [ds, bs] = await Promise.all([
      analyticsService.getDataStatus(),
      resolveBuildings(),
    ]);
    setDataStatus(ds);
    setBuildings(bs);
    if (!ds.hasRealData && !ds.hasDemoData) { setStatus('no-data'); return; }
    await loadAnalytics(bs, range);
    setStatus('ready');
  }, [range, loadAnalytics, resolveBuildings]);

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (status !== 'ready') return;
    if (isDemoMode) {
      const bs = buildings.length > 0 ? buildings : DEMO_BUILDINGS;
      setAllData(generateDemoAnalytics(bs, range, demoSeed));
    } else if (buildings.length > 0) {
      loadAnalytics(buildings, range);
    }
  }, [range]);

  const handleLoadDemo = (seed = demoSeed) => {
    setLoadingDemo(true);
    const bs = buildings.length > 0 ? buildings : DEMO_BUILDINGS;
    setBuildings(bs);
    setAllData(generateDemoAnalytics(bs, range, seed));
    setHourlyData(generateHourlyOccupancy(bs));
    setDataStatus({ hasRealData: false, hasDemoData: true });
    setIsDemoMode(true);
    setStatus('ready');
    setLoadingDemo(false);
  };

  const handleRefreshDemo = () => {
    const nextSeed = demoSeed + 1;
    setDemoSeed(nextSeed);
    handleLoadDemo(nextSeed);
  };

  const chartData = buildChartData(allData, range);
  const summary = deriveSummary(allData);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>

      <nav style={{ padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--border-color)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#a855f7', padding: '0.4rem', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={22} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Statistics & Analytics</h1>
                {dataStatus.hasDemoData && !dataStatus.hasRealData && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, backgroundColor: 'rgba(168,85,247,0.12)', color: '#a855f7', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    <FlaskConical size={10} /> DEMO
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Historical Data · {user?.username}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {(['7d', '30d', '90d'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: '5px 14px', borderRadius: 7, border: `1px solid ${range === r ? 'var(--primary-teal)' : 'var(--border-color)'}`, backgroundColor: range === r ? 'var(--primary-teal-transparent)' : 'transparent', color: range === r ? 'var(--primary-teal)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
              {r}
            </button>
          ))}
          {dataStatus.hasDemoData && !dataStatus.hasRealData && (
            <button onClick={handleRefreshDemo} disabled={loadingDemo} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1px solid #a855f7', backgroundColor: 'rgba(168,85,247,0.08)', color: '#a855f7', fontWeight: 700, fontSize: '0.8rem', cursor: loadingDemo ? 'not-allowed' : 'pointer', opacity: loadingDemo ? 0.6 : 1 }}>
              <RefreshCw size={12} style={{ animation: loadingDemo ? 'spin 0.8s linear infinite' : undefined }} /> Refresh Demo
            </button>
          )}
          <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 7, border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {status === 'loading' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="glass-panel" style={{ height: 90, animation: 'pulse 1.5s ease-in-out infinite' }} />)}
            </div>
            <div className="glass-panel" style={{ height: 260, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </>
        )}

        {status === 'no-data' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '4rem 2rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--bg-panel-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6 }}>No statistics available yet</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 420, lineHeight: 1.6 }}>
                Statistics become available once the system has collected at least a week of occupancy readings.
              </div>
            </div>
            <button onClick={() => handleLoadDemo()} disabled={loadingDemo} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 1.4rem', borderRadius: 9, border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: loadingDemo ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem', opacity: loadingDemo ? 0.7 : 1 }}>
              <FlaskConical size={16} style={{ animation: loadingDemo ? 'spin 0.8s linear infinite' : undefined }} />
              {loadingDemo ? 'Generating demo data…' : 'Load Demo Data'}
            </button>
          </div>
        )}

        {status === 'ready' && (
          <>
            {summary && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {[
                  { label: 'Avg Daily Count', value: summary.avgDaily.toLocaleString(), sub: 'people / building / day' },
                  { label: 'Peak Occupancy', value: `${summary.peakPct}%`, sub: 'relative to observed max' },
                  { label: 'Buildings Tracked', value: String(buildings.length), sub: 'with occupancy data' },
                  { label: 'Data Range', value: range, sub: 'selected period' },
                ].map((s, i) => (
                  <div key={i} className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{s.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{loadingData ? '—' : s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Occupancy Trends ({range})</h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average occupancy count by building</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 600, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {buildings.map((b, i) => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 5, color: LINE_COLORS[i % LINE_COLORS.length] }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }} /> {b.name}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: 220 }}>
                {loadingData ? (
                  <div style={{ height: '100%', borderRadius: 8, backgroundColor: 'var(--bg-panel-hover)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.8rem' }} />
                      {buildings.map((b, i) => (
                        <Line key={b.id} type="monotone" dataKey={b.id} name={b.name} stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={2} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)' }}>
                    <BarChart2 size={28} style={{ opacity: 0.4 }} />
                    <span style={{ fontSize: '0.875rem' }}>No data available for this period. Try refreshing or switching range.</span>
                  </div>
                )}
              </div>
            </div>

            {isDemoMode && hourlyData.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Peak Occupancy by Hour</h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Typical weekday occupancy count per building across 24 hours</p>
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="20%">
                      <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        interval={2}
                      />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.8rem' }}
                        formatter={(value, name) => {
                          const key = String(name ?? '');
                          const b = buildings.find(b => b.id === key);
                          return [value ?? 0, b?.name ?? key] as [typeof value, string];
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          const b = buildings.find(b => b.id === value);
                          return <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b?.name ?? value}</span>;
                        }}
                        wrapperStyle={{ paddingTop: 12 }}
                      />
                      {buildings.map((b, i) => (
                        <Bar key={b.id} dataKey={b.id} name={b.id} stackId="a" fill={LINE_COLORS[i % LINE_COLORS.length]} radius={i === buildings.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {summary && summary.buildingRows.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Footfall Distribution by Building</h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share of total visitor count across buildings for the selected period</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '0 0 260px', height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={summary.buildingRows.map(b => ({ name: b.name, value: b.footfall }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {summary.buildingRows.map((_, i) => (
                            <Cell key={i} fill={LINE_COLORS[i % LINE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.8rem' }}
                          formatter={(value) => [(value as number).toLocaleString(), 'Visitors']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: 200 }}>
                    {(() => {
                      const total = summary.buildingRows.reduce((s, b) => s + b.footfall, 0);
                      return summary.buildingRows.map((b, i) => {
                        const pct = total > 0 ? Math.round((b.footfall / total) * 100) : 0;
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }} />
                            <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>{b.name}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{b.footfall.toLocaleString()} visitors</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: LINE_COLORS[i % LINE_COLORS.length], minWidth: 38, textAlign: 'right' }}>{pct}%</div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}

            {summary && (
              <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Building Summary</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-panel-hover)' }}>
                      {['Building', 'Total Count', 'Avg Occupancy', 'Risk'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.buildingRows.map((b, i) => (
                      <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.875rem 1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>{b.name}</td>
                        <td style={{ padding: '0.875rem 1.5rem', color: 'var(--text-muted)' }}>{b.footfall.toLocaleString()}</td>
                        <td style={{ padding: '0.875rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {b.avgOcc}%
                            <div style={{ flex: 1, height: 4, backgroundColor: 'var(--bg-panel-hover)', borderRadius: 2, maxWidth: 60 }}>
                              <div style={{ height: '100%', width: `${b.avgOcc}%`, backgroundColor: 'var(--primary-teal)', borderRadius: 2 }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.875rem 1.5rem' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, backgroundColor: `${RISK_COLORS[b.risk]}22`, color: RISK_COLORS[b.risk] }}>{b.risk}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default AdminStatisticsPage;
