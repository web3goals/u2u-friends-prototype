import { Profiles } from "@/components/profiles";
import { Separator } from "@/components/ui/separator";

export default function ProfilesPage() {
  return (
    <div className="container py-10 lg:px-80">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profiles</h2>
        <p className="text-muted-foreground">
          People who can become your friends
        </p>
      </div>
      <Separator className="my-6" />
      <Profiles />
    </div>
  );
}
