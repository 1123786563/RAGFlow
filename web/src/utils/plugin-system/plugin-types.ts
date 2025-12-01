/**
 * 插件系统类型定义
 */

/**
 * 插件元数据
 */
export interface PluginMetadata {
  /**
   * 插件ID
   */
  id: string;
  /**
   * 插件名称
   */
  name: string;
  /**
   * 插件描述
   */
  description?: string;
  /**
   * 插件版本
   */
  version: string;
  /**
   * 插件作者
   */
  author?: string;
  /**
   * 插件依赖
   */
  dependencies?: string[];
  /**
   * 插件配置选项
   */
  configSchema?: Record<string, any>;
  /**
   * 插件入口文件
   */
  entry?: string;
}

/**
 * 插件配置
 */
export interface PluginConfig {
  /**
   * 插件是否启用
   */
  enabled: boolean;
  /**
   * 插件配置项
   */
  settings?: Record<string, any>;
}

/**
 * 插件上下文
 */
export interface PluginContext {
  /**
   * 插件元数据
   */
  metadata: PluginMetadata;
  /**
   * 插件配置
   */
  config: PluginConfig;
  /**
   * 更新插件配置
   */
  updateConfig: (config: Partial<PluginConfig>) => Promise<void>;
  /**
   * 注册事件监听器
   */
  on: (event: string, handler: (...args: any[]) => void) => void;
  /**
   * 触发事件
   */
  emit: (event: string, ...args: any[]) => void;
  /**
   * 获取其他插件实例
   */
  getPlugin: (id: string) => PluginInstance | undefined;
}

/**
 * 插件生命周期钩子
 */
export interface PluginHooks {
  /**
   * 插件初始化
   */
  onInit?: (context: PluginContext) => Promise<void>;
  /**
   * 插件激活
   */
  onActivate?: (context: PluginContext) => Promise<void>;
  /**
   * 插件停用
   */
  onDeactivate?: (context: PluginContext) => Promise<void>;
  /**
   * 插件卸载
   */
  onUnload?: (context: PluginContext) => Promise<void>;
}

/**
 * 插件模块
 */
export interface PluginModule extends PluginHooks {
  /**
   * 插件元数据
   */
  metadata: PluginMetadata;
  /**
   * 插件配置默认值
   */
  defaultConfig?: PluginConfig;
  /**
   * 插件导出的API
   */
  api?: Record<string, any>;
}

/**
 * 插件实例
 */
export interface PluginInstance extends PluginHooks {
  /**
   * 插件元数据
   */
  metadata: PluginMetadata;
  /**
   * 插件配置
   */
  config: PluginConfig;
  /**
   * 插件状态
   */
  status: 'initialized' | 'activated' | 'deactivated' | 'unloaded';
  /**
   * 插件API
   */
  api?: Record<string, any>;
  /**
   * 激活插件
   */
  activate: () => Promise<void>;
  /**
   * 停用插件
   */
  deactivate: () => Promise<void>;
  /**
   * 卸载插件
   */
  unload: () => Promise<void>;
  /**
   * 更新插件配置
   */
  updateConfig: (config: Partial<PluginConfig>) => Promise<void>;
}

/**
 * 插件系统事件
 */
export type PluginSystemEvent = 
  | 'plugin:loaded' 
  | 'plugin:activated' 
  | 'plugin:deactivated' 
  | 'plugin:unloaded' 
  | 'plugin:configChanged';

/**
 * 插件系统配置
 */
export interface PluginSystemConfig {
  /**
   * 插件目录
   */
  pluginDir?: string;
  /**
   * 插件配置存储键
   */
  configKey?: string;
  /**
   * 是否自动加载插件
   */
  autoLoad?: boolean;
}
