import React, { useState, useEffect, useCallback } from 'react';
import { Download, FlaskConical, BarChart2, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { buildingService } from '../../services/buildingService';
import type { AnalyticsRange, BuildingAnalytics, ChartPoint, DataStatus } from '../../types/analytics';
import type { Building } from '../../types/building';

const LINE_COLORS = [
  'var(--primary-teal)',
  'var(--status-blue)',
  'var(--status-purple)',
  '#f46800',
  'var(--status-green)',
];

function formatLabel(raw: string, range: AnalyticsRange): string {
  try {
    const d = new Date(raw);
    if (range === '7d') return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
    if (range === '30d') return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  } catch {
    return raw;
  }
}

function buildChartData(allData: BuildingAnalytics[], range: AnalyticsRange): ChartPoint[] {
  const labelSet = new Map<string, ChartPoint>();

  for (const ba of allData) {
    for (const pt of ba.points) {
      const key = pt.label;
      if (!labelSet.has(key)) {
        labelSet.set(key, { label: formatLabel(key, range) });
      }
      labelSet.get(key)![ba.buildingId] = Math.round(pt.value);
    }
  }

  return Array.from(labelSet.values());
}

function deriveSummary(allData: BuildingAnalytics[]) {
  const allValues = allData.flatMap(b => b.points.map(p => p.value));
  if (allValues.length === 0) return null;

  const totalPerBuilding = allData.map(b => ({
    id: b.buildingId,
    name: b.buildingName,
    total: b.points.reduce((s, p) => s + p.value, 0),
    avg: b.points.length > 0 ? b.points.reduce((s, p) => s + p.value, 0) / b.points.length : 0,
    peak: Math.max(...b.points.map(p => p.value), 0),
  }));

  const globalMax = Math.max(...allValues);
  const avgDaily = Math.round(allData.reduce((s, b) => s + b.points.reduce((ss, p) => ss + p.value, 0), 0) / Math.max(1, allData.length));
  const peakPct = globalMax > 0 ? Math.round((globalMax / (globalMax * 1.15)) * 100) : 0;

  const buildingRows = totalPerBuilding.map(b => {
    const relativeAvg = globalMax > 0 ? Math.round((b.avg / globalMax) * 100) : 0;
    const risk = relativeAvg > 70 ? 'High' : relativeAvg > 40 ? 'Moderate' : 'Low';
    return { name: b.name, footfall: Math.round(b.total), avgOcc: relativeAvg, risk };
  });

  return { avgDaily, peakPct, buildingRows };
}

const AnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<AnalyticsRange>('7d');
  const [status, setStatus] = useState<'loading' | 'no-data' | 'ready'>('loading');
  const [dataStatus, setDataStatus] = useState<DataStatus>({ hasRealData: false, hasDemoData: false });
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [allData, setAllData] = useState<BuildingAnalytics[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

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

    if (!ds.hasRealData && !ds.hasDemoData) {
      setStatus('no-data');
      return;
    }
    await loadAnalytics(bs, range);
    setStatus('ready');
  }, [range, loadAnalytics, resolveBuildings]);

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (status === 'ready' && buildings.length > 0) {
      loadAnalytics(buildings, range);
    }
  }, [range]);

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    try {
      const { buildingsFound } = await analyticsService.insertDemoData();
      const bs = buildingsFound > 0
        ? (buildings.length > 0 ? buildings : await resolveBuildings())
        : [];
      const ds = await analyticsService.getDataStatus();
      setBuildings(bs);
      setDataStatus(ds);
      if (bs.length > 0) {
        await loadAnalytics(bs, range);
      }
      setStatus('ready');
    } catch (e) {
      console.error('Failed to insert demo data:', e);
    } finally {
      setLoadingDemo(false);
    }
  };

  const chartData = buildChartData(allData, range);
  const summary = deriveSummary(allData);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Historical Analytics</h1>
            <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Checking available data…</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-4)' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 90, borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
        <div style={{ height: 260, borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  if (status === 'no-data') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Historical Analytics</h1>
          <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Occupancy trends and building-level insights</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-5)', padding: '4rem 2rem', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--bg-panel-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={28} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6 }}>No statistics available yet</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 420, lineHeight: 1.6 }}>
              Analytics are generated from live IoT sensor data. Statistics become available once the system has collected at least a week of occupancy readings.
            </div>
          </div>
          <button
            onClick={handleLoadDemo}
            disabled={loadingDemo}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 1.4rem', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--primary-teal)', color: '#fff', cursor: loadingDemo ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem', opacity: loadingDemo ? 0.7 : 1 }}
          >
            <FlaskConical size={16} style={{ animation: loadingDemo ? 'spin 0.8s linear infinite' : undefined }} />
            {loadingDemo ? 'Generating demo data…' : 'Load Demo Data'}
          </button>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Demo data simulates 90 days of realistic occupancy patterns — weekday peaks, weekend lows, time-of-day variation.
          </div>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="animate-in stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Historical Analytics</h1>
            {dataStatus.hasDemoData && !dataStatus.hasRealData && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 10px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(168,85,247,0.12)', color: '#a855f7', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                <FlaskConical size={11} /> DEMO DATA
              </span>
            )}
          </div>
          <p style={{ margin: 'var(--space-1) 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Occupancy trends and building-level insights</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
          {(['7d', '30d', '90d'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} className="btn" style={{ padding: '4px 12px', fontSize: '0.8125rem', background: range === r ? 'var(--primary-teal-transparent)' : 'transparent', color: range === r ? 'var(--primary-teal)' : 'var(--text-muted)', border: `1px solid ${range === r ? 'var(--primary-teal)' : 'var(--border-color)'}` }}>
              {r}
            </button>
          ))}
          {dataStatus.hasDemoData && !dataStatus.hasRealData && (
            <button onClick={handleLoadDemo} disabled={loadingDemo} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.8125rem', gap: 'var(--space-1)', color: '#a855f7', borderColor: '#a855f7' }}>
              <RefreshCw size={12} style={{ animation: loadingDemo ? 'spin 0.8s linear infinite' : undefined }} />
              Refresh Demo
            </button>
          )}
          <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.8125rem', gap: 'var(--space-1)' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-4)' }}>
          {[
            { label: 'Avg Daily Count', value: summary.avgDaily.toLocaleString(), sub: 'people / building / day' },
            { label: 'Peak Occupancy', value: `${summary.peakPct}%`, sub: 'relative to observed max' },
            { label: 'Buildings Tracked', value: String(buildings.length), sub: 'with occupancy data' },
            { label: 'Data Range', value: range, sub: 'selected period' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--space-2)' }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{loadingData ? '—' : s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>
              Occupancy Trends <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({range})</span>
            </h3>
            <p style={{ margin: 'var(--space-1) 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Average occupancy count by building</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {buildings.map((b, i) => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: LINE_COLORS[i % LINE_COLORS.length] }}>
                <div style={{ width: '8px', height: '2px', borderRadius: '1px', backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }} />
                {b.name}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '200px' }}>
          {loadingData ? (
            <div style={{ height: '100%', borderRadius: 8, backgroundColor: 'var(--bg-panel-hover)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', boxShadow: 'var(--shadow-md)' }} />
                {buildings.map((b, i) => (
                  <Line key={b.id} type="monotone" dataKey={b.id} name={b.name} stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={1.5} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No data available for this period.
            </div>
          )}
        </div>
      </div>

      {summary && (
        <div style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>Building Summary</div>
          <table className="data-table">
            <thead>
              <tr>
                {['Building', 'Total Count', 'Avg Occupancy', 'Risk Level'].map((h, i) => (
                  <th key={h} className={i === 1 || i === 2 ? 'right' : ''}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.buildingRows.map((b, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.name}</td>
                  <td className="right" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{b.footfall.toLocaleString()}</td>
                  <td className="right">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                      <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-main)' }}>{b.avgOcc}%</span>
                      <div style={{ width: '48px', height: '4px', backgroundColor: 'var(--bg-panel-hover)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${b.avgOcc}%`, backgroundColor: 'var(--primary-teal)', borderRadius: 'var(--radius-full)' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${b.risk === 'High' ? 'red' : b.risk === 'Moderate' ? 'yellow' : 'green'}`}>{b.risk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;
