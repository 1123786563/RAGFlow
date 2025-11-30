import {
  Briefcase,
  Calendar,
  CheckCircle,
  CreditCard,
  Download,
  FileText,
} from 'lucide-react';
import React, { useState } from 'react';
import { SysExtApi, TenantApi } from './api/index';

export const TenancyView: React.FC = () => {
  const TENANTS = TenantApi.list();
  const INVOICES = SysExtApi.invoices();
  const [activeTab, setActiveTab] = useState<'tenants' | 'billing'>('tenants');

  const renderTenants = () => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <Briefcase className="mr-2 text-brand-600" size={20} />
          租户列表 (Tenants)
        </h3>
        <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          管理列
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">租户名称</th>
              <th className="px-4 py-3">模型配置 (LLM / Embed)</th>
              <th className="px-4 py-3">可用解析器</th>
              <th className="px-4 py-3">积分 (Credit)</th>
              <th className="px-4 py-3">创建时间</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TENANTS.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">
                  <div>{t.name}</div>
                  <div
                    className="text-xs text-slate-400 font-mono mt-0.5 max-w-[100px] truncate"
                    title={t.public_key}
                  >
                    {t.public_key || '-'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 w-fit">
                      {t.llm_id}
                    </span>
                    <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100 w-fit">
                      {t.embd_id}
                    </span>
                  </div>
                </td>
                <td
                  className="px-4 py-3 text-slate-600 text-xs max-w-[150px] truncate"
                  title={t.parser_ids}
                >
                  {t.parser_ids}
                </td>
                <td className="px-4 py-3 text-slate-600 font-mono font-medium">
                  <div className="flex items-center">
                    <CreditCard size={12} className="mr-1.5 text-slate-400" />
                    {t.credit}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1.5 text-slate-400" />
                    {t.create_date?.split(' ')[0]}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.status === '1' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {t.status === '1' ? '正常' : '禁用'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-brand-600 hover:underline">
                    配置
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h4 className="text-sm font-medium text-slate-500 uppercase">
            当前余额
          </h4>
          <p className="text-3xl font-bold text-slate-800 mt-2">$1,240.00</p>
          <button className="mt-4 w-full py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700">
            充值 (Top Up)
          </button>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h4 className="text-sm font-medium text-slate-500 uppercase">
            当前套餐
          </h4>
          <p className="text-xl font-bold text-slate-800 mt-2">
            Enterprise Pro
          </p>
          <div className="text-xs text-slate-500 mt-1">
            Next billing: Dec 01, 2025
          </div>
          <button className="mt-4 w-full py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
            变更套餐
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          账单历史 (Invoices)
        </h3>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Invoice ID</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {INVOICES.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-3 font-mono">{inv.id}</td>
                <td className="px-4 py-3">{inv.period}</td>
                <td className="px-4 py-3 font-bold">
                  ${inv.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-slate-400 hover:text-brand-600">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* License Info */}
      <div className="bg-gradient-to-r from-brand-600 to-blue-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold flex items-center mb-2">
              <FileText className="mr-2" size={20} /> 企业版授权 (Enterprise
              License)
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              License ID: LIC-2025-8839-XJ92
            </p>
            <div className="flex gap-4">
              <div className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <span className="text-xs text-blue-100 block">有效期至</span>
                <span className="font-mono font-bold">2026-12-31</span>
              </div>
              <div className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <span className="text-xs text-blue-100 block">租户限额</span>
                <span className="font-mono font-bold">500</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 p-2 rounded-full">
            <CheckCircle size={32} className="text-green-400" />
          </div>
        </div>
      </div>

      <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'tenants' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
        >
          租户管理
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'billing' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
        >
          计费中心 (Ext #7)
        </button>
      </div>

      {activeTab === 'tenants' ? renderTenants() : renderBilling()}
    </div>
  );
};
