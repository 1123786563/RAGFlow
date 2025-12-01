/**
 * XSS防护工具
 * 用于过滤和转义用户输入，防止XSS攻击
 */

/**
 * 转义HTML特殊字符
 * @param str 要转义的字符串
 * @returns 转义后的字符串
 */
export const escapeHtml = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * 转义CSS特殊字符
 * @param str 要转义的字符串
 * @returns 转义后的字符串
 */
export const escapeCss = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/[\x00-\x1f\x7f-\x9f"'<>]/g, (char) => {
    return `\\${char.charCodeAt(0).toString(16)} `;
  });
};

/**
 * 转义JavaScript特殊字符
 * @param str 要转义的字符串
 * @returns 转义后的字符串
 */
export const escapeJs = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/[\x00-\x1f\x7f"'<>]/g, (char) => {
    return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
  });
};

/**
 * 过滤危险的HTML标签和属性
 * @param html 要过滤的HTML字符串
 * @returns 过滤后的HTML字符串
 */
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return html;
  
  // 允许的HTML标签
  const allowedTags = new Set([
    'div', 'span', 'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'strong', 'em', 'b', 'i', 'u', 's', 'sup', 'sub', 'code', 'pre',
    'a', 'img', 'video', 'audio', 'source',
    'blockquote', 'cite', 'q', 'abbr', 'acronym', 'dfn',
    'mark', 'small', 'del', 'ins', 'kbd', 'samp', 'var',
    'figure', 'figcaption', 'data', 'time'
  ]);
  
  // 允许的HTML属性
  const allowedAttributes = new Set([
    'id', 'class', 'style', 'title', 'alt', 'src', 'href', 'target',
    'width', 'height', 'loading', 'decoding', 'autoplay', 'controls',
    'loop', 'muted', 'poster', 'preload', 'type', 'datetime', 'data-*'
  ]);
  
  // 创建一个临时DOM元素用于解析HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 递归过滤所有元素
  const filterElement = (element: Element) => {
    // 检查标签是否允许
    if (!allowedTags.has(element.tagName.toLowerCase())) {
      element.remove();
      return;
    }
    
    // 过滤属性
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      const attrName = attr.name.toLowerCase();
      // 检查属性是否允许
      if (!allowedAttributes.has(attrName) && !attrName.startsWith('data-')) {
        element.removeAttribute(attr.name);
      } else if (attrName === 'href' || attrName === 'src') {
        // 检查链接和资源URL是否安全
        const url = attr.value;
        if (url.startsWith('javascript:') || url.startsWith('vbscript:')) {
          element.removeAttribute(attr.name);
        }
      } else if (attrName === 'style') {
        // 过滤CSS样式
        element.setAttribute(attr.name, escapeCss(attr.value));
      }
    });
    
    // 递归过滤子元素
    Array.from(element.children).forEach(filterElement);
  };
  
  // 过滤所有子元素
  Array.from(tempDiv.children).forEach(filterElement);
  
  return tempDiv.innerHTML;
};

/**
 * 安全地设置HTML内容
 * @param element DOM元素
 * @param html 要设置的HTML字符串
 */
export const setSafeHtml = (element: Element, html: string): void => {
  if (element && html) {
    element.innerHTML = sanitizeHtml(html);
  }
};
