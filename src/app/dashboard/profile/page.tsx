import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
            <ProfileForm />
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here. After changing you will be logged out.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Password change form could be added here */}
             <p className="text-sm text-muted-foreground">Password management form to be implemented.</p>
        </CardContent>
      </Card>
    </div>
  )
}
