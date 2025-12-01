import { Box, Download, Palette, ToggleLeft } from 'lucide-react';
import React from 'react';

const Extension: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Plugin Marketplace */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <Box className="mr-2 text-brand-600" size={20} />
          插件市场 (Plugin Marketplace)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Unstructured Parser',
              desc: 'Enhanced PDF/HTML parsing capabilities.',
              installed: true,
              author: 'RAGFlow',
            },
            {
              name: 'Slack Connector',
              desc: 'Sync Slack conversations to KB.',
              installed: false,
              author: 'Community',
            },
            {
              name: 'Neo4j Adapter',
              desc: 'Graph database integration for KG.',
              installed: false,
              author: 'RAGFlow',
            },
          ].map((p, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                  <Box size={20} />
                </div>
                {p.installed ? (
                  <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-xs font-bold">
                    已安装
                  </span>
                ) : (
                  <button className="text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-lg text-xs font-bold flex items-center">
                    <Download size={12} className="mr-1" /> 安装
                  </button>
                )}
              </div>
              <h4 className="font-bold text-slate-800 mb-1">{p.name}</h4>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                {p.desc}
              </p>
              <div className="text-[10px] text-slate-400">By {p.author}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Customization */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <Palette className="mr-2 text-brand-600" size={20} />
          主题与个性化 (Theming)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              主色调 (Primary Color)
            </label>
            <div className="flex gap-2">
              {[
                'bg-blue-600',
                'bg-purple-600',
                'bg-emerald-600',
                'bg-rose-600',
                'bg-slate-900',
              ].map((c) => (
                <div
                  key={c}
                  className={`w-8 h-8 rounded-full cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-slate-200 ${c}`}
                ></div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              深色模式
            </label>
            <div className="flex items-center text-slate-600">
              <ToggleLeft size={32} className="text-slate-300 mr-2" /> 跟随系统
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              圆角风格
            </label>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 border border-slate-300 rounded bg-white">
                直角
              </button>
              <button className="px-3 py-1 border border-brand-500 bg-brand-50 text-brand-600 rounded-lg">
                圆角
              </button>
              <button className="px-3 py-1 border border-slate-300 rounded-full bg-white">
                全圆
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extension;
