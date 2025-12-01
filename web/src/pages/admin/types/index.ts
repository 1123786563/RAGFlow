import React from 'react';

// 导航相关类型
export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

// 知识库和聊天相关类型
export interface KnowledgeBaseItem {
  id: string;
  title: string;
  fileCount: number;
  lastUpdated: string;
  iconChar: string;
  color: string;
}

export interface ChatSessionItem {
  id: string;
  title: string;
  lastMessage?: string;
  lastUpdated: string;
  iconChar: string;
  color: string;
  type: 'chat' | 'search' | 'agent';
}

export enum SectionType {
  KNOWLEDGE = 'KNOWLEDGE',
  CHAT = 'CHAT',
}

export enum ChatTab {
  CHAT = 'chat',
  SEARCH = 'search',
  AGENTS = 'agents',
}

// 模块化类型导出
export * from './users';
export * from './roles';
export * from './menus';
export * from './departments';
export * from './audit';
export * from './system';
export * from './extensions';
export * from './productivity';
