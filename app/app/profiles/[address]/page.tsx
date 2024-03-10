import { ProfileHeader } from "@/components/profile-header";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { isAddress } from "viem";

export default function ProfilePage({
  params,
}: {
  params: { address: string };
}) {
  return (
    <div className="container py-10 lg:px-96">
      {isAddress(params.address) ? (
        <>
          <ProfileHeader address={params.address} />
          <Separator className="my-8" />
        </>
      ) : (
        <Skeleton className="h-4" />
      )}
    </div>
  );
}
