import { Download, Languages, Save, Search, Upload } from 'lucide-react';
import React from 'react';
import { SysExtApi } from '../../../api';

export const I18nView: React.FC = () => {
  const RECORDS = SysExtApi.i18n();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Languages className="mr-2 text-brand-600" size={20} />
              多语言动态配置 (Dynamic i18n)
            </h3>
            <p className="text-sm text-slate-500">
              实时修改系统文案，无需重新部署。
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center">
              <Download size={14} className="mr-1.5" /> 导出 JSON
            </button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center">
              <Upload size={14} className="mr-1.5" /> 导入配置
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-slate-400"
          />
          <input
            placeholder="搜索 Key 或 翻译内容..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">模块 (Module)</th>
                <th className="px-4 py-3 font-medium w-1/3">
                  简体中文 (zh-CN)
                </th>
                <th className="px-4 py-3 font-medium w-1/3">English (en-US)</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RECORDS.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 group">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 select-all">
                    {r.key}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      {r.module}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      defaultValue={r.zh}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none py-1"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      defaultValue={r.en}
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none py-1"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-brand-600 hover:text-brand-800 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Save size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
