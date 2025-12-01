/**
 * 插件管理器
 * 用于管理插件的加载、注册、激活和停用等生命周期
 */

import { EventEmitter } from 'events';
import { 
  PluginConfig, 
  PluginContext, 
  PluginInstance, 
  PluginMetadata, 
  PluginModule, 
  PluginSystemConfig, 
  PluginSystemEvent 
} from './plugin-types';

/**
 * 插件管理器类
 */
export class PluginManager {
  /**
   * 插件系统配置
   */
  private config: PluginSystemConfig;
  
  /**
   * 插件实例映射
   */
  private plugins: Map<string, PluginInstance> = new Map();
  
  /**
   * 事件发射器
   */
  private eventEmitter: EventEmitter = new EventEmitter();
  
  /**
   * 插件配置存储
   */
  private configStore: Map<string, PluginConfig> = new Map();
  
  /**
   * 构造函数
   * @param config 插件系统配置
   */
  constructor(config: PluginSystemConfig = {}) {
    this.config = {
      pluginDir: '/plugins',
      configKey: 'plugin-configs',
      autoLoad: true,
      ...config,
    };
    
    // 从本地存储加载插件配置
    this.loadConfig();
  }
  
  /**
   * 从本地存储加载插件配置
   */
  private loadConfig(): void {
    try {
      const storedConfig = localStorage.getItem(this.config.configKey!);
      if (storedConfig) {
        const configs = JSON.parse(storedConfig);
        Object.entries(configs).forEach(([pluginId, config]) => {
          this.configStore.set(pluginId, config as PluginConfig);
        });
      }
    } catch (error) {
      console.error('Failed to load plugin configs:', error);
    }
  }
  
  /**
   * 保存插件配置到本地存储
   */
  private saveConfig(): void {
    try {
      const configs: Record<string, PluginConfig> = {};
      this.configStore.forEach((config, pluginId) => {
        configs[pluginId] = config;
      });
      localStorage.setItem(this.config.configKey!, JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to save plugin configs:', error);
    }
  }
  
  /**
   * 获取插件配置
   * @param pluginId 插件ID
   * @returns 插件配置
   */
  private getPluginConfig(pluginId: string): PluginConfig {
    return this.configStore.get(pluginId) || { enabled: false };
  }
  
  /**
   * 更新插件配置
   * @param pluginId 插件ID
   * @param config 插件配置
   */
  private updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): void {
    const currentConfig = this.getPluginConfig(pluginId);
    const newConfig = { ...currentConfig, ...config };
    this.configStore.set(pluginId, newConfig);
    this.saveConfig();
  }
  
  /**
   * 加载插件
   * @param pluginModule 插件模块
   * @returns 插件实例
   */
  async loadPlugin(pluginModule: PluginModule): Promise<PluginInstance> {
    const { metadata, defaultConfig = { enabled: false }, api = {}, ...hooks } = pluginModule;
    
    // 检查插件是否已加载
    if (this.plugins.has(metadata.id)) {
      return this.plugins.get(metadata.id)!;
    }
    
    // 获取插件配置
    const config = this.getPluginConfig(metadata.id);
    
    // 创建插件上下文
    const context: PluginContext = {
      metadata,
      config,
      updateConfig: async (newConfig) => {
        this.updatePluginConfig(metadata.id, newConfig);
        this.emit('plugin:configChanged', metadata.id, newConfig);
      },
      on: (event, handler) => {
        this.eventEmitter.on(`${metadata.id}:${event}`, handler);
      },
      emit: (event, ...args) => {
        this.eventEmitter.emit(`${metadata.id}:${event}`, ...args);
      },
      getPlugin: (id) => {
        return this.plugins.get(id);
      },
    };
    
    // 创建插件实例
    const pluginInstance: PluginInstance = {
      metadata,
      config,
      status: 'initialized',
      api,
      ...hooks,
      
      async activate() {
        if (this.status === 'activated') return;
        
        // 调用插件激活钩子
        if (this.onActivate) {
          await this.onActivate(context);
        }
        
        this.status = 'activated';
        this.config.enabled = true;
        this.updatePluginConfig(metadata.id, { enabled: true });
        this.emit('plugin:activated', this);
      },
      
      async deactivate() {
        if (this.status !== 'activated') return;
        
        // 调用插件停用钩子
        if (this.onDeactivate) {
          await this.onDeactivate(context);
        }
        
        this.status = 'deactivated';
        this.config.enabled = false;
        this.updatePluginConfig(metadata.id, { enabled: false });
        this.emit('plugin:deactivated', this);
      },
      
      async unload() {
        // 调用插件卸载钩子
        if (this.onUnload) {
          await this.onUnload(context);
        }
        
        this.status = 'unloaded';
        this.plugins.delete(metadata.id);
        this.emit('plugin:unloaded', this);
      },
      
      async updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.updatePluginConfig(metadata.id, newConfig);
        this.emit('plugin:configChanged', this, newConfig);
      },
    };
    
    // 调用插件初始化钩子
    if (pluginInstance.onInit) {
      await pluginInstance.onInit(context);
    }
    
    // 注册插件实例
    this.plugins.set(metadata.id, pluginInstance);
    
    // 触发插件加载事件
    this.emit('plugin:loaded', pluginInstance);
    
    // 如果插件配置为启用，自动激活插件
    if (config.enabled) {
      await pluginInstance.activate();
    }
    
    return pluginInstance;
  }
  
  /**
   * 从URL加载插件
   * @param url 插件URL
   * @returns 插件实例
   */
  async loadPluginFromUrl(url: string): Promise<PluginInstance> {
    try {
      // 动态导入插件模块
      const module = await import(url);
      const pluginModule = module.default as PluginModule;
      
      // 加载插件
      return await this.loadPlugin(pluginModule);
    } catch (error) {
      console.error(`Failed to load plugin from ${url}:`, error);
      throw error;
    }
  }
  
  /**
   * 获取插件实例
   * @param pluginId 插件ID
   * @returns 插件实例
   */
  getPlugin(pluginId: string): PluginInstance | undefined {
    return this.plugins.get(pluginId);
  }
  
  /**
   * 获取所有插件实例
   * @returns 插件实例数组
   */
  getAllPlugins(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }
  
  /**
   * 激活插件
   * @param pluginId 插件ID
   */
  async activatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      await plugin.activate();
    }
  }
  
  /**
   * 停用插件
   * @param pluginId 插件ID
   */
  async deactivatePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      await plugin.deactivate();
    }
  }
  
  /**
   * 卸载插件
   * @param pluginId 插件ID
   */
  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      await plugin.unload();
    }
  }
  
  /**
   * 更新插件配置
   * @param pluginId 插件ID
   * @param config 插件配置
   */
  async updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      await plugin.updateConfig(config);
    }
  }
  
  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  on(event: PluginSystemEvent, handler: (...args: any[]) => void): void {
    this.eventEmitter.on(event, handler);
  }
  
  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  off(event: PluginSystemEvent, handler: (...args: any[]) => void): void {
    this.eventEmitter.off(event, handler);
  }
  
  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   */
  emit(event: PluginSystemEvent, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args);
  }
  
  /**
   * 初始化插件系统
   */
  async init(): Promise<void> {
    // 如果配置为自动加载，加载所有插件
    if (this.config.autoLoad) {
      await this.loadAllPlugins();
    }
  }
  
  /**
   * 加载所有插件
   */
  private async loadAllPlugins(): Promise<void> {
    try {
      // 这里可以实现从插件目录加载所有插件的逻辑
      // 目前仅作为示例，实际实现需要根据具体需求调整
      console.log('Loading all plugins...');
    } catch (error) {
      console.error('Failed to load all plugins:', error);
    }
  }
}

/**
 * 插件管理器单例
 */
export const pluginManager = new PluginManager();
