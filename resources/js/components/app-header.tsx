import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Menu } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];



const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    

    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Sidebar Toggle Button - Always Visible */}
                    <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px] sidebar-toggle">
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link href="/dashboard" prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Page Title - Center */}
                    <div className="flex-1 flex justify-center">
                        <h1 className="text-xl font-semibold text-foreground">
                            {page.url === '/dashboard' ? 'Dashboard' : 
                             page.url === '/ledger' ? 'Ledger' : 
                             page.url === '/transaction' ? 'Transaction' : 
                             page.url === '/categories' ? 'Categories' : 'Dashboard'}
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        {/* User Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1 header-user-profile">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.name || 'User'} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
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
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
