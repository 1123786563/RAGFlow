import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'umi';
import { AppSidebar } from './components/app-sidebar';
import { Header } from './next-header';

export default function NextLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
