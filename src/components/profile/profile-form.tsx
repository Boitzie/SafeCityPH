
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect } from "react";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Upload, Loader2 } from "lucide-react"
import type { UserProfile } from "@/lib/types"


const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneNumber: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => firestore && user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
    },
    mode: "onChange",
  })
  
  useEffect(() => {
    if (userProfile) {
      form.reset({
        fullName: userProfile.fullName || '',
        phoneNumber: userProfile.phoneNumber || '',
      });
    }
  }, [userProfile, form]);

  function onSubmit(data: ProfileFormValues) {
    if (!userProfileRef) return;
    updateDocumentNonBlocking(userProfileRef, data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  };
  
  const displayName = userProfile?.fullName || user?.displayName || '';

  if (isProfileLoading) {
      return (
          <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20">
                {userProfile?.avatarUrl && <AvatarImage src={userProfile.avatarUrl} alt={`@${displayName}`} />}
                <AvatarFallback className="text-2xl">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" type="button">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
            </Button>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in reports.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Your phone number" {...field} />
              </FormControl>
              <FormDescription>
                Your contact phone number (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  )
}
