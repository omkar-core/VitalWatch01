import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/lib/types";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { placeholderImages } from "@/lib/placeholder-images";

type DashboardHeaderProps = {
  userRole: 'doctor' | 'patient' | 'admin';
  title: string;
};

export function DashboardHeader({ userRole, title }: DashboardHeaderProps) {
    const userImage = placeholderImages.find(p => p.id === 'doctor-avatar-female');

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
        <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <h1 className="font-headline text-xl font-semibold">{title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            {userImage && <Image src={userImage.imageUrl} width={36} height={36} alt="User Avatar" className="rounded-full" data-ai-hint={userImage.imageHint}/>}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href="/login">
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
