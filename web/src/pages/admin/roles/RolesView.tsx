import {
  Ban,
  CheckCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Plus,
  Search,
  Square,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { RoleApi } from '../../../api';
import { Role } from '../../../types/index';
import { RoleEditModal } from './components/RoleEditModal';

export const RolesView: React.FC = () => {
  // Local State
  const [roles, setRoles] = useState<Role[]>(RoleApi.list());
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter Logic
  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.key.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [roles, searchTerm]);

  const totalItems = filteredRoles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Selection Handlers
  const handleSelectAll = () => {
    if (currentRoles.every((r) => selectedIds.has(r.id))) {
      // Deselect all on current page
      const newSelected = new Set(selectedIds);
      currentRoles.forEach((r) => newSelected.delete(r.id));
      setSelectedIds(newSelected);
    } else {
      // Select all on current page
      const newSelected = new Set(selectedIds);
      currentRoles.forEach((r) => newSelected.add(r.id));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectRole = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Batch Operations
  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedIds.size} 个角色吗？`)) {
      setRoles((prev) => prev.filter((r) => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
    }
  };

  const handleBatchStatus = (status: 'active' | 'disabled') => {
    setRoles((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: status } : r)),
    );
    setSelectedIds(new Set());
  };

  // CRUD Operations
  const handleAdd = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除此角色吗？此操作不可恢复。')) {
      setRoles((prev) => prev.filter((r) => r.id !== id));
      if (selectedIds.has(id)) {
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
      }
    }
  };

  const handleSave = (roleData: Partial<Role>) => {
    if (editingRole) {
      // Update
      setRoles((prev) =>
        prev.map((r) => (r.id === editingRole.id ? { ...r, ...roleData } : r)),
      );
    } else {
      // Create
      const newRole: Role = {
        id: Date.now().toString(),
        name: roleData.name || 'New Role',
        key: roleData.key || 'new_role',
        description: roleData.description || '',
        userCount: 0,
        status: roleData.status || 'active',
        permissions: roleData.permissions || [],
      };
      setRoles((prev) => [...prev, newRole]);
    }
  };

  const isAllSelected =
    currentRoles.length > 0 && currentRoles.every((r) => selectedIds.has(r.id));
  const isBatchMode = selectedIds.size > 0;

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 animate-fade-in-up h-12">
        {isBatchMode ? (
          <div className="flex items-center justify-between bg-brand-50 border border-brand-100 px-4 py-2 rounded-lg text-brand-900">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm bg-white px-2 py-0.5 rounded border border-brand-200">
                已选择 {selectedIds.size} 项
              </span>
              <span className="text-xs text-brand-600">批量操作:</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBatchStatus('active')}
                className="flex items-center px-3 py-1.5 bg-white border border-green-200 text-green-700 hover:bg-green-50 rounded-md text-xs font-medium transition-colors"
              >
                <CheckCircle size={14} className="mr-1.5" /> 启用
              </button>
              <button
                onClick={() => handleBatchStatus('disabled')}
                className="flex items-center px-3 py-1.5 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-md text-xs font-medium transition-colors"
              >
                <Ban size={14} className="mr-1.5" /> 禁用
              </button>
              <div className="h-4 w-px bg-brand-200 mx-2"></div>
              <button
                onClick={handleBatchDelete}
                className="flex items-center px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-xs font-medium transition-colors"
              >
                <Trash2 size={14} className="mr-1.5" /> 删除
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="ml-2 p-1.5 text-brand-400 hover:text-brand-600 hover:bg-brand-100 rounded-full"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="搜索角色名称或 Key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white text-sm font-medium transition-colors">
                <Filter size={16} className="mr-2" />
                筛选
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <Plus size={16} className="mr-2" />
                创建角色
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in-up flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left w-10">
                  <button
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-brand-600 transition-colors flex items-center justify-center"
                  >
                    {isAllSelected ? (
                      <CheckSquare size={18} className="text-brand-600" />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  角色名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  标识 (Key)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  用户数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {currentRoles.map((role) => {
                const isSelected = selectedIds.has(role.id);
                return (
                  <tr
                    key={role.id}
                    className={`transition-colors group ${isSelected ? 'bg-brand-50/30' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSelectRole(role.id)}
                        className="text-slate-400 hover:text-brand-600 transition-colors flex items-center justify-center"
                      >
                        {isSelected ? (
                          <CheckSquare size={18} className="text-brand-600" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded w-min">
                      {role.key}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 max-w-xs truncate"
                      title={role.description}
                    >
                      {role.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 flex items-center">
                      <Users size={14} className="mr-1.5 text-slate-400" />
                      {role.userCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}
                      >
                        {role.status === 'active' ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-brand-600 hover:text-brand-900 mr-3 inline-flex items-center transition-colors"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(role.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {currentRoles.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    未找到角色
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3 bg-slate-50 rounded-b-xl">
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-md transition-colors ${
                    currentPage === i + 1
                      ? 'bg-brand-600 text-white border border-brand-600'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <RoleEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={editingRole}
        onSave={handleSave}
      />
    </>
  );
};
