import {
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Key,
  Save,
  Shield,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MenuApi } from '../../../../api';
import { MenuItem, Role } from '../../../../types/index';

interface RoleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  onSave: (role: Partial<Role>) => void;
}

export const RoleEditModal: React.FC<RoleEditModalProps> = ({
  isOpen,
  onClose,
  role,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    key: '',
    description: '',
    status: 'active',
    permissions: [],
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'permissions'>('basic');
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [checkedMenus, setCheckedMenus] = useState<Set<string>>(new Set());
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setMenuTree(MenuApi.list());
      if (role) {
        setFormData({ ...role });
        // Load existing permissions
        if (role.permissions) {
          setCheckedMenus(new Set(role.permissions));
        } else {
          setCheckedMenus(new Set());
        }
      } else {
        setFormData({
          name: '',
          key: '',
          description: '',
          status: 'active',
          permissions: [],
        });
        setCheckedMenus(new Set());
      }

      // Expand all by default for better UX
      setExpandedMenus(new Set(['1', '2', '3']));
    }
  }, [isOpen, role]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      permissions: Array.from(checkedMenus),
    });
    onClose();
  };

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedMenus);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedMenus(newSet);
  };

  const toggleCheck = (id: string, children?: MenuItem[]) => {
    const newSet = new Set(checkedMenus);
    const isChecked = newSet.has(id);

    if (isChecked) {
      newSet.delete(id);
      // Optional: Uncheck all children if unchecking parent
      const uncheckChildren = (nodes: MenuItem[]) => {
        nodes.forEach((n) => {
          newSet.delete(n.id);
          if (n.children) uncheckChildren(n.children);
        });
      };
      if (children) uncheckChildren(children);
    } else {
      newSet.add(id);
      // Optional: Check all children if checking parent
      const checkChildren = (nodes: MenuItem[]) => {
        nodes.forEach((n) => {
          newSet.add(n.id);
          if (n.children) checkChildren(n.children);
        });
      };
      if (children) checkChildren(children);
    }
    setCheckedMenus(newSet);
  };

  const renderMenuTree = (nodes: MenuItem[], depth = 0) => {
    return (
      <div className="space-y-1">
        {nodes.map((node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expandedMenus.has(node.id);
          const isChecked = checkedMenus.has(node.id);

          return (
            <div key={node.id}>
              <div
                className={`flex items-center p-2 rounded-lg hover:bg-slate-50 transition-colors ${isChecked ? 'bg-brand-50/50' : ''}`}
                style={{ marginLeft: `${depth * 20}px` }}
              >
                <button
                  onClick={() => hasChildren && toggleExpand(node.id)}
                  className={`p-1 mr-2 rounded hover:bg-slate-200 text-slate-400 ${!hasChildren && 'invisible'}`}
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                <label className="flex items-center cursor-pointer flex-1">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${isChecked ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white'}`}
                  >
                    {isChecked && <Check size={10} className="text-white" />}
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isChecked}
                      onChange={() => toggleCheck(node.id, node.children)}
                    />
                  </div>
                  <span
                    className={`text-sm ${isChecked ? 'text-brand-700 font-medium' : 'text-slate-700'}`}
                  >
                    {node.title}
                  </span>
                </label>
              </div>
              {hasChildren &&
                isExpanded &&
                renderMenuTree(node.children!, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {role ? '编辑角色' : '创建新角色'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'basic' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            基本信息
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'permissions' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            菜单权限配置
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'basic' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                  <Shield size={12} className="mr-1" /> 角色名称 (Role Name){' '}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  placeholder="例如：内容审核员"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                  <Key size={12} className="mr-1" /> 唯一标识 (Key){' '}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none font-mono"
                  placeholder="admin, editor, etc."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                  <FileText size={12} className="mr-1" /> 描述 (Description)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  rows={3}
                  placeholder="该角色的职责描述..."
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'active'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? 'active' : 'disabled',
                      })
                    }
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">启用该角色</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 mb-4">
                勾选该角色可以访问的菜单项。父级菜单选中会自动包含子菜单。
              </div>
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={() => setExpandedMenus(new Set(['1', '2', '3']))}
                  className="text-xs text-brand-600 hover:underline"
                >
                  展开所有
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setExpandedMenus(new Set())}
                  className="text-xs text-slate-500 hover:underline"
                >
                  折叠所有
                </button>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 max-h-[300px] overflow-y-auto bg-white">
                {renderMenuTree(menuTree)}
              </div>
              <div className="text-xs text-slate-500 text-right">
                已选 {checkedMenus.size} 项权限
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm flex items-center transition-colors"
          >
            <Save size={16} className="mr-2" />
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
