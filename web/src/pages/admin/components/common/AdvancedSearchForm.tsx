import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// 高级搜索表单数据类型
export interface AdvancedSearchFormData {
  /**
   * 全局搜索关键词
   */
  keyword?: string;
  /**
   * 角色过滤
   */
  role?: string;
  /**
   * 状态过滤
   */
  status?: 'active' | 'inactive' | '';
  /**
   * 创建时间范围开始
   */
  createdAtStart?: Date;
  /**
   * 创建时间范围结束
   */
  createdAtEnd?: Date;
  /**
   * 最后登录时间范围开始
   */
  lastLoginStart?: Date;
  /**
   * 最后登录时间范围结束
   */
  lastLoginEnd?: Date;
}

// 高级搜索表单属性
interface AdvancedSearchFormProps {
  /**
   * 角色列表
   */
  roles?: Array<{ id: string; role_name: string }>;
  /**
   * 初始表单数据
   */
  defaultValues?: Partial<AdvancedSearchFormData>;
  /**
   * 提交回调
   */
  onSubmit: (data: AdvancedSearchFormData) => void;
  /**
   * 重置回调
   */
  onReset: () => void;
}

/**
 * 高级搜索表单组件
 * 用于实现高级搜索和过滤功能
 */
export const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({
  roles = [],
  defaultValues = {},
  onSubmit,
  onReset,
}) => {
  const { t } = useTranslation();

  // 定义表单验证规则
  const schema = z.object({
    keyword: z.string().optional(),
    role: z.string().optional(),
    status: z.enum(['active', 'inactive', '']).optional(),
    createdAtStart: z.date().optional(),
    createdAtEnd: z.date().optional(),
    lastLoginStart: z.date().optional(),
    lastLoginEnd: z.date().optional(),
  });

  // 初始化表单
  const form = useForm<AdvancedSearchFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      keyword: '',
      role: '',
      status: '',
      createdAtStart: undefined,
      createdAtEnd: undefined,
      lastLoginStart: undefined,
      lastLoginEnd: undefined,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 全局搜索 */}
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.keyword')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('admin.searchPlaceholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 角色过滤 */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.role')}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="">{t('admin.all')}</SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.role_name}>
                            {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 状态过滤 */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.status')}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="">{t('admin.all')}</SelectItem>
                        <SelectItem value="active">{t('admin.active')}</SelectItem>
                        <SelectItem value="inactive">{t('admin.inactive')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 创建时间范围开始 */}
          <FormField
            control={form.control}
            name="createdAtStart"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('admin.createdAtStart')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'yyyy-MM-dd') : <span>{t('admin.selectDate')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 创建时间范围结束 */}
          <FormField
            control={form.control}
            name="createdAtEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('admin.createdAtEnd')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'yyyy-MM-dd') : <span>{t('admin.selectDate')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 最后登录时间范围开始 */}
          <FormField
            control={form.control}
            name="lastLoginStart"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('admin.lastLoginStart')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'yyyy-MM-dd') : <span>{t('admin.selectDate')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 最后登录时间范围结束 */}
          <FormField
            control={form.control}
            name="lastLoginEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('admin.lastLoginEnd')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'yyyy-MM-dd') : <span>{t('admin.selectDate')}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              onReset();
            }}
          >
            {t('admin.reset')}
          </Button>
          <Button type="submit">
            {t('admin.search')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
