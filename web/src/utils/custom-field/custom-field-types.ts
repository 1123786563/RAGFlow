/**
 * 自定义字段类型定义
 */

/**
 * 自定义字段数据类型
 */
export enum CustomFieldType {
  /**
   * 文本类型
   */
  TEXT = 'text',
  /**
   * 多行文本类型
   */
  TEXTAREA = 'textarea',
  /**
   * 数字类型
   */
  NUMBER = 'number',
  /**
   * 布尔类型
   */
  BOOLEAN = 'boolean',
  /**
   * 日期类型
   */
  DATE = 'date',
  /**
   * 日期时间类型
   */
  DATETIME = 'datetime',
  /**
   * 下拉选择类型
   */
  SELECT = 'select',
  /**
   * 单选按钮类型
   */
  RADIO = 'radio',
  /**
   * 复选框类型
   */
  CHECKBOX = 'checkbox',
  /**
   * 标签类型
   */
  TAGS = 'tags',
  /**
   * 图片类型
   */
  IMAGE = 'image',
  /**
   * 文件类型
   */
  FILE = 'file',
  /**
   * 链接类型
   */
  URL = 'url',
  /**
   * 邮箱类型
   */
  EMAIL = 'email',
  /**
   * 电话类型
   */
  PHONE = 'phone',
}

/**
 * 自定义字段选项
 */
export interface CustomFieldOption {
  /**
   * 选项值
   */
  value: string;
  /**
   * 选项标签
   */
  label: string;
  /**
   * 选项描述
   */
  description?: string;
  /**
   * 选项是否禁用
   */
  disabled?: boolean;
}

/**
 * 自定义字段验证规则
 */
export interface CustomFieldValidation {
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 最小长度
   */
  minLength?: number;
  /**
   * 最大长度
   */
  maxLength?: number;
  /**
   * 最小值
   */
  min?: number;
  /**
   * 最大值
   */
  max?: number;
  /**
   * 正则表达式验证
   */
  pattern?: string;
  /**
   * 自定义验证消息
   */
  message?: string;
}

/**
 * 自定义字段配置
 */
export interface CustomFieldConfig {
  /**
   * 自定义字段ID
   */
  id: string;
  /**
   * 自定义字段名称
   */
  name: string;
  /**
   * 自定义字段标签
   */
  label: string;
  /**
   * 自定义字段描述
   */
  description?: string;
  /**
   * 自定义字段数据类型
   */
  type: CustomFieldType;
  /**
   * 自定义字段选项（用于select、radio、checkbox等类型）
   */
  options?: CustomFieldOption[];
  /**
   * 自定义字段默认值
   */
  defaultValue?: any;
  /**
   * 自定义字段验证规则
   */
  validation?: CustomFieldValidation;
  /**
   * 自定义字段是否可见
   */
  visible?: boolean;
  /**
   * 自定义字段是否可编辑
   */
  editable?: boolean;
  /**
   * 自定义字段排序
   */
  sortOrder?: number;
  /**
   * 自定义字段所属实体类型
   */
  entityType: string;
  /**
   * 自定义字段创建时间
   */
  createdAt?: string;
  /**
   * 自定义字段更新时间
   */
  updatedAt?: string;
}

/**
 * 自定义字段值
 */
export interface CustomFieldValue {
  /**
   * 自定义字段ID
   */
  fieldId: string;
  /**
   * 自定义字段值
   */
  value: any;
  /**
   * 自定义字段标签
   */
  label?: string;
}

/**
 * 带自定义字段的实体
 */
export interface EntityWithCustomFields {
  /**
   * 实体ID
   */
  id: string;
  /**
   * 自定义字段值列表
   */
  customFields?: CustomFieldValue[];
}

/**
 * 自定义字段表单配置
 */
export interface CustomFieldFormConfig {
  /**
   * 自定义字段配置
   */
  field: CustomFieldConfig;
  /**
   * 表单控件的占位符
   */
  placeholder?: string;
  /**
   * 表单控件的CSS类名
   */
  className?: string;
  /**
   * 表单控件的样式
   */
  style?: React.CSSProperties;
  /**
   * 表单控件的其他属性
   */
  [key: string]: any;
}
