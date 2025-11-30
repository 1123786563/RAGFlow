import { Calendar, Download, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { InteractionView } from './interaction/InteractionView';
import { OverviewView } from './overview/OverviewView';
import { ResourceView } from './resource/ResourceView';

interface AnalyticsViewProps {
  tab: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tab }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('default');

  useEffect(() => {
    setActiveSubTab('default');
  }, [tab]);

  let resolvedView = tab;
  if (tab === 'stats-resource') {
    resolvedView = activeSubTab === 'default' ? 'token' : activeSubTab;
  } else if (tab === 'stats-interaction') {
    resolvedView = activeSubTab === 'default' ? 'chat' : activeSubTab;
  }

  const renderTabs = () => {
    const tabs =
      tab === 'stats-resource'
        ? [
            { id: 'token', label: 'Token 使用' },
            { id: 'storage', label: '存储分析' },
          ]
        : [
            { id: 'chat', label: '对话指标' },
            { id: 'retrieval', label: '检索性能' },
          ];

    if (tab === 'stats-overview') return null;

    return (
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                resolvedView === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Header Actions Toolbar
  const renderActions = () => (
    <div className="flex space-x-2">
      <button className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
        <Calendar size={16} className="mr-2 text-slate-400" />
        最近30天
      </button>
      <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
        <Download size={18} />
      </button>
      <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
        <RefreshCw size={18} />
      </button>
    </div>
  );

  const getPageTitle = () => {
    switch (tab) {
      case 'stats-overview':
        return { title: '数据概览', desc: '实时系统性能与核心指标。' };
      case 'stats-resource':
        return { title: '资源消耗', desc: '计算与存储成本的详细细分。' };
      case 'stats-interaction':
        return { title: '交互分析', desc: '深入了解用户参与度和检索质量。' };
      default:
        return { title: '数据分析', desc: '' };
    }
  };

  const headerInfo = getPageTitle();

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-12 px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {headerInfo.title}
          </h2>
          <p className="text-slate-500 mt-2 text-lg">{headerInfo.desc}</p>
        </div>
        <div className="mt-4 md:mt-0">{renderActions()}</div>
      </div>

      {tab !== 'stats-overview' && renderTabs()}

      <div className="animate-fade-in-up">
        {tab === 'stats-overview' && <OverviewView />}
        {tab === 'stats-resource' && <ResourceView subTab={resolvedView} />}
        {tab === 'stats-interaction' && (
          <InteractionView subTab={resolvedView} />
        )}
      </div>
    </div>
  );
};
