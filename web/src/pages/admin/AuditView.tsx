import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  FileJson,
  Filter,
  Search,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { LogApi } from './api/index';
import { AuditLog } from './types/index';

export const AuditView: React.FC = () => {
  const AUDIT_LOGS = LogApi.audit();
  const [filters, setFilters] = useState({
    module: 'All',
    status: 'All',
    operator: '',
    startDate: '',
    endDate: '',
  });

  const [sort, setSort] = useState<{
    key: keyof AuditLog | null;
    direction: 'asc' | 'desc';
  }>({
    key: 'timestamp',
    direction: 'desc',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Detail Modal State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const clearFilters = () => {
    setFilters({
      module: 'All',
      status: 'All',
      operator: '',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  };

  // FILTERING
  const filteredLogs = AUDIT_LOGS.filter((log) => {
    if (filters.module !== 'All' && log.module !== filters.module) return false;
    if (filters.status !== 'All' && log.status !== filters.status) return false;
    if (
      filters.operator &&
      !log.operator.toLowerCase().includes(filters.operator.toLowerCase())
    )
      return false;
    const logDate = new Date(log.timestamp);
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      if (logDate < start) return false;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      if (logDate > end) return false;
    }
    return true;
  });

  // SORTING
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sort.key) return 0;
    // @ts-ignore
    const valA = a[sort.key] ? a[sort.key].toString().toLowerCase() : '';
    // @ts-ignore
    const valB = b[sort.key] ? b[sort.key].toString().toLowerCase() : '';

    if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // PAGINATION
  const totalItems = sortedLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentLogs = sortedLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (key: keyof AuditLog) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleExport = () => {
    // Mock export functionality
    const headers = [
      'Timestamp',
      'Operator',
      'Module',
      'Action',
      'Target',
      'Status',
      'IP',
      'Details',
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      headers.join(',') +
      '\n' +
      sortedLogs.map((e) => Object.values(e).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `audit_logs_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortIcon = ({ column }: { column: keyof AuditLog }) => {
    if (sort.key !== column)
      return (
        <div className="w-4 h-4 ml-1 inline-block opacity-0 group-hover:opacity-30">
          <ChevronDown size={14} />
        </div>
      );
    return sort.direction === 'asc' ? (
      <ChevronUp size={14} className="ml-1 inline-block text-brand-600" />
    ) : (
      <ChevronDown size={14} className="ml-1 inline-block text-brand-600" />
    );
  };

  const renderHeader = (label: string, key: keyof AuditLog) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer group hover:bg-slate-100 transition-colors select-none"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon column={key} />
      </div>
    </th>
  );

  return (
    <>
      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center">
            <Filter size={14} className="mr-2" />
            筛选审计日志
          </h3>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-brand-600 flex items-center transition-colors shadow-sm"
            >
              <Download size={12} className="mr-1.5" /> 导出 CSV
            </button>
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-brand-600 flex items-center transition-colors"
            >
              <X size={12} className="mr-1" /> 清空筛选
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              模块
            </label>
            <select
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              value={filters.module}
              onChange={(e) =>
                setFilters({ ...filters, module: e.target.value })
              }
            >
              <option value="All">全部模块</option>
              <option value="User">User (用户)</option>
              <option value="Role">Role (角色)</option>
              <option value="Dept">Dept (部门)</option>
              <option value="KB">KB (知识库)</option>
              <option value="Agent">Agent (智能体)</option>
              <option value="File">File (文件)</option>
              <option value="System">System (系统)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              状态
            </label>
            <select
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="All">全部状态</option>
              <option value="Success">Success (成功)</option>
              <option value="Failure">Failure (失败)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              操作人
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="输入姓名..."
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 pl-9 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                value={filters.operator}
                onChange={(e) =>
                  setFilters({ ...filters, operator: e.target.value })
                }
              />
              <Search
                size={14}
                className="absolute left-3 top-3 text-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              开始日期
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 pl-9 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
              <Calendar
                size={14}
                className="absolute left-3 top-3 text-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              结束日期
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 pl-9 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
              <Calendar
                size={14}
                className="absolute left-3 top-3 text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
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
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
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
                        className={`px-2 py-0.5 text-xs rounded-full border ${
                          log.module === 'User'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : log.module === 'KB'
                              ? 'bg-purple-50 border-purple-200 text-purple-700'
                              : log.module === 'System'
                                ? 'bg-slate-50 border-slate-200 text-slate-700'
                                : 'bg-orange-50 border-orange-200 text-orange-700'
                        }`}
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
                        onClick={() => setSelectedLog(log)}
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

        {/* PAGINATION */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 bg-slate-50 rounded-b-xl">
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-md transition-colors ${
                    currentPage === i + 1
                      ? 'bg-brand-600 text-white border border-brand-600'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <FileJson size={18} className="mr-2 text-brand-600" />
                日志详情
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">
                    时间戳
                  </span>
                  <span className="text-sm font-mono text-slate-800">
                    {selectedLog.timestamp}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">
                    操作 ID
                  </span>
                  <span className="text-sm font-mono text-slate-800">
                    {selectedLog.id}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">
                    操作人
                  </span>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] font-bold mr-2">
                      {selectedLog.operator.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-800">
                      {selectedLog.operator}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">
                    来源 IP
                  </span>
                  <span className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded w-fit">
                    {selectedLog.ip}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">
                    变更详情 (Metadata)
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedLog.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {selectedLog.status}
                  </span>
                </div>
                <div className="p-4 bg-slate-50/50 font-mono text-xs text-slate-600 overflow-x-auto">
                  <pre>
                    {JSON.stringify(
                      {
                        module: selectedLog.module,
                        action: selectedLog.action,
                        target: selectedLog.target,
                        details:
                          selectedLog.details ||
                          'No additional details available.',
                        userAgent:
                          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
