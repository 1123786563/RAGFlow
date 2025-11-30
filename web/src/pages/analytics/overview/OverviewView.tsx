import {
  Calendar,
  Cpu,
  Database,
  DollarSign,
  MessageSquare,
  Server,
  Zap,
} from 'lucide-react';
import React from 'react';
import { AnalyticsApi } from '../../../api';
import { AreaChart, CardHeader, KpiCard } from '../components/Charts';

export const OverviewView: React.FC = () => {
  const OVERVIEW_DATA = AnalyticsApi.overview();
  // Generate mock heatmap data
  const heatmapData = Array.from({ length: 52 * 7 }, (_, i) =>
    Math.random() > 0.6 ? Math.floor(Math.random() * 4) : 0,
  );

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-slate-100';
      case 1:
        return 'bg-brand-200';
      case 2:
        return 'bg-brand-400';
      case 3:
        return 'bg-brand-600';
      default:
        return 'bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="总对话数"
          value="1,284"
          trend="12.5%"
          trendUp={true}
          icon={<MessageSquare size={18} />}
          chartData={OVERVIEW_DATA.totalChats}
          color="#3b82f6"
          footer="对比前7天"
        />
        <KpiCard
          title="平均响应时间"
          value="210ms"
          trend="8.2%"
          trendUp={true}
          icon={<Zap size={18} />}
          chartData={[250, 240, 230, 220, 215, 210, 205]}
          color="#10b981"
          footer="延迟优化已启用"
        />
        <KpiCard
          title="已索引文档"
          value="3,402"
          trend="1.2%"
          trendUp={true}
          icon={<Database size={18} />}
          chartData={[3300, 3320, 3340, 3350, 3380, 3400, 3402]}
          color="#8b5cf6"
          footer="4 个待处理"
        />
        <KpiCard
          title="预计月度成本"
          value="$42.50"
          trend="5.4%"
          trendUp={false}
          icon={<DollarSign size={18} />}
          chartData={OVERVIEW_DATA.apiCosts}
          color="#f59e0b"
          footer="预算使用率: 21%"
        />
      </div>

      {/* HEATMAP EXTENSION */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <CardHeader
          title="用户活跃热力图"
          subtitle="过去 12 个月的系统活跃度分布"
          action={<Calendar size={16} className="text-slate-400" />}
        />
        <div className="w-full overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {Array.from({ length: 52 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getIntensityClass(heatmapData[weekIndex * 7 + dayIndex])} hover:ring-2 ring-slate-300 transition-all cursor-pointer`}
                    title={`Activity Level: ${heatmapData[weekIndex * 7 + dayIndex]}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end items-center mt-3 text-xs text-slate-500 gap-2">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-brand-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-brand-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-brand-600 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* MAIN CHART + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader
            title="系统流量与负载"
            subtitle="对比用户请求与系统资源利用率"
            action={
              <select className="text-xs border-slate-200 rounded-lg p-1.5 text-slate-600 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
                <option>最近7天</option>
                <option>最近30天</option>
              </select>
            }
          />
          <div className="h-72 w-full">
            <AreaChart
              data={[40, 65, 45, 80, 55, 90, 75, 100, 85, 120]}
              color="#3b82f6"
              height={280}
              showGrid={true}
            />
          </div>
        </div>

        {/* STATUS & ALERTS */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <CardHeader title="系统健康度" />
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#22c55e"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="351.86"
                    strokeDashoffset="10"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">98%</span>
                  <span className="text-xs text-slate-500 uppercase font-medium">
                    在线率
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-600">
                  <Server size={14} className="mr-2 text-slate-400" /> API 网关
                </span>
                <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-full">
                  运行正常
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-600">
                  <Database size={14} className="mr-2 text-slate-400" />{' '}
                  向量数据库
                </span>
                <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-full">
                  运行正常
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center text-slate-600">
                  <Cpu size={14} className="mr-2 text-slate-400" /> LLM 服务
                </span>
                <span className="text-amber-600 font-medium text-xs bg-amber-50 px-2 py-0.5 rounded-full">
                  高延迟
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
