import {
  Ban,
  CheckCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Github,
  Globe,
  HelpCircle,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Square,
  Trash2,
  User as UserIcon,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { DeptApi, RoleApi, UserApi } from '../../../api';
import { User } from '../../../types/index';
import { UserEditModal } from '../components/UserEditModal';

export const UsersView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Local state for users to simulate CRUD operations
  const [users, setUsers] = useState<User[]>(UserApi.list());
  const [searchTerm, setSearchTerm] = useState('');

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Fetch mock data for modal
  const ROLES = RoleApi.list();
  const DEPTS = DeptApi.list();

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const currentUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );
  }, [filteredUsers, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Selection Handlers
  const handleSelectAll = () => {
    if (currentUsers.every((u) => selectedIds.has(u.id))) {
      // Deselect all on current page
      const newSelected = new Set(selectedIds);
      currentUsers.forEach((u) => newSelected.delete(u.id));
      setSelectedIds(newSelected);
    } else {
      // Select all on current page
      const newSelected = new Set(selectedIds);
      currentUsers.forEach((u) => newSelected.add(u.id));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectUser = (id: string) => {
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
    if (window.confirm(`确定要删除选中的 ${selectedIds.size} 个用户吗？`)) {
      setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
      setSelectedIds(new Set());
    }
  };

  const handleBatchStatus = (isActive: '1' | '0') => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedIds.has(u.id) ? { ...u, is_active: isActive } : u,
      ),
    );
    setSelectedIds(new Set());
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除此用户吗？')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (selectedIds.has(id)) {
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        setSelectedIds(newSelected);
      }
    }
  };

  const getChannelIcon = (channel?: string) => {
    const c = channel?.toLowerCase() || '';
    if (c.includes('github'))
      return <Github size={14} className="text-slate-700" />;
    if (c.includes('google'))
      return <Globe size={14} className="text-blue-500" />;
    if (c.includes('wechat'))
      return <Smartphone size={14} className="text-green-600" />;
    if (c.includes('email'))
      return <Mail size={14} className="text-slate-400" />;
    return <UserIcon size={14} className="text-slate-400" />;
  };

  const isAllSelected =
    currentUsers.length > 0 && currentUsers.every((u) => selectedIds.has(u.id));
  const isBatchMode = selectedIds.size > 0;

  return (
    <>
      {/* Toolbar - Switch between Search and Batch Actions */}
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
                onClick={() => handleBatchStatus('1')}
                className="flex items-center px-3 py-1.5 bg-white border border-green-200 text-green-700 hover:bg-green-50 rounded-md text-xs font-medium transition-colors"
              >
                <CheckCircle size={14} className="mr-1.5" /> 启用
              </button>
              <button
                onClick={() => handleBatchStatus('0')}
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
                placeholder="搜索用户..."
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
                新增用户
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
                  用户 (Nickname/Email)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  来源
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  角色 / 身份
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  地区配置
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  最后登录
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {currentUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${isSelected ? 'bg-brand-50/30' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSelectUser(user.id)}
                        className="text-slate-400 hover:text-brand-600 transition-colors flex items-center justify-center"
                      >
                        {isSelected ? (
                          <CheckSquare size={18} className="text-brand-600" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden relative">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.nickname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user.nickname.charAt(0).toUpperCase()
                          )}
                          {user.is_anonymous === '1' && (
                            <span
                              className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-slate-400 ring-2 ring-white"
                              title="Anonymous"
                            ></span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 flex items-center">
                            {user.nickname}
                            {user.is_superuser && (
                              <span
                                title="Superuser"
                                className="ml-1 inline-flex items-center"
                              >
                                <ShieldCheck
                                  size={14}
                                  className="text-purple-600"
                                />
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-600 capitalize gap-2">
                        <span className="p-1.5 bg-slate-50 rounded border border-slate-100">
                          {getChannelIcon(user.login_channel)}
                        </span>
                        {user.login_channel || 'System'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {user.role && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200 font-medium w-fit">
                            {user.role}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          {user.department || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Globe size={10} /> {user.language}
                        </span>
                        <span className="text-xs text-slate-400">
                          {user.timezone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${user.is_active === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {user.is_active === '1' ? 'Active' : 'Inactive'}
                        </span>
                        {user.is_authenticated === '0' && (
                          <span className="text-[10px] text-amber-600 flex items-center">
                            <HelpCircle size={10} className="mr-0.5" /> 未认证
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono text-xs">
                      {user.last_login_time ? user.last_login_time : '从未登录'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-brand-600 hover:text-brand-900 mx-2 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-600 mx-2 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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

      <UserEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        roles={ROLES}
        depts={DEPTS}
      />
    </>
  );
};
