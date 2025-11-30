import {
  AlertCircle,
  Clock,
  GitMerge,
  Layers,
  Search,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import React from 'react';
import { AnalyticsApi } from '../../../api';
import { CardHeader, ColumnChart, KpiCard } from '../components/Charts';

interface InteractionViewProps {
  subTab: string;
}

export const InteractionView: React.FC<InteractionViewProps> = ({ subTab }) => {
  const CHAT_ACTIVITY_HOURLY = AnalyticsApi.chatActivity();
  const POPULAR_TOPICS = AnalyticsApi.topics();
  const LOW_CONFIDENCE_QUERIES = AnalyticsApi.lowConfidence();
  const SLOWEST_DOCS = AnalyticsApi.slowDocs();

  const renderChatStats = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="活跃用户 (DAU)"
          value="342"
          trend="+5%"
          trendUp={true}
          icon={<Users size={18} />}
        />
        <KpiCard
          title="平均会话时长"
          value="8分 12秒"
          trend="-2%"
          trendUp={false}
          icon={<Clock size={18} />}
        />
        <KpiCard
          title="平均轮数/会话"
          value="14.5"
          trend="+1.2"
          trendUp={true}
          icon={<Layers size={18} />}
        />
      </div>

      {/* Hourly Activity */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <CardHeader
          title="高峰使用时段"
          subtitle="按小时分布的用户活动 (UTC)"
          action={
            <div className="flex space-x-2 text-xs">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-brand-200 mr-1.5 rounded-full"></div>{' '}
                低活跃
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-brand-500 mr-1.5 rounded-full"></div>{' '}
                高活跃
              </span>
            </div>
          }
        />
        <ColumnChart data={CHAT_ACTIVITY_HOURLY} color="bg-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSAT */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader title="用户满意度 (CSAT)" />
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                />
                <path
                  className="text-green-500"
                  strokeDasharray="85, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-slate-800">4.2</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">
                  满分 5
                </span>
              </div>
            </div>
            <div className="flex w-full justify-around px-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">85%</div>
                <div className="text-xs text-green-600 font-medium">好评</div>
              </div>
              <div className="w-px bg-slate-200 h-10"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800">15%</div>
                <div className="text-xs text-slate-400 font-medium">差评</div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader title="热门话题" />
          <ul className="space-y-4">
            {POPULAR_TOPICS.map((t, i) => (
              <li key={i} className="group cursor-default">
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-slate-700 font-medium group-hover:text-brand-600 transition-colors">
                    {t.topic}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400 text-xs">
                      {t.count} 次查询
                    </span>
                    <span
                      className={`text-xs font-bold ${t.trend.startsWith('+') ? 'text-green-600' : 'text-rose-500'}`}
                    >
                      {t.trend}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-brand-500 rounded-full ${t.color}`}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderRetrieval = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* HIT RATE MONITORING SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="全局命中率"
          value="92.4%"
          trend="+1.2%"
          trendUp={true}
          icon={<Target size={18} />}
        />
        <KpiCard
          title="缓存命中率"
          value="35%"
          trend="稳定"
          trendUp={true}
          icon={<Zap size={18} />}
          color="#8b5cf6"
        />
        <KpiCard
          title="无结果率"
          value="7.6%"
          trend="-0.5%"
          trendUp={true}
          icon={<AlertCircle size={18} />}
          color="#ef4444"
        />
        <KpiCard
          title="平均置信度"
          value="0.88"
          trend="+0.02"
          trendUp={true}
          icon={<Search size={18} />}
          color="#10b981"
        />
      </div>

      {/* HIT RATE TREND CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader
            title="检索命中率趋势"
            action={
              <div className="flex items-center space-x-4 text-xs font-medium">
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-green-500 mr-2 rounded-sm"></div>{' '}
                  向量匹配
                </div>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-blue-500 mr-2 rounded-sm"></div>{' '}
                  关键词匹配
                </div>
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-rose-400 mr-2 rounded-sm"></div>{' '}
                  未命中
                </div>
              </div>
            }
          />

          <div className="relative h-64 w-full mt-4">
            {/* Mocking a Stacked Area Chart with CSS/SVG */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              {/* Vector Match (Green - Bottom Layer) */}
              <path
                d="M0,100 L0,40 L16,35 L32,38 L48,30 L64,32 L80,25 L100,28 L100,100 Z"
                fill="#22c55e"
                fillOpacity="0.1"
                stroke="#22c55e"
                strokeWidth="2"
              />

              {/* Keyword Match (Blue - Middle Layer) */}
              <path
                d="M0,100 L0,65 L16,60 L32,62 L48,55 L64,58 L80,50 L100,52 L100,100 Z"
                fill="#3b82f6"
                fillOpacity="0.1"
                stroke="#3b82f6"
                strokeWidth="2"
                style={{ mixBlendMode: 'multiply' }}
              />

              {/* Miss Line (Red) */}
              <path
                d="M0,85 L16,88 L32,82 L48,90 L64,85 L80,92 L100,88"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </svg>
          </div>
        </div>

        {/* EXTENSION: Rerank Score Distribution (Scatter Plot Mock) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader
            title="检索重排序分布"
            subtitle="向量分数 vs 重排序分数"
            action={<GitMerge size={16} className="text-slate-400" />}
          />
          <div className="h-64 w-full relative border-l border-b border-slate-100 p-2">
            <div className="absolute left-2 top-2 text-[10px] text-slate-400 font-medium">
              重排序分 (Rerank)
            </div>
            <div className="absolute right-2 bottom-2 text-[10px] text-slate-400 font-medium">
              向量分 (Vector)
            </div>

            {/* Generate mock scatter points */}
            {Array.from({ length: 30 }).map((_, i) => {
              const vector = Math.random() * 80 + 20; // 20-100
              const rerank =
                vector * (Math.random() * 0.4 + 0.6) +
                (Math.random() * 20 - 10); // Correlation
              const isOutlier = vector > 80 && rerank < 50; // High vector, low rerank (Hallucination risk)

              return (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full ${isOutlier ? 'bg-rose-500' : 'bg-brand-500 opacity-60'}`}
                  style={{
                    left: `${vector}%`,
                    bottom: `${Math.min(100, Math.max(0, rerank))}%`,
                  }}
                  title={`Vector: ${vector.toFixed(0)}, Rerank: ${rerank.toFixed(0)}`}
                ></div>
              );
            })}

            {/* Quadrant lines */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-100 border-r border-dashed border-slate-200"></div>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-100 border-b border-dashed border-slate-200"></div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block mr-1"></span>
            潜在幻觉风险 (高向量分/低重排分)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader title="低置信度查询" subtitle="置信度分数 < 0.5 的查询" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-3 py-2 text-left rounded-l-md">查询词</th>
                  <th className="px-3 py-2 text-right rounded-r-md">分数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LOW_CONFIDENCE_QUERIES.map((q, i) => (
                  <tr key={i}>
                    <td className="px-3 py-3 text-slate-700 font-medium">
                      {q}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-xs font-bold border border-rose-100">
                        {(Math.random() * 0.4 + 0.1).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader title="最慢文档" subtitle="解析和索引耗时" />
          <ul className="divide-y divide-slate-100">
            {SLOWEST_DOCS.map((d, i) => (
              <li
                key={i}
                className="py-3 flex justify-between items-center text-sm group hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-default"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold mr-3 border border-slate-200">
                    {d.charAt(0)}
                  </div>
                  <span className="text-slate-700 font-medium truncate max-w-[200px]">
                    {d}
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-xs">
                  {(Math.random() * 2 + 1).toFixed(1)}s
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return subTab === 'retrieval' ? renderRetrieval() : renderChatStats();
};
