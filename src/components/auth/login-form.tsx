"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") as UserRole | null;

  const [role, setRole] = useState<UserRole | "">(initialRole || "doctor");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!role) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      router.push(`/${role}`);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>I am a...</Label>
        <RadioGroup
          defaultValue={role}
          onValueChange={(value) => setRole(value as UserRole)}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="doctor" id="doctor" className="peer sr-only" />
            <Label
              htmlFor="doctor"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              Doctor
            </Label>
          </div>
          <div>
            <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
             <Label
              htmlFor="patient"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              Patient
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" defaultValue="demo@vital.watch" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-sm underline">Forgot Password?</Link>
        </div>
        <Input id="password" type="password" defaultValue="password" required />
      </div>
      
      <Button type="submit" className="w-full" disabled={!role || isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
