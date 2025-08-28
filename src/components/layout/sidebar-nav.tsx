'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  TrendingUp,
  CalendarDays,
  BarChart,
  Settings,
  LogOut,
  Instagram,
  Youtube,
  Linkedin,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trends', label: 'Trend Discovery', icon: TrendingUp },
  { href: '/plan', label: 'Content Plan', icon: CalendarDays },
  { href: '/analytics', label: 'Analytics', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const socialPlatforms = [
  { name: 'Instagram', icon: Instagram, connected: true },
  { name: 'YouTube', icon: Youtube, connected: true },
  { name: 'LinkedIn', icon: Linkedin, connected: false },
]

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/">
          <Logo className="h-7 w-auto text-foreground" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <Separator className="my-4" />
        <div className="px-4 mb-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase group-data-[collapsible=icon]:hidden">
            Platforms
        </div>
        <div className="px-2 space-y-1">
            {socialPlatforms.map((platform) => (
                <Button variant="ghost" key={platform.name} className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0">
                    <platform.icon className="size-4" />
                    <span className="group-data-[collapsible=icon]:hidden">{platform.name}</span>
                    {platform.connected && <CheckCircle className="ml-auto w-4 h-4 text-primary group-data-[collapsible=icon]:hidden"/>}
                </Button>
            ))}
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://picsum.photos/100/100" alt="User" data-ai-hint="female person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm">Jane Doe</span>
            <span className="text-xs text-muted-foreground">jane.doe@example.com</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden">
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
