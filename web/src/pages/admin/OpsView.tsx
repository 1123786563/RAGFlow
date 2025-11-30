import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Megaphone,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import React from 'react';
import { SysExtApi } from './api';

export const OpsView: React.FC = () => {
  const HEALTH = SysExtApi.health();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Extension #8: System Health Diagnostics */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Activity className="mr-2 text-brand-600" size={20} />
            系统健康诊断中心 (Diagnostics - Ext #8)
          </h3>
          <button className="text-brand-600 text-sm font-medium hover:underline">
            一键诊断
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {HEALTH.map((comp, i) => (
            <div
              key={i}
              className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-700 text-sm">
                  {comp.component}
                </span>
                {comp.status === 'Healthy' ? (
                  <CheckCircle size={16} className="text-green-500" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-xl font-bold ${comp.status === 'Healthy' ? 'text-slate-800' : 'text-amber-600'}`}
                >
                  {comp.latency}
                </span>
                <span className="text-xs text-slate-400">latency</span>
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-slate-500 border-t border-slate-200 pt-2">
                <span>Ver: {comp.version}</span>
                <span>Up: {comp.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extension #4: Data Retention */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-4">
          <Clock className="mr-2 text-brand-600" size={20} />
          数据生命周期策略 (Retention - Ext #4)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h4 className="font-bold text-slate-700 text-sm">审计日志归档</h4>
              <p className="text-xs text-slate-500">
                将超过保留期的日志迁移至冷存储。
              </p>
            </div>
            <select className="text-sm border border-slate-300 rounded px-2 py-1 bg-white">
              <option>保留 6 个月</option>
              <option>保留 1 年</option>
              <option>永久保留</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h4 className="font-bold text-slate-700 text-sm">临时文件清理</h4>
              <p className="text-xs text-slate-500">
                自动删除解析过程中产生的中间文件。
              </p>
            </div>
            <select className="text-sm border border-slate-300 rounded px-2 py-1 bg-white">
              <option>24 小时后</option>
              <option>7 天后</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backups */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Database className="mr-2 text-brand-600" size={20} />
            数据备份与恢复 (Backups)
          </h3>
          <button className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
            + 创建快照
          </button>
        </div>
        <div className="space-y-3">
          {[
            {
              name: 'Auto_Daily_20251129',
              size: '2.4 GB',
              time: 'Today 03:00',
              type: 'System',
            },
            {
              name: 'Manual_Before_Upgrade',
              size: '2.3 GB',
              time: 'Yesterday 18:00',
              type: 'Manual',
            },
          ].map((b, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 text-blue-600 rounded mr-3">
                  <Database size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{b.name}</p>
                  <p className="text-xs text-slate-500">
                    {b.time} · {b.size} · {b.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded text-slate-600 flex items-center">
                  <RotateCcw size={12} className="mr-1" /> 恢复
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Megaphone className="mr-2 text-brand-600" size={20} />
            系统公告管理 (Announcements)
          </h3>
          <button className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center">
            <Plus size={16} className="mr-1" /> 发布公告
          </button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {[
            {
              title: '系统维护通知：今晚 22:00',
              status: 'Active',
              type: 'Warning',
              date: '2025-11-29',
            },
            {
              title: 'RAGFlow v2.5 新功能发布',
              status: 'Expired',
              type: 'Info',
              date: '2025-11-20',
            },
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold ${a.type === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {a.type}
                  </span>
                  <h4 className="text-sm font-medium text-slate-800">
                    {a.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400">{a.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs font-medium ${a.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}
                >
                  {a.status}
                </span>
                <button className="text-slate-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
