
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn, useUser, useAuth } from '@/firebase';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  const bgImage = placeholderImages.find(p => p.id === 'login-background');
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Could not connect to authentication service.",
        });
        return;
    }
    initiateEmailSignIn(auth, email, password).catch(error => {
         toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message || "An unexpected error occurred.",
        });
    });
  };

  if (isUserLoading || (!isUserLoading && user)) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Icons.logo className="h-8 w-8" />
              <h1 className="text-3xl font-bold">SafeCityPH</h1>
            </div>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                fill
                className="object-cover dark:brightness-[0.2] dark:grayscale"
                data-ai-hint={bgImage.imageHint}
            />
        )}
      </div>
    </div>
  );
}
