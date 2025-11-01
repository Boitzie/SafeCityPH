'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useMemo } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useCollection, updateDocumentNonBlocking } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Upload } from "lucide-react"
import type { Department, UserProfile } from "@/lib/types"


const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  departmentId: z.string({
    required_error: "Please select a department.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemo(() => firestore && user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const departmentsQuery = useMemo(() => firestore ? collection(firestore, 'departments') : null, [firestore]);
  const { data: departments } = useCollection<Department>(departmentsQuery);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      departmentId: '',
    },
    mode: "onChange",
  })
  
  useEffect(() => {
    if (userProfile) {
      form.reset({
        fullName: userProfile.fullName,
        departmentId: userProfile.departmentId,
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
  
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-4">
             <Avatar className="h-20 w-20">
                {user?.photoURL && <AvatarImage src={user.photoURL} alt={`@${user.displayName}`} />}
                <AvatarFallback className="text-2xl">{getInitials(userProfile?.fullName || user?.displayName || '')}</AvatarFallback>
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
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments?.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Your assigned department for incident management.
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
