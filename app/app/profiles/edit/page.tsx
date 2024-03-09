import { ProfileEditForm } from "@/components/profile-edit-form";
import { Separator } from "@/components/ui/separator";

export default function ProfileEditPage() {
  return (
    <div className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          That&apos;s how others will see you here
        </p>
      </div>
      <Separator className="my-6" />
      <ProfileEditForm />
    </div>
  );
}
