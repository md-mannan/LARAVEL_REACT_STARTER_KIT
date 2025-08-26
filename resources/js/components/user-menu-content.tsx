import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, Upload, User as UserIcon } from 'lucide-react';
import { useRef, useState } from 'react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('profile_photo', file);
            
            // Upload profile photo
            router.post(route('profile.photo'), formData, {
                onSuccess: () => {
                    setIsUploading(false);
                    // Refresh the page to show new photo
                    window.location.reload();
                },
                onError: () => {
                    setIsUploading(false);
                    alert('Failed to upload profile photo. Please try again.');
                }
            });
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="user-menu-dropdown">
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-start gap-3 px-3 py-3 text-left min-w-0">
                    {/* Profile Photo with Upload */}
                    <div className="relative group flex-shrink-0">
                        <Avatar className="size-12 overflow-hidden rounded-full">
                            <AvatarImage src={user.avatar_url || user.avatar || undefined} alt={user.name} />
                            <AvatarFallback className="rounded-lg bg-gradient-to-br from-[#614afc] to-[#7c5cfc] text-white text-lg font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        
                        {/* Upload Overlay */}
                        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                onClick={triggerFileUpload}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Upload className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex flex-col min-w-0 flex-1 user-info">
                        <span className="font-semibold text-foreground truncate">{user.name || 'Super Admin'}</span>
                        <span className="text-sm text-muted-foreground user-email">{user.email}</span>
                    </div>
                </div>
                
                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoUpload}
                />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <UserIcon className="mr-2" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Logout
                </Link>
            </DropdownMenuItem>
        </div>
    );
}
