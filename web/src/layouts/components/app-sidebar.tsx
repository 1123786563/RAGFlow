import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { useTheme } from '@/components/theme-provider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useNavigateWithFromState } from '@/hooks/route-hook';
import { useFetchUserInfo } from '@/hooks/user-setting-hooks';
import { Routes } from '@/routes';
import {
  Cpu,
  File,
  House,
  Library,
  MessageSquareText,
  Search,
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'umi';

/**
 * 全局应用侧边栏组件
 * 包含导航菜单、Logo 和用户信息
 */
export function AppSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigateWithFromState();
  const { theme } = useTheme();

  const {
    data: { avatar, nickname },
  } = useFetchUserInfo();

  // 导航菜单项配置
  const menuItems = useMemo(
    () => [
      { path: Routes.Root, name: t('header.home'), icon: House },
      { path: Routes.Datasets, name: t('header.dataset'), icon: Library },
      { path: Routes.Chats, name: t('header.chat'), icon: MessageSquareText },
      { path: Routes.Searches, name: t('header.search'), icon: Search },
      { path: Routes.Agents, name: t('header.flow'), icon: Cpu },
      { path: Routes.Files, name: t('header.fileManager'), icon: File },
    ],
    [t],
  );

  const handleMenuClick = (path: string) => {
    navigate(path as Routes);
  };

  const handleLogoClick = () => {
    navigate(Routes.Root);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src={theme === 'light' ? '/logo.svg' : '/logo.svg'}
            alt="RAGFlow Logo"
            className="size-8"
          />
          <span className="text-lg font-semibold">RAGFlow</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.path);

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleMenuClick(item.path)}
                      tooltip={item.name}
                    >
                      <Icon className="size-4" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
          <RAGFlowAvatar
            name={nickname}
            avatar={avatar}
            isPerson
            className="size-8"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{nickname}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
