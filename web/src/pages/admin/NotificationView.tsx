import {
  Edit,
  Mail,
  Plus,
  ToggleLeft,
  ToggleRight,
  Variable,
} from 'lucide-react';
import React from 'react';
import { SysExtApi } from './api';

export const NotificationView: React.FC = () => {
  const TEMPLATES = SysExtApi.notificationTemplates();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            通知模版管理 (Notification Templates)
          </h3>
          <p className="text-sm text-slate-500">
            自定义系统各类事件的推送内容。
          </p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm flex items-center">
          <Plus size={16} className="mr-2" /> 新建模版
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg ${tmpl.channel === 'Email' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{tmpl.event}</h4>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Channel: {tmpl.channel}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className={`text-2xl ${tmpl.active ? 'text-green-500' : 'text-slate-300'}`}
                >
                  {tmpl.active ? <ToggleRight /> : <ToggleLeft />}
                </button>
                <button className="text-slate-400 hover:text-brand-600 p-2 hover:bg-slate-50 rounded">
                  <Edit size={16} />
                </button>
              </div>
            </div>

            {tmpl.subject && (
              <div className="mb-2 text-sm">
                <span className="font-semibold text-slate-600">Subject: </span>
                <span className="text-slate-800">{tmpl.subject}</span>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-xs text-slate-600 whitespace-pre-wrap mb-3">
              {tmpl.template}
            </div>

            <div className="flex items-center gap-2">
              <Variable size={12} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">
                Available Variables:
              </span>
              {tmpl.variables.map((v) => (
                <span
                  key={v}
                  className="text-[10px] bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200"
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
