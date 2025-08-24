'use client';

import { Bell, Files, Globe, Home, Link as LinkIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSpace } from '@/hooks/use-space';
import type { User } from 'better-auth';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import UserDropdown from './user-dropdown';

export default function DashboardLayout(
  props: React.PropsWithChildren & {
    user: User;
    isLoading: boolean;
  },
) {
  const { user, isLoading } = props;
  const { spaceSlug }: { spaceSlug: string } = useParams();
  const router = useRouter();
  const { space } = useSpace();
  const { sidebarTitle } = useSidebar();

  const navigationItems = [
    {
      title: 'Overview',
      icon: Home,
      url: `/${spaceSlug}/overview`,
      isActive: true,
    },
    {
      title: 'Files',
      icon: Files,
      url: `/${spaceSlug}/files`,
    },
    {
      title: 'Links',
      icon: LinkIcon,
      url: `/${spaceSlug}/links`,
    },
    {
      title: 'Domains',
      icon: Globe,
      url: `/${spaceSlug}/domains`,
    },
  ];

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <span className="flex items-center justify-between gap-2">
              <SidebarMenuItem className="w-full">
                <SidebarMenuButton size="lg" asChild>
                  <a href="#" className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Home className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">{space?.name}</span>
                      <span className="text-muted-foreground text-xs">
                        v1.0.0
                      </span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
      <SidebarMenuButton className="h-full" size="lg" asChild>
        <SidebarTrigger className="-ml-1 w-full" />
      </SidebarMenuButton>
    </SidebarMenuItem> */}
            </span>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={window.location.pathname.endsWith(item.url)}
                >
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {/* Page Title */}
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-lg font-semibold">{sidebarTitle}</h1>
          </div>

          {/* Right side of navbar */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Profile Dropdown or Sign In */}
            {isLoading && (
              <Skeleton className="h-9 w-18 px-4 py-2 has-[>svg]:px-3"></Skeleton>
            )}
            {user && <UserDropdown {...props} />}
            {!user && !isLoading && (
              <Button onClick={() => router.push('/auth/login')}>Log in</Button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col gap-4 p-4">{props.children}</div>
      </SidebarInset>
    </>
  );
}
