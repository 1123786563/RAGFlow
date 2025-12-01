/**
 * 数据导出工具
 * 用于将数据导出为Excel或CSV格式
 */

import { utils, writeFile } from 'xlsx';

/**
 * 导出选项
 */
export interface ExportOptions {
  /**
   * 导出的文件名
   */
  filename?: string;
  /**
   * 导出的工作表名称
   */
  sheetName?: string;
  /**
   * 导出的列配置
   */
  columns?: Array<{
    /**
     * 列标题
     */
    title: string;
    /**
     * 列数据的键名
     */
    key: string;
    /**
     * 列数据的格式化函数
     */
    format?: (value: any, row: any) => any;
  }>;
}

/**
 * 将数据导出为Excel文件
 * @param data 要导出的数据
 * @param options 导出选项
 */
export const exportToExcel = <T extends Record<string, any>>(data: T[], options: ExportOptions = {}): void => {
  const {
    filename = 'export.xlsx',
    sheetName = 'Sheet1',
    columns = [],
  } = options;
  
  let exportData: any[] = data;
  
  // 如果提供了列配置，转换数据格式
  if (columns.length > 0) {
    exportData = data.map((row) => {
      const newRow: Record<string, any> = {};
      
      columns.forEach((column) => {
        const value = row[column.key];
        newRow[column.title] = column.format ? column.format(value, row) : value;
      });
      
      return newRow;
    });
  }
  
  // 创建工作簿和工作表
  const workbook = utils.book_new();
  const worksheet = utils.json_to_sheet(exportData);
  
  // 调整列宽
  const columnWidths = columns.length > 0
    ? columns.map(() => ({ wch: 20 }))
    : Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }));
  
  worksheet['!cols'] = columnWidths;
  
  // 添加工作表到工作簿
  utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // 导出文件
  writeFile(workbook, filename);
};

/**
 * 将数据导出为CSV文件
 * @param data 要导出的数据
 * @param options 导出选项
 */
export const exportToCsv = <T extends Record<string, any>>(data: T[], options: ExportOptions = {}): void => {
  const {
    filename = 'export.csv',
    columns = [],
  } = options;
  
  let exportData: any[] = data;
  let headers: string[] = [];
  
  // 如果提供了列配置，转换数据格式
  if (columns.length > 0) {
    headers = columns.map((column) => column.title);
    exportData = data.map((row) => {
      return columns.map((column) => {
        const value = row[column.key];
        return column.format ? column.format(value, row) : value;
      });
    });
  } else if (data.length > 0) {
    // 否则使用数据的键作为列标题
    headers = Object.keys(data[0]);
    exportData = data.map((row) => Object.values(row));
  }
  
  // 生成CSV内容
  const csvContent = [
    headers.join(','), // 表头
    ...exportData.map((row) => {
      // 处理包含逗号、引号和换行符的数据
      return row.map((cell: any) => {
        if (typeof cell === 'string') {
          // 如果单元格包含逗号、引号或换行符，用引号包裹
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            // 转义引号
            cell = cell.replace(/"/g, '""');
            // 用引号包裹
            cell = `"${cell}"`;
          }
        }
        return cell;
      }).join(',');
    }),
  ].join('\n');
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // 添加到文档并触发下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 将数据导出为文件
 * @param data 要导出的数据
 * @param format 导出格式
 * @param options 导出选项
 */
export const exportData = <T extends Record<string, any>>(
  data: T[],
  format: 'excel' | 'csv',
  options: ExportOptions = {}
): void => {
  if (format === 'excel') {
    exportToExcel(data, options);
  } else {
    exportToCsv(data, options);
  }
};
