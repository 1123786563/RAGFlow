import {
  ArrowDown,
  ArrowUp,
  Filter,
  Globe,
  Search,
  Settings,
  Shield,
  Smartphone,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { SecurityApi } from '../api';
import { Session } from '../types/system';

const Security: React.FC = () => {
  const MOCK_SESSIONS = SecurityApi.sessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Session;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter Logic
  const filteredSessions = MOCK_SESSIONS.filter((session) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      session.user.toLowerCase().includes(searchLower) ||
      session.ip.includes(searchLower) ||
      session.device.toLowerCase().includes(searchLower)
    );
  });

  // Sort Logic
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof Session) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const RenderSortIcon = ({ column }: { column: keyof Session }) => {
    if (sortConfig?.key !== column) return <div className="w-4 h-4 ml-1" />;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={14} className="ml-1 text-brand-600" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-brand-600" />
    );
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Active Sessions */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <UserCheck className="mr-2 text-brand-600" size={20} />
            在线会话管理 (Active Sessions)
          </h3>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="搜索用户、IP 或设备..."
              className="pl-9 pr-8 py-1.5 w-full border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                {[
                  { label: '用户', key: 'user' },
                  { label: 'IP 地址', key: 'ip' },
                  { label: '设备', key: 'device' },
                  { label: '登录时间', key: 'time' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    onClick={() => handleSort(col.key as keyof Session)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      <RenderSortIcon column={col.key as keyof Session} />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedSessions.length > 0 ? (
                sortedSessions.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {s.user}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono">
                      {s.ip}
                    </td>
                    <td className="px-4 py-3 text-slate-600 flex items-center">
                      {s.device.toLowerCase().includes('iphone') ||
                      s.device.toLowerCase().includes('android') ? (
                        <Smartphone size={14} className="mr-2 text-slate-400" />
                      ) : (
                        <Globe size={14} className="mr-2 text-slate-400" />
                      )}
                      {s.device}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{s.time}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded transition-colors">
                        强制下线
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center">
                      <Filter size={24} className="text-slate-300 mb-2" />
                      <p>未找到匹配的会话</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-slate-400 text-right">
          共 {sortedSessions.length} 个活跃会话
        </div>
      </div>

      {/* Content Moderation (Enhanced Extension #9) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <Shield className="mr-2 text-brand-600" size={20} />
          敏感词库与 DLP 策略 (Ext #9)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-700">
                敏感词过滤 (Keywords)
              </h4>
              <div className="flex gap-2 items-center">
                <button className="text-xs text-brand-600 flex items-center">
                  <Settings size={12} className="mr-1" /> Import CSV
                </button>
                <div className="w-10 h-5 bg-brand-600 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              支持正则匹配。策略: <b>Block & Audit</b>
            </p>
            <textarea
              className="w-full text-xs p-2 border border-slate-200 rounded font-mono"
              rows={3}
              placeholder="confidential, internal use only, password, ^sk-.*"
            ></textarea>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-700">PII 隐私保护 (DLP)</h4>
              <div className="w-10 h-5 bg-slate-300 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              自动识别并掩码替换隐私信息。策略: <b>Masking (***)</b>
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked
                  className="rounded text-brand-600"
                />{' '}
                <span className="text-xs">Email Addresses</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked
                  className="rounded text-brand-600"
                />{' '}
                <span className="text-xs">Phone Numbers</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked
                  className="rounded text-brand-600"
                />{' '}
                <span className="text-xs">Credit Card Numbers</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
