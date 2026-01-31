'use client';
import * as React from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { Home, List, Bell, Loader2, Calendar, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';


function BottomNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/patient', icon: <Home size={24}/>, label: 'Home' },
    { href: '/patient/health-data', icon: <List size={24}/>, label: 'Records' },
    { href: '/patient/appointments', icon: <Calendar size={24} />, label: 'Schedule' },
    { href: '/patient/alerts', icon: <Bell size={24}/>, label: 'Alerts' },
    { href: '/patient/settings', icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-transparent">
        <div className="mx-auto max-w-sm h-full p-2">
            <div className="flex h-full items-center justify-around rounded-full bg-card shadow-lg border">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className={cn(
                        "flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-muted-foreground transition-colors w-16",
                        pathname === item.href ? 'text-primary' : 'hover:text-primary'
                    )}>
                        {item.icon}
                        <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  );
}

const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('');
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'patient')) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || userProfile?.role !== 'patient') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
        <header className="flex h-16 items-center justify-between gap-4 border-b bg-card px-6 sticky top-0 z-40">
            <div className='flex items-center gap-3'>
                 <Avatar>
                    <AvatarImage src={userProfile?.avatarUrl || ''} alt={userProfile?.displayName || 'User Avatar'} />
                    <AvatarFallback>{getInitials(userProfile?.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-lg font-bold font-headline">Welcome, {userProfile?.displayName}</p>
                </div>
            </div>
            {/* Future icons for device status etc. can go here */}
        </header>
        <main className="flex-1 pb-24"> 
            {children}
        </main>
        <BottomNav />
    </div>
  );
}
