'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { placeholderImages } from '@/lib/placeholder-images.json';
import { Icons } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn, useAuth } from '@/firebase';

export default function LoginPage() {
  const bgImage = placeholderImages.find(p => p.id === 'login-background');
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@gmail.scph.gov');
  const [password, setPassword] = useState('admin123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    initiateEmailSignIn(auth, email, password);
    // The auth state change will be handled by the onAuthStateChanged listener in FirebaseProvider
    // and will redirect if successful. For now, we'll optimistically navigate.
    router.push('/dashboard');
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Makati Guardian</h1>
            </div>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@gmail.scph.gov" required value={email} onChange={(e) => setEmail(e.target.value)} />
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
