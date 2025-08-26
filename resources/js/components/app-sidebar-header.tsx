import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            
            {/* User Profile - Right Side */}
            <div className="ml-auto flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-10 rounded-full p-1 header-user-profile">
                            <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage src={auth?.user?.avatar_url || auth?.user?.avatar || undefined} alt={auth?.user?.name || 'User'} />
                                                                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-[#614afc] to-[#7c5cfc] text-white font-semibold">
                                            {auth?.user ? getInitials(auth.user.name) : 'S'}
                                        </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-72" align="end">
                        {auth?.user ? (
                            <UserMenuContent user={auth.user} />
                        ) : (
                            <div className="p-4 text-center">
                                <div className="text-sm font-medium">Super Admin</div>
                                <div className="text-xs text-muted-foreground">admin@cashmanagement.com</div>
                                <div className="mt-2 space-y-1">
                                    <div className="text-sm">Profile</div>
                                    <div className="text-sm">Settings</div>
                                    <div className="text-sm">Logout</div>
                                </div>
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
