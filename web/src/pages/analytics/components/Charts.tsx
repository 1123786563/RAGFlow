import { Activity, ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-start mb-6">
    <div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// Enhanced SVG Line Chart with Grid and Smooth Curves
export const AreaChart: React.FC<{
  data: number[];
  color: string;
  height?: number;
  showGrid?: boolean;
}> = ({ data, color, height = 64, showGrid = false }) => {
  const max = Math.max(...data, 1);
  const min = 0; // Fixed baseline at 0 for area charts
  const range = max - min;

  // Create points
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  // Grid lines
  const gridLines = [0, 25, 50, 75, 100].map((y) => (
    <line
      key={y}
      x1="0"
      y1={y}
      x2="100"
      y2={y}
      stroke="#f1f5f9"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  ));

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{ height: `${height}px` }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        {showGrid && gridLines}
        {/* Fill Area */}
        <path
          d={`M0,100 L0,${100 - ((data[0] - min) / range) * 100} ${points
            .split(' ')
            .map((p) => 'L' + p)
            .join(' ')} L100,100 Z`}
          fill={color}
          fillOpacity="0.15"
          stroke="none"
        />
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          points={points}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Modern Bar Chart
export const ColumnChart: React.FC<{
  data: { label: string; value: number }[];
  color: string;
}> = ({ data, color }) => {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-between space-x-3 h-48 w-full pb-2">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center flex-1 h-full justify-end group cursor-default"
        >
          <div className="relative w-full flex items-end justify-center h-[85%] bg-slate-50 rounded-t-lg overflow-hidden">
            {/* Background bar */}
            <div
              className={`w-full mx-1 rounded-t-md ${color} opacity-80 group-hover:opacity-100 transition-all duration-300 relative`}
              style={{ height: `${(item.value / max) * 100}%` }}
            >
              {/* Highlight top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30"></div>
            </div>
            {/* Tooltip */}
            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded-md transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg transform translate-y-2 group-hover:translate-y-0">
              {item.value}
            </div>
          </div>
          <span className="mt-2 text-[10px] uppercase font-semibold text-slate-400 truncate w-full text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// Stacked Bar Chart for Token Usage breakdown
export const StackedBarChart: React.FC<{
  data: {
    label: string;
    series: { value: number; color: string; label: string }[];
  }[];
}> = ({ data }) => {
  const max = Math.max(
    ...data.map((d) => d.series.reduce((a, b) => a + b.value, 0)),
  );

  return (
    <div className="flex items-end justify-between space-x-3 h-48 w-full pb-2">
      {data.map((item, index) => {
        const total = item.series.reduce((a, b) => a + b.value, 0);
        return (
          <div
            key={index}
            className="flex flex-col items-center flex-1 h-full justify-end group cursor-default"
          >
            <div className="relative w-full flex flex-col-reverse justify-start h-[85%] bg-slate-50 rounded-t-lg overflow-hidden">
              {item.series.map((s, sIdx) => {
                const heightPct = (s.value / max) * 100;
                return (
                  <div
                    key={sIdx}
                    className={`w-full mx-1 ${s.color} opacity-80 group-hover:opacity-100 transition-all duration-300 relative`}
                    style={{ height: `${heightPct}%` }}
                  >
                    {/* Separator line */}
                    {sIdx < item.series.length - 1 && (
                      <div className="absolute top-0 left-0 right-0 h-px bg-white opacity-20"></div>
                    )}
                  </div>
                );
              })}
              {/* Highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30 z-10 pointer-events-none"></div>

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] font-medium py-1.5 px-2.5 rounded-lg transition-all duration-200 whitespace-nowrap z-20 shadow-xl pointer-events-none flex flex-col items-center">
                <span className="font-bold mb-0.5">
                  {total.toLocaleString()} total
                </span>
                <span className="text-slate-300 text-[9px] uppercase tracking-wide">
                  {item.series
                    .map(
                      (s) =>
                        `${s.label.charAt(0)}:${(s.value / 1000).toFixed(0)}k`,
                    )
                    .join(' ')}
                </span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-slate-800 rotate-45"></div>
              </div>
            </div>
            <span className="mt-2 text-[10px] uppercase font-semibold text-slate-400 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// KPI Card
export const KpiCard: React.FC<{
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  chartData?: number[];
  color?: string;
  footer?: string;
}> = ({
  title,
  value,
  trend,
  trendUp,
  icon,
  chartData,
  color = '#3b82f6',
  footer,
}) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
          {icon}
        </div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
      </div>
      {trend && (
        <div
          className={`flex items-center text-xs font-bold px-2 py-1 rounded-full border ${
            trendUp
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}
        >
          {trendUp ? (
            <ArrowUp size={12} className="mr-1" />
          ) : (
            <ArrowDown size={12} className="mr-1" />
          )}
          {trend}
        </div>
      )}
    </div>

    <div className="flex items-baseline space-x-2 mb-4">
      <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
        {value}
      </h3>
    </div>

    {chartData && (
      <div className="-ml-1 -mr-1">
        <AreaChart data={chartData} color={color} height={40} />
      </div>
    )}

    {footer && (
      <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400 flex items-center">
        <Activity size={12} className="mr-1.5" />
        {footer}
      </div>
    )}
  </div>
);
