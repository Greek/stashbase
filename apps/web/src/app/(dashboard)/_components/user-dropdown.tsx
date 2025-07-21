import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { User } from 'better-auth';
import { LogOut, Settings, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserDropdown(props: { user: User }) {
  const { user } = props;
  const userRealNameSplit = user.name.split(' ');
  const router = useRouter();

  const dropdownOptions = [
    {
      label: 'Profile',
      icon: UserIcon,
      action: () => router.push('/i/profile'),
    },
    {
      label: 'Settings',
      icon: Settings,
      action: () => router.push('/i/settings'),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/placeholder.svg?height=32&width=32"
              alt="Profile"
            />
            <AvatarFallback>
              {userRealNameSplit[0][0]} {userRealNameSplit?.[1]?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dropdownOptions.map((opt) => (
          <>
            <DropdownMenuItem onClick={opt.action}>
              <opt.icon className="mr-2 h-4 w-4" />
              <span>{opt.label}</span>
            </DropdownMenuItem>
          </>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => authClient.signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
