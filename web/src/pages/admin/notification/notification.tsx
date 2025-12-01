import { Plus } from 'lucide-react';
import React from 'react';
import { SysExtApi } from '../api';

// 导入子组件
import { NotificationItem } from '../components/common/NotificationItem';

/**
 * 通知模板管理视图组件
 * 提供通知模板的展示、添加和编辑功能
 */
const Notification: React.FC = () => {
  // 获取通知模板数据
  const TEMPLATES = SysExtApi.notificationTemplates();

  /**
   * 切换模板激活状态
   * @param id 模板ID
   */
  const handleToggleActive = (id: string) => {
    // TODO: 实现切换模板激活状态功能
    console.log('Toggle template active:', id);
  };

  /**
   * 编辑模板
   * @param id 模板ID
   */
  const handleEdit = (id: string) => {
    // TODO: 实现编辑模板功能
    console.log('Edit template:', id);
  };

  /**
   * 新建模板
   */
  const handleCreate = () => {
    // TODO: 实现新建模板功能
    console.log('Create new template');
  };

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
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm flex items-center"
        >
          <Plus size={16} className="mr-2" /> 新建模版
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TEMPLATES.map((template) => (
          <NotificationItem
            key={template.id}
            template={template}
            onToggleActive={handleToggleActive}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default Notification;
