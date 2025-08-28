import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-background">
        <Sidebar collapsible="icon">
          <SidebarNav />
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
