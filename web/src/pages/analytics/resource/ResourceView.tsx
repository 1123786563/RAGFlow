import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Coins,
  Cpu,
  FileText,
  HardDrive,
  Layers,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import { AnalyticsApi } from '../../../api';
import { CardHeader, KpiCard, StackedBarChart } from '../components/Charts';

interface ResourceViewProps {
  subTab: string;
}

export const ResourceView: React.FC<ResourceViewProps> = ({ subTab }) => {
  const KB_TYPE_DISTRIBUTION = AnalyticsApi.kbDistribution();
  const KB_LIST = AnalyticsApi.kbList();
  const DAILY_TOKEN_USAGE = AnalyticsApi.tokenUsage();
  const MODEL_COSTS = AnalyticsApi.modelCosts();

  const renderStorage = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <HardDrive size={100} />
          </div>
          <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            总存储量
          </h4>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold text-slate-900">48.2</span>
            <span className="text-lg font-medium text-slate-400 ml-1">GB</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
            <div
              className="bg-brand-600 h-2 rounded-full relative"
              style={{ width: '45%' }}
            >
              <div className="absolute right-0 -top-1 w-4 h-4 bg-white border-2 border-brand-600 rounded-full shadow-sm"></div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            100GB 配额已用 45%
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Layers size={18} />
            </div>
            <h4 className="text-sm font-medium text-slate-700">向量索引大小</h4>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-slate-900">12.8 GB</p>
            <span className="text-xs text-green-600 flex items-center font-medium bg-green-50 px-2 py-1 rounded-full">
              <ArrowUp size={12} className="mr-1" /> +1.2GB
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg">
              <FileText size={18} />
            </div>
            <h4 className="text-sm font-medium text-slate-700">源文档</h4>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-slate-900">35.4 GB</p>
            <span className="text-xs text-slate-500 font-medium">
              3,402 个文件
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FILE DISTRIBUTION */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader title="按类型分布" />
          <div className="space-y-6">
            {KB_TYPE_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-700 font-semibold flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${item.color}`}
                    ></div>
                    {item.label}
                  </span>
                  <span className="text-slate-900 font-bold">
                    {item.value}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-80`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KNOWLEDGE BASE LIST */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <CardHeader
            title="最大知识库"
            action={
              <button className="text-brand-600 text-sm font-medium hover:underline flex items-center">
                查看全部 <ChevronRight size={14} />
              </button>
            }
          />
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">名称</th>
                  <th className="px-4 py-3">文档数</th>
                  <th className="px-4 py-3">向量大小</th>
                  <th className="px-4 py-3 rounded-r-lg">源大小</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {KB_LIST.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800 flex items-center">
                      <div
                        className={`w-8 h-8 rounded-lg ${row.color} text-white flex items-center justify-center text-xs font-bold mr-3 shadow-sm`}
                      >
                        {row.icon}
                      </div>
                      {row.name}
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-mono">
                      {row.docs}
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-mono">
                      {row.vec}
                    </td>
                    <td className="px-4 py-4 text-slate-600 font-mono">
                      {row.src}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderToken = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* BUDGET FORECAST EXTENSION */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 p-6 opacity-10">
          <TrendingUp size={140} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h3 className="text-slate-300 font-medium text-sm uppercase tracking-wider mb-2">
              本月成本预测 (Budget Forecast)
            </h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold">$128.40</span>
              <span className="text-slate-400">/ $200.00 (预算)</span>
            </div>
            <div className="mt-4 w-full md:w-96 bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full"
                style={{ width: '64%' }}
              ></div>
              {/* Forecast Marker */}
              <div
                className="bg-yellow-400 h-full w-1 absolute"
                style={{
                  left: '85%',
                  top: 0,
                  bottom: 0,
                  height: '100%',
                  opacity: 0.8,
                }}
                title="预计月末"
              ></div>
            </div>
            <div className="flex justify-between w-full md:w-96 text-xs text-slate-400 mt-1">
              <span>当前: 64%</span>
              <span className="text-yellow-400">预测: 85%</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
              <p className="text-xs text-slate-300">每日平均消耗</p>
              <p className="text-xl font-bold">$4.28</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="总 Token (30天)"
          value="4.2M"
          trend="15%"
          trendUp={true}
          icon={<Cpu size={18} />}
          chartData={[10, 20, 15, 25, 30, 25, 40]}
        />
        <KpiCard
          title="提示词 Token"
          value="3.1M"
          trend="占比 74%"
          trendUp={true}
          icon={<ArrowUp size={18} />}
          color="#8b5cf6"
          chartData={[15, 18, 20, 22, 25, 28, 30]}
        />
        <KpiCard
          title="补全 Token"
          value="1.1M"
          trend="占比 26%"
          trendUp={true}
          icon={<ArrowDown size={18} />}
          color="#10b981"
          chartData={[5, 8, 6, 9, 10, 8, 12]}
        />
        <KpiCard
          title="每千次调用成本"
          value="$0.042"
          trend="-2%"
          trendUp={true}
          icon={<Coins size={18} />}
          color="#f59e0b"
          chartData={[40, 50, 45, 60, 55, 70, 65]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Usage Chart with Stacked Bar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <CardHeader
            title="每日 Token 消耗"
            subtitle="提示词（输入）与补全（输出）Token 细分"
            action={
              <div className="flex space-x-2 text-xs">
                <span className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-brand-500 mr-1.5 rounded-sm"></div>{' '}
                  输入
                </span>
                <span className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-emerald-500 mr-1.5 rounded-sm"></div>{' '}
                  输出
                </span>
              </div>
            }
          />
          <StackedBarChart data={DAILY_TOKEN_USAGE} />
        </div>

        {/* Cost by Model */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <CardHeader title="模型成本细分" />
          <div className="space-y-6 flex-1">
            {MODEL_COSTS.map((model, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2 items-end">
                  <span className="font-bold text-slate-700">{model.name}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-900 font-mono font-bold">
                      ${model.cost.toFixed(2)}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {model.tokens} tokens
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full ${model.color} rounded-full`}
                    style={{ width: model.width }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center flex items-center justify-center">
            <AlertCircle size={12} className="mr-1.5" />{' '}
            包含适用的输入缓存折扣。
          </div>
        </div>
      </div>
    </div>
  );

  return subTab === 'storage' ? renderStorage() : renderToken();
};
