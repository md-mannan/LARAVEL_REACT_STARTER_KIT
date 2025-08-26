import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { Trash2, Upload, MoreHorizontal } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';
import DeleteUser from '@/components/delete-user';

interface UserData {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    avatar_url?: string;
}

interface PhotoHistoryItem {
    id: number;
    photo_url?: string;
    photo_path?: string;
    is_current: boolean;
    created_at: string;
}

interface ContextMenuState {
    show: boolean;
    x: number;
    y: number;
    photo: PhotoHistoryItem | null;
}

const breadcrumbs = [
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status, userData, photoHistory }: { 
    mustVerifyEmail: boolean; 
    status?: string; 
    userData?: UserData; 
    photoHistory?: PhotoHistoryItem[] 
}) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        show: false,
        x: 0,
        y: 0,
        photo: null,
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState<PhotoHistoryItem | null>(null);
    
    // Use userData if available, otherwise fall back to auth.user
    const user = userData || auth.user;

    // Handle escape key and clicking outside context menu
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeContextMenu();
            }
        };

        const handleClickOutside = () => {
            if (contextMenu.show) {
                closeContextMenu();
            }
        };

        if (contextMenu.show) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu.show]);

    const handleProfilePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            
            setIsUploading(true);
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('profile_photo', file);
            
            // Upload profile photo
            router.post(route('profile.photo'), formData, {
                onSuccess: () => {
                    setIsUploading(false);
                    setPreviewImage(null);
                    // Refresh the page to show new photo
                    window.location.reload();
                },
                onError: () => {
                    setIsUploading(false);
                    setPreviewImage(null);
                    alert('Failed to upload profile photo. Please try again.');
                }
            });
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const removePreview = () => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveProfilePhoto = () => {
        setIsUploading(true);
        
        router.delete(route('profile.photo'), {
            onSuccess: () => {
                setIsUploading(false);
                setShowRemoveConfirm(false);
                // Refresh the page to show updated state
                window.location.reload();
            },
            onError: () => {
                setIsUploading(false);
                alert('Failed to remove profile photo. Please try again.');
            }
        });
    };

    const handleSetPhotoAsCurrent = (photoId: number) => {
        setIsUploading(true);
        
        router.post(route('profile.photo.set-current'), { photo_id: photoId }, {
            onSuccess: () => {
                setIsUploading(false);
                // Refresh the page to show updated state
                window.location.reload();
            },
            onError: () => {
                setIsUploading(false);
                alert('Failed to set photo as current. Please try again.');
            }
        });
    };

    const handleDeletePhoto = (photoId: number) => {
        setIsUploading(true);
        
        router.delete(route('profile.photo.delete'), { data: { photo_id: photoId } }, {
            onSuccess: () => {
                setIsUploading(false);
                setShowDeleteConfirm(false);
                setPhotoToDelete(null);
                // Refresh the page to show updated state
                window.location.reload();
            },
            onError: () => {
                setIsUploading(false);
                alert('Failed to delete photo. Please try again.');
            }
        });
    };

    const handlePhotoContextMenu = (event: React.MouseEvent, photo: PhotoHistoryItem) => {
        event.preventDefault();
        setContextMenu({
            show: true,
            x: event.clientX,
            y: event.clientY,
            photo: photo,
        });
    };

    const handlePhotoClick = (photo: PhotoHistoryItem) => {
        // If it's not the current photo, show a quick preview
        if (!photo.is_current) {
            const photoUrl = photo.photo_url || photo.photo_path;
            if (photoUrl) {
                setPreviewImage(photoUrl);
            }
        }
    };

    const closeContextMenu = () => {
        setContextMenu({ show: false, x: 0, y: 0, photo: null });
    };

    const handleContextMenuAction = (action: string) => {
        if (!contextMenu.photo) return;
        
        switch (action) {
            case 'make_profile_picture': {
                handleSetPhotoAsCurrent(contextMenu.photo.id);
                break;
            }
            case 'download': {
                // Create download link
                const link = document.createElement('a');
                const photoUrl = contextMenu.photo.photo_url || contextMenu.photo.photo_path;
                if (photoUrl) {
                    link.href = photoUrl;
                    link.download = `profile-photo-${contextMenu.photo.id}.jpg`;
                    link.click();
                }
                break;
            }
            case 'delete': {
                // Show custom delete confirmation
                setPhotoToDelete(contextMenu.photo);
                setShowDeleteConfirm(true);
                break;
            }
        }
        
        closeContextMenu();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Status Messages */}
                    {status && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}
                    
                    {/* Profile Photo Section */}
                    <div className="space-y-4">
                        <HeadingSmall title="Profile Photo" description="Update your profile picture" />
                        
                        <div className="flex items-center gap-6">
                            {/* Current Profile Photo */}
                            <div className="relative group">
                                <Avatar className="size-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                                    <AvatarImage 
                                        src={previewImage || user.avatar_url || user.avatar} 
                                        alt={user.name} 
                                    />
                                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-[#614afc] to-[#7c5cfc] text-white text-3xl font-semibold">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                
                                {/* Upload Overlay */}
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-10 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                        onClick={triggerFileUpload}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Upload className="size-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Upload Controls */}
                            <div className="space-y-3">
                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={triggerFileUpload}
                                        disabled={isUploading}
                                        className="bg-[#614afc] hover:bg-[#5a42e8] text-white"
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                                    </Button>
                                    
                                    {/* Remove Current Profile Photo */}
                                    {user.avatar && !previewImage && (
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                onClick={() => setShowRemoveConfirm(true)}
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 border-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="size-4 mr-2" />
                                                Remove Photo
                                            </Button>
                                            
                                            {/* Keep in History button removed as per new_code */}
                                        </div>
                                    )}
                                    
                                    {/* Remove Preview */}
                                    {previewImage && (
                                        <Button
                                            onClick={removePreview}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="size-4 mr-2" />
                                            Remove Preview
                                        </Button>
                                    )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                    JPG, PNG or GIF. Max size 2MB.
                                </p>
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
                    </div>

                    {/* Profile Photo History Section */}
                    {photoHistory && photoHistory.length > 0 && (
                        <div className="space-y-4">
                            <HeadingSmall 
                                title="Photo History" 
                                description="Your previous profile pictures and uploads" 
                            />
                            
                            <div className="photo-history-gallery">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {photoHistory.map((photo, index) => (
                                        <div
                                            key={photo.id}
                                            className="relative group photo-history-item"
                                            onClick={() => handlePhotoClick(photo)}
                                            onContextMenu={(e) => handlePhotoContextMenu(e, photo)}
                                        >
                                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#614afc] transition-colors cursor-pointer">
                                                <img
                                                    src={photo.photo_url || photo.photo_path}
                                                    alt={`Profile photo ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                
                                                {/* Current Photo Badge */}
                                                {photo.is_current && (
                                                    <div className="absolute top-2 right-2 bg-[#614afc] text-white text-xs px-2 py-1 rounded-full font-medium">
                                                        Current
                                                    </div>
                                                )}
                                                
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-8 rounded-full bg-white/20 hover:bg-white/30 text-white"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePhotoContextMenu(e, photo);
                                                        }}
                                                    >
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            {/* Photo Date */}
                                            <div className="mt-2 text-center">
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(photo.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                                Right-click on any photo to see options like making it your profile picture, downloading, or deleting.
                            </p>
                        </div>
                    )}

                    {/* Profile Information Form */}
                    <div className="space-y-4">
                        <HeadingSmall title="Profile Information" description="Update your account's profile information and email address" />
                        
                        <Form
                            method="patch"
                            action={route('profile.update')}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>

                                        <Input
                                            id="name"
                                            className="mt-1 block w-full"
                                            defaultValue={user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                        />

                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            defaultValue={user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Email address"
                                        />

                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    {mustVerifyEmail && user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={route('verification.send')}
                                                    method="post"
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the verification email.
                                                </Link>
                                            </p>

                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has been sent to your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>Save</Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">Saved</p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    <DeleteUser />
                </div>
            </SettingsLayout>
            
            {/* Custom Remove Photo Confirmation Dialog */}
            {showRemoveConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 custom-confirmation-dialog">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl dialog-content">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Remove Profile Photo</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to remove your profile photo? This will delete the image permanently and revert to showing your initials.
                        </p>
                        
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowRemoveConfirm(false)}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRemoveProfilePhoto}
                                disabled={isUploading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isUploading ? 'Removing...' : 'Remove Photo'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Photo Confirmation Dialog */}
            {showDeleteConfirm && photoToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 custom-confirmation-dialog">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl dialog-content">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Photo</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700 mb-3">
                                Are you sure you want to delete this photo from your history? This will permanently remove it and cannot be restored.
                            </p>
                            
                            {/* Photo Preview */}
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                                    <img
                                        src={photoToDelete.photo_url || photoToDelete.photo_path}
                                        alt="Photo to delete"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDeletePhoto(photoToDelete.id);
                                    setShowDeleteConfirm(false);
                                }}
                                disabled={isUploading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isUploading ? 'Deleting...' : 'Delete Photo'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Facebook-Style Context Menu */}
            {contextMenu.show && (
                <div className="fixed inset-0 z-50" onClick={closeContextMenu}>
                    <div 
                        className="absolute bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-48 context-menu"
                        style={{
                            left: contextMenu.x,
                            top: contextMenu.y,
                            transform: 'translateY(-100%)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-4 py-2 border-b border-gray-100">
                            <div className="text-sm font-medium text-gray-900">Photo Options</div>
                        </div>
                        
                        <div className="py-1">
                            <button
                                onClick={() => handleContextMenuAction('make_profile_picture')}
                                disabled={isUploading || contextMenu.photo?.is_current}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 context-menu-item"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                                {contextMenu.photo?.is_current ? 'Current Profile Picture' : 'Make Profile Picture'}
                            </button>
                            
                            <button
                                onClick={() => handleContextMenuAction('download')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 context-menu-item"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download
                            </button>
                            
                            <button
                                onClick={() => handleContextMenuAction('delete')}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 context-menu-item"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
