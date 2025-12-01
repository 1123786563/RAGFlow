import { Edit, Mail, ToggleLeft, ToggleRight, Variable } from 'lucide-react';
import React from 'react';
import { NotificationTemplate } from '../types/index';

interface NotificationItemProps {
  template: NotificationTemplate;
  onToggleActive: (id: string) => void;
  onEdit: (id: string) => void;
}

/**
 * 通知模板项组件
 * 渲染单个通知模板，支持激活/禁用和编辑功能
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  template,
  onToggleActive,
  onEdit,
}) => {
  /**
   * 获取渠道样式类
   * @param channel 渠道类型
   * @returns 样式类名
   */
  const getChannelClass = (channel: string) => {
    return channel === 'Email'
      ? 'bg-blue-50 text-blue-600'
      : 'bg-purple-50 text-purple-600';
  };

  return (
    <div
      key={template.id}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-lg ${getChannelClass(template.channel)}`}
          >
            <Mail size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{template.event}</h4>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Channel: {template.channel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleActive(template.id)}
            className={`text-2xl ${template.active ? 'text-green-500' : 'text-slate-300'}`}
            title={template.active ? '禁用模板' : '启用模板'}
          >
            {template.active ? <ToggleRight /> : <ToggleLeft />}
          </button>
          <button
            onClick={() => onEdit(template.id)}
            className="text-slate-400 hover:text-brand-600 p-2 hover:bg-slate-50 rounded"
            title="编辑模板"
          >
            <Edit size={16} />
          </button>
        </div>
      </div>

      {template.subject && (
        <div className="mb-2 text-sm">
          <span className="font-semibold text-slate-600">Subject: </span>
          <span className="text-slate-800">{template.subject}</span>
        </div>
      )}

      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-xs text-slate-600 whitespace-pre-wrap mb-3">
        {template.template}
      </div>

      <div className="flex items-center gap-2">
        <Variable size={12} className="text-slate-400" />
        <span className="text-xs text-slate-500 font-medium">
          Available Variables:
        </span>
        {template.variables.map((v) => (
          <span
            key={v}
            className="text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200"
          >
            {`{{${v}}}`}
          </span>
        ))}
      </div>
    </div>
  );
};
