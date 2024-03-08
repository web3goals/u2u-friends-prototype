import { Profile } from "@/components/profile";
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
        <Profile address={params.address} />
      ) : (
        <Skeleton className="h-4" />
      )}
    </div>
  );
}
