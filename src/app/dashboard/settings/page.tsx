'use client'

import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import type { UserProfile } from "@/lib/types"


function AppearanceSettings() {
  const { setTheme, theme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label>Theme</Label>
          <div className="flex items-center space-x-2">
            <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationSettings() {
    const { user } = useUser();
    const firestore = useFirestore();
    const userProfileRef = useMemoFirebase(() => firestore && user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
    const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

    const handleNotificationChange = (key: string, value: boolean) => {
        if (!userProfileRef) return;
        updateDocumentNonBlocking(userProfileRef, {
            [`notificationPreferences.${key}`]: value
        });
    }

    return (
         <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Manage how you receive notifications.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                 <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        New Reports
                        </p>
                        <p className="text-sm text-muted-foreground">
                        Receive an email for every new incident report.
                        </p>
                    </div>
                    <Switch 
                        checked={userProfile?.notificationPreferences?.newReport ?? false}
                        onCheckedChange={(checked) => handleNotificationChange('newReport', checked)}
                    />
                </div>
                 <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                        Status Updates
                        </p>
                        <p className="text-sm text-muted-foreground">
                         Receive an email when a report status is updated.
                        </p>
                    </div>
                    <Switch 
                         checked={userProfile?.notificationPreferences?.statusChange ?? false}
                         onCheckedChange={(checked) => handleNotificationChange('statusChange', checked)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
        </Link>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings, theme preferences, and notifications.
        </p>
      </div>
      <Separator />
      <AppearanceSettings />
      <NotificationSettings />
    </div>
  )
}
