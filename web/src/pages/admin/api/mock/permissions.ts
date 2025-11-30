import { Permission } from '../../types/index';

export const KB_PERMISSIONS: Permission[] = [
  {
    id: '1',
    role: '超级管理员',
    resource: '迪士尼知识库',
    accessLevel: 'Admin',
    granularRights: [
      '下载源文件',
      '解析配置',
      '切片编辑',
      'API 调用',
      '分享链接',
      '向量导出',
      '删除知识库',
    ],
  },
  {
    id: '2',
    role: '内容编辑',
    resource: '迪士尼知识库',
    accessLevel: 'Write',
    granularRights: ['切片编辑', '上传文档', '触发解析'],
  },
  {
    id: '3',
    role: '普通访客',
    resource: '迪士尼知识库',
    accessLevel: 'Read',
    granularRights: ['检索对话', '查看引用'],
  },
  {
    id: '4',
    role: '超级管理员',
    resource: '财务报告',
    accessLevel: 'Admin',
    granularRights: ['下载源文件', 'API 调用', '查看审计日志'],
  },
  {
    id: '5',
    role: '数据分析师',
    resource: 'Alpha 项目规范',
    accessLevel: 'Read',
    granularRights: ['检索对话', '向量导出', '查看统计报表'],
  },
];

export const MENU_PERMISSIONS: Permission[] = [
  { id: '1', role: '超级管理员', resource: '系统设置', accessLevel: 'Admin' },
  { id: '2', role: '内容编辑', resource: '系统设置', accessLevel: 'None' },
  { id: '3', role: '超级管理员', resource: '用户管理', accessLevel: 'Admin' },
  { id: '4', role: '内容编辑', resource: '用户管理', accessLevel: 'None' },
];
