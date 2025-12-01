import React, { useState } from 'react';
import { LogApi } from './api/index';
import { AuditLog } from './types/index';

// 导入子组件
import { AuditDetailModal } from './components/AuditDetailModal';
import { AuditFilter } from './components/AuditFilter';
import { AuditPagination } from './components/AuditPagination';
import { AuditTable } from './components/AuditTable';

/**
 * 审计日志视图组件
 * 提供审计日志的查看、筛选、排序、分页和导出功能
 */
const AuditView: React.FC = () => {
  // 获取审计日志数据
  const AUDIT_LOGS = LogApi.audit();

  // 筛选状态
  const [filters, setFilters] = useState({
    module: 'All',
    status: 'All',
    operator: '',
    startDate: '',
    endDate: '',
  });

  // 排序状态
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AuditLog | null;
    direction: 'asc' | 'desc';
  }>({
    key: 'timestamp',
    direction: 'desc',
  });

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 详情模态框状态
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  /**
   * 清空筛选条件
   */
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

  /**
   * 筛选日志数据
   */
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

  /**
   * 排序日志数据
   */
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key]
      ? a[sortConfig.key].toString().toLowerCase()
      : '';
    const valB = b[sortConfig.key]
      ? b[sortConfig.key].toString().toLowerCase()
      : '';

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  /**
   * 分页处理
   */
  const totalItems = sortedLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentLogs = sortedLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  /**
   * 处理排序
   */
  const handleSort = (key: keyof AuditLog) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  /**
   * 处理导出
   */
  const handleExport = () => {
    // 导出 CSV 功能
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

  return (
    <div className="space-y-6">
      {/* 筛选组件 */}
      <AuditFilter
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
        onExport={handleExport}
      />

      {/* 表格组件 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in-up flex flex-col min-h-[500px]">
        <AuditTable
          logs={currentLogs}
          sortConfig={sortConfig}
          onSort={handleSort}
          onViewDetail={setSelectedLog}
        />

        {/* 分页组件 */}
        <AuditPagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 详情模态框组件 */}
      <AuditDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default AuditView;
