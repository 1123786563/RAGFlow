import {
  Building,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LogIn,
  Mail,
  Palette,
  Save,
  Search,
  Shield,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Department, Role, User as UserType } from '../../../types/index';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType | null; // null means creating new user
  roles: Role[];
  depts: Department[];
}

const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '简体中文 (Zh-CN)' },
  { value: 'en-US', label: 'English (En-US)' },
  { value: 'ja-JP', label: '日本語 (Japanese)' },
  { value: 'ko-KR', label: '한국어 (Korean)' },
  { value: 'fr-FR', label: 'Français (French)' },
  { value: 'de-DE', label: 'Deutsch (German)' },
  { value: 'es-ES', label: 'Español (Spanish)' },
];

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (UTC+8)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
  { value: 'America/Chicago', label: 'America/Chicago (UTC-6)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-8)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+11)' },
  { value: 'UTC', label: 'UTC (Universal)' },
];

interface Option {
  label: string;
  value: string;
}

// Searchable Select Component
const SearchableSelect = ({
  label,
  icon,
  value,
  options,
  onChange,
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  value?: string;
  options: Option[];
  onChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      opt.value.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative col-span-1" ref={wrapperRef}>
      <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
        {icon} {label}
      </label>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'ring-2 ring-brand-500/20 border-brand-500' : 'hover:border-slate-300'}`}
      >
        <span
          className={`truncate ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}
        >
          {selectedOption?.label || '请选择...'}
        </span>
        <ChevronDown size={14} className="text-slate-400 flex-shrink-0 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-hidden flex flex-col animate-fade-in-up">
          <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-2.5 text-slate-400"
              />
              <input
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                placeholder="搜索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm rounded-md cursor-pointer flex justify-between items-center mb-0.5 ${opt.value === value ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && (
                    <Check
                      size={14}
                      className="text-brand-600 flex-shrink-0 ml-2"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-8 text-xs text-slate-400 text-center">
                未找到相关结果
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  depts,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize state with all potential fields
  const [formData, setFormData] = useState<Partial<UserType>>({
    nickname: '',
    email: '',
    password: '',
    role: '',
    department: '',
    avatar: '',
    is_active: '1',
    is_superuser: false,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    is_authenticated: '0',
    is_anonymous: '0',
    status: '1',
    login_channel: 'email',
    color_schema: 'default',
  });

  useEffect(() => {
    setShowPassword(false);
    if (user) {
      setFormData({
        ...user,
        password: '', // Don't fill password on edit
      });
    } else {
      setFormData({
        nickname: '',
        email: '',
        password: '',
        role: roles[0]?.name || '',
        department: depts[0]?.name || '',
        avatar: '',
        is_active: '1',
        is_superuser: false,
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        is_authenticated: '0',
        is_anonymous: '0',
        status: '1',
        login_channel: 'email',
        color_schema: 'default',
      });
    }
  }, [user, roles, depts, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('文件过大，请选择小于 5MB 的图片');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {user ? '编辑用户' : '新增用户'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Avatar Upload */}
            <div className="flex flex-col items-center space-y-3 pt-2">
              <div
                className="relative w-28 h-28 rounded-full border-4 border-slate-50 bg-slate-100 overflow-hidden group cursor-pointer shadow-md"
                onClick={() => fileInputRef.current?.click()}
                title="点击更换头像"
              >
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    {formData.nickname ? (
                      <span className="text-4xl font-bold text-brand-300">
                        {formData.nickname.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-[10px] text-white font-medium uppercase tracking-wide">
                    更换
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs py-1.5 px-3 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  <Upload size={12} className="mr-1.5" /> 上传头像
                </button>
                {formData.avatar && (
                  <button
                    onClick={removeAvatar}
                    className="text-xs py-1.5 px-3 text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={12} className="mr-1.5" /> 移除头像
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                    <User size={12} className="mr-1" /> 昵称 (Nickname){' '}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                    <Mail size={12} className="mr-1" /> 邮箱 (Email){' '}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                    <Lock size={12} className="mr-1" />
                    {user ? '重置密码 (留空则不修改)' : '初始密码 (Password)'}
                    {!user && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      placeholder={showPassword ? 'password123' : '********'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Localization & Preferences */}
              <div className="grid grid-cols-3 gap-4">
                <SearchableSelect
                  label="语言"
                  icon={<Globe size={12} className="mr-1" />}
                  value={formData.language}
                  options={LANGUAGE_OPTIONS}
                  onChange={(val) =>
                    setFormData({ ...formData, language: val })
                  }
                />

                <SearchableSelect
                  label="时区"
                  icon={<Clock size={12} className="mr-1" />}
                  value={formData.timezone}
                  options={TIMEZONE_OPTIONS}
                  onChange={(val) =>
                    setFormData({ ...formData, timezone: val })
                  }
                />

                <div className="col-span-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                    <Palette size={12} className="mr-1" /> 主题 (Color Schema)
                  </label>
                  <select
                    value={formData.color_schema}
                    onChange={(e) =>
                      setFormData({ ...formData, color_schema: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  >
                    <option value="default">Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              {/* Linkage: Role & Dept Selection (Virtual fields in User table usually) */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-4">
                <div className="flex items-center text-xs text-brand-600 font-medium mb-2">
                  <Shield size={12} className="mr-1" /> 权限与归属配置
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      分配角色 (Role)
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                    >
                      <option value="">-- 选择角色 --</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                      <Building size={12} className="mr-1" /> 所属部门
                      (Department)
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                    >
                      <option value="">-- 选择部门 --</option>
                      {depts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 flex items-center">
                      <LogIn size={12} className="mr-1" /> 登录渠道 (Login
                      Channel) -{' '}
                      <span className="text-slate-400 font-normal">
                        系统自动记录
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.login_channel || 'System'}
                      readOnly
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-100 text-slate-500 focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center gap-x-6 gap-y-3 p-4 border border-slate-100 rounded-lg flex-wrap">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active === '1'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_active: e.target.checked ? '1' : '0',
                      })
                    }
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">
                    启用账号 (Is Active)
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_authenticated === '1'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_authenticated: e.target.checked ? '1' : '0',
                      })
                    }
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">
                    已认证 (Authenticated)
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_superuser}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_superuser: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700 font-bold flex items-center">
                    超级管理员 (Superuser){' '}
                    <Shield size={12} className="ml-1 text-purple-600" />
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous === '1'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_anonymous: e.target.checked ? '1' : '0',
                      })
                    }
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-500">
                    匿名访客 (Anonymous)
                  </span>
                </label>
              </div>
            </div>
          </div>
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
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm flex items-center transition-colors"
          >
            <Save size={16} className="mr-2" />
            保存用户
          </button>
        </div>
      </div>
    </div>
  );
};
