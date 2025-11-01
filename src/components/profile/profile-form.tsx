'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { useUser, useFirestore, useCollection } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User, Upload } from "lucide-react"
import { useMemo } from "react"
import { Department } from "@/lib/types"


const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  department: z.string({
    required_error: "Please select a department.",
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();

  const departmentsQuery = useMemo(() => firestore ? collection(firestore, 'departments') : null, [firestore]);
  const { data: departments } = useCollection<Department>(departmentsQuery);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // TODO: fetch user data from firestore
    // defaultValues: {
    //   fullName: mockUser.fullName,
    //   department: mockUser.department,
    // },
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }
  
  const getInitials = (name: string) => {
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
                <AvatarFallback className="text-2xl">{user?.displayName ? getInitials(user.displayName) : 'U'}</AvatarFallback>
            </Avatar>
            <Button variant="outline">
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments?.map(dept => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
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
