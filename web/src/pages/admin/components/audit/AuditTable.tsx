import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Search,
} from 'lucide-react';
import React from 'react';

/**
 * 审计日志类型定义
 */
export interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  module: string;
  action: string;
  target: string;
  status: 'Success' | 'Failure';
  ip: string;
  details?: any;
}

interface SortConfig {
  key: keyof AuditLog | null;
  direction: 'asc' | 'desc';
}

interface AuditTableProps {
  logs: AuditLog[];
  sortConfig: SortConfig;
  onSort: (key: keyof AuditLog) => void;
  onViewDetail: (log: AuditLog) => void;
}

/**
 * 审计日志表格组件
 * 展示审计日志数据，支持排序和详情查看
 */
export const AuditTable: React.FC<AuditTableProps> = ({
  logs,
  sortConfig,
  onSort,
  onViewDetail,
}) => {
  /**
   * 渲染排序图标
   */
  const SortIcon = ({ column }: { column: keyof AuditLog }) => {
    if (sortConfig.key !== column)
      return (
        <div className="w-4 h-4 ml-1 inline-block opacity-0 group-hover:opacity-30">
          <ChevronDown size={14} />
        </div>
      );
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={14} className="ml-1 inline-block text-brand-600" />
    ) : (
      <ChevronDown size={14} className="ml-1 inline-block text-brand-600" />
    );
  };

  /**
   * 渲染表头
   */
  const renderHeader = (label: string, key: keyof AuditLog) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors select-none"
      onClick={() => onSort(key)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon column={key} />
      </div>
    </th>
  );

  /**
   * 获取模块样式类
   */
  const getModuleClass = (module: string) => {
    switch (module) {
      case 'User':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'KB':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'System':
        return 'bg-slate-50 border-slate-200 text-slate-700';
      default:
        return 'bg-orange-50 border-orange-200 text-orange-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in-up flex flex-col min-h-[500px]">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {renderHeader('时间戳', 'timestamp')}
              {renderHeader('操作人', 'operator')}
              {renderHeader('模块', 'module')}
              {renderHeader('动作', 'action')}
              {renderHeader('对象', 'target')}
              {renderHeader('状态', 'status')}
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                IP 地址
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                详情
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {log.operator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full border ${getModuleClass(log.module)}`}
                    >
                      {log.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                    {log.action}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 max-w-xs truncate"
                    title={log.target}
                  >
                    {log.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`flex items-center text-sm font-medium ${log.status === 'Success' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {log.status === 'Success' ? (
                        <CheckCircle size={14} className="mr-1.5" />
                      ) : (
                        <AlertCircle size={14} className="mr-1.5" />
                      )}
                      {log.status === 'Success' ? '成功' : '失败'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetail(log)}
                      className="text-slate-400 hover:text-brand-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center">
                    <Search size={32} className="text-slate-300 mb-2" />
                    <p>未找到符合条件的审计日志。</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
