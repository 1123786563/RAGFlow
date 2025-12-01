import { FileJson, X } from 'lucide-react';
import React from 'react';
import { AuditLog } from './AuditTable';

interface AuditDetailModalProps {
  log: AuditLog | null;
  onClose: () => void;
}

/**
 * 审计日志详情模态框
 * 展示审计日志的详细信息
 */
export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  log,
  onClose,
}) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <FileJson size={18} className="mr-2 text-brand-600" />
            日志详情
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-xs text-slate-500 block mb-1">时间戳</span>
              <span className="text-sm font-mono text-slate-800">
                {log.timestamp}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block mb-1">操作 ID</span>
              <span className="text-sm font-mono text-slate-800">{log.id}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block mb-1">操作人</span>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] font-bold mr-2">
                  {log.operator.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-800">
                  {log.operator}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 block mb-1">来源 IP</span>
              <span className="text-sm font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded w-fit">
                {log.ip}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">
                变更详情 (Metadata)
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {log.status}
              </span>
            </div>
            <div className="p-4 bg-slate-50/50 font-mono text-xs text-slate-600 overflow-x-auto">
              <pre>
                {JSON.stringify(
                  {
                    module: log.module,
                    action: log.action,
                    target: log.target,
                    details: log.details || 'No additional details available.',
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
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
