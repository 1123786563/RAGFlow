import {
  Bell,
  Globe,
  Layout,
  Link,
  Mail,
  MessageSquare,
  Save,
  Upload,
} from 'lucide-react';
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'notifications' | 'domain'
  >('general');
  const [loading, setLoading] = useState(false);

  // Mock State for Form
  const [generalConfig, setGeneralConfig] = useState({
    systemName: 'RAGFlow Enterprise',
    language: 'zh-CN',
    footerText: '© 2025 RAGFlow Inc. All rights reserved.',
    themeColor: '#3b82f6',
    logoUrl: '',
  });

  const [notifyConfig, setNotifyConfig] = useState({
    emailEnabled: true,
    smtpHost: 'smtp.office365.com',
    smtpPort: '587',
    smtpUser: 'alerts@ragflow.com',
    webhookEnabled: false,
    webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/...',
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const renderGeneral = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <Layout className="mr-2 text-brand-600" size={20} />
          品牌与外观 (White Labeling)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              系统名称
            </label>
            <input
              type="text"
              value={generalConfig.systemName}
              onChange={(e) =>
                setGeneralConfig({
                  ...generalConfig,
                  systemName: e.target.value,
                })
              }
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">
              显示在浏览器标题栏和登录页
            </p>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              默认语言
            </label>
            <select
              value={generalConfig.language}
              onChange={(e) =>
                setGeneralConfig({ ...generalConfig, language: e.target.value })
              }
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            >
              <option value="zh-CN">简体中文 (Zh-CN)</option>
              <option value="en-US">English (En-US)</option>
              <option value="ja-JP">日本語 (Ja-JP)</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              系统 Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-slate-50 transition-colors">
                  <Upload size={20} className="text-slate-400 mb-1" />
                  <span className="text-sm text-slate-600">
                    点击上传新 Logo (PNG/SVG)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              页脚版权信息
            </label>
            <input
              type="text"
              value={generalConfig.footerText}
              onChange={(e) =>
                setGeneralConfig({
                  ...generalConfig,
                  footerText: e.target.value,
                })
              }
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* Email Config */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Mail className="mr-2 text-brand-600" size={20} />
            邮件通知 (SMTP)
          </h3>
          <div className="flex items-center">
            <span className="text-sm text-slate-600 mr-2">
              {notifyConfig.emailEnabled ? '已启用' : '已禁用'}
            </span>
            <button
              onClick={() =>
                setNotifyConfig((prev) => ({
                  ...prev,
                  emailEnabled: !prev.emailEnabled,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifyConfig.emailEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${notifyConfig.emailEnabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${!notifyConfig.emailEnabled && 'opacity-50 pointer-events-none'}`}
        >
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              SMTP 服务器地址
            </label>
            <input
              type="text"
              value={notifyConfig.smtpHost}
              onChange={(e) =>
                setNotifyConfig({ ...notifyConfig, smtpHost: e.target.value })
              }
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              端口 (Port)
            </label>
            <input
              type="text"
              value={notifyConfig.smtpPort}
              onChange={(e) =>
                setNotifyConfig({ ...notifyConfig, smtpPort: e.target.value })
              }
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              用户名 / 发件人
            </label>
            <input
              type="text"
              value={notifyConfig.smtpUser}
              onChange={(e) =>
                setNotifyConfig({ ...notifyConfig, smtpUser: e.target.value })
              }
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value="********"
              readOnly
              className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm bg-slate-50 text-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Webhook Config */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <MessageSquare className="mr-2 text-brand-600" size={20} />
            即时通讯通知 (Webhook)
          </h3>
          <div className="flex items-center">
            <span className="text-sm text-slate-600 mr-2">
              {notifyConfig.webhookEnabled ? '已启用' : '已禁用'}
            </span>
            <button
              onClick={() =>
                setNotifyConfig((prev) => ({
                  ...prev,
                  webhookEnabled: !prev.webhookEnabled,
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifyConfig.webhookEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${notifyConfig.webhookEnabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        <div
          className={`${!notifyConfig.webhookEnabled && 'opacity-50 pointer-events-none'}`}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Webhook URL (飞书 / 钉钉 / Slack)
          </label>
          <input
            type="text"
            value={notifyConfig.webhookUrl}
            onChange={(e) =>
              setNotifyConfig({ ...notifyConfig, webhookUrl: e.target.value })
            }
            placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..."
            className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono text-slate-600"
          />
          <p className="text-xs text-slate-400 mt-2">
            系统将向该地址发送 JSON
            格式的告警信息。支持主流办公软件的自定义机器人。
          </p>
        </div>
      </div>
    </div>
  );

  const renderDomain = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 flex items-center mb-6">
          <Link className="mr-2 text-brand-600" size={20} />
          自定义域名与证书 (Extension #6)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              自定义域名 (CNAME)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ai.yourcompany.com"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
              <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm">
                验证
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-700 text-sm">SSL 证书</h4>
              <p className="text-xs text-slate-500">
                Auto-managed by Let's Encrypt
              </p>
            </div>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'general' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          <Globe size={16} className="mr-2" /> 通用设置
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'notifications' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          <Bell size={16} className="mr-2" /> 通知集成
        </button>
        <button
          onClick={() => setActiveTab('domain')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'domain' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          <Link size={16} className="mr-2" /> 域名配置
        </button>
      </div>

      {activeTab === 'general' && renderGeneral()}
      {activeTab === 'notifications' && renderNotifications()}
      {activeTab === 'domain' && renderDomain()}

      {/* Save Action */}
      <div className="fixed bottom-6 right-6 z-20 md:absolute md:bottom-auto md:right-0 md:top-0 md:h-10">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center px-6 py-2.5 bg-brand-600 text-white rounded-lg font-medium shadow-lg hover:bg-brand-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              保存中...
            </span>
          ) : (
            <>
              <Save size={18} className="mr-2" /> 保存配置
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
