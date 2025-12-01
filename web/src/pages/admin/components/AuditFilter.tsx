import { Calendar, Download, Filter, Search, X } from 'lucide-react';
import React from 'react';

interface AuditFilterProps {
  filters: {
    module: string;
    status: string;
    operator: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (filters: AuditFilterProps['filters']) => void;
  onClearFilters: () => void;
  onExport: () => void;
}

/**
 * 审计日志筛选组件
 * 提供模块、状态、操作人、日期范围等筛选功能
 */
export const AuditFilter: React.FC<AuditFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExport,
}) => {
  const handleFilterChange = (
    key: keyof AuditFilterProps['filters'],
    value: string,
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center">
          <Filter size={14} className="mr-2" />
          筛选审计日志
        </h3>
        <div className="flex gap-3">
          <button
            onClick={onExport}
            className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 hover:text-brand-600 flex items-center transition-colors shadow-sm"
          >
            <Download size={12} className="mr-1.5" /> 导出 CSV
          </button>
          <button
            onClick={onClearFilters}
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
            onChange={(e) => handleFilterChange('module', e.target.value)}
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
            onChange={(e) => handleFilterChange('status', e.target.value)}
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
              onChange={(e) => handleFilterChange('operator', e.target.value)}
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
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
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
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
            <Calendar
              size={14}
              className="absolute left-3 top-3 text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
