import { useEffect, useState } from 'react';

/**
 * 自定义Hook，用于管理API数据获取
 * @template T - API返回数据的类型
 * @param {() => T} apiCall - API调用函数
 * @param {T} initialData - 初始数据
 * @returns {Object} - 包含数据、加载状态和错误状态的对象
 */
export const useApiData = <T>(apiCall: () => T, initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        setError(null);
        const result = apiCall();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('API调用失败'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiCall]);

  return { data, loading, error };
};
