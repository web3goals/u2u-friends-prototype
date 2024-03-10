"use client";

import { siteConfig } from "@/config/site";
import { profileAbi } from "@/contracts/abi/profile";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { emojiAvatarForAddress } from "@/lib/avatars";
import { ProfileMetadata } from "@/types/profile-metadata";
import { useInfiniteReadContracts, useReadContract } from "wagmi";
import EntityList from "./entity-list";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { addressToShortAddress } from "@/lib/converters";
import Link from "next/link";

export function Profiles() {
  const limit = 10;

  const { data: profileOwners } = useInfiniteReadContracts({
    cacheKey: "profileOwners",
    contracts(pageParam) {
      return [...new Array(limit)].map(
        (_, i) =>
          ({
            address: siteConfig.contracts.profile,
            abi: profileAbi,
            functionName: "ownerOf",
            args: [BigInt(pageParam + i)],
          } as const)
      );
    },
    query: {
      initialPageParam: 1,
      getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
        return lastPageParam + limit;
      },
    },
  });

  const profiles = (profileOwners as any)?.pages
    ?.flat(1)
    .map((page: any) => page.result)
    .filter((profile: any) => profile);

  return (
    <EntityList
      entities={profiles}
      renderEntityCard={(profile, index) => (
        <Profile key={index} profile={profile} />
      )}
      noEntitiesText="No profiles 😐"
    />
  );
}

function Profile(props: { profile: `0x${string}` }) {
  /**
   * Define profile metadata
   */
  const { data: profileMetadataUri, isFetched: isProfileMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.profile,
      abi: profileAbi,
      functionName: "getURI",
      args: [props.profile],
    });
  const { data: profileMetadata, isLoaded: isProfileMetadataLoaded } =
    useMetadataLoader<ProfileMetadata>(profileMetadataUri);

  const emojiAvatar = emojiAvatarForAddress(props.profile);

  if (!isProfileMetadataUriFetched || !isProfileMetadataLoaded) {
    return <Skeleton className="w-full h-4" />;
  }

  return (
    <Link href={`/profiles/${props.profile}`}>
      <div className="w-full flex flex-row gap-2 border rounded px-4 py-4">
        {/* Left part */}
        <div>
          {/* Avatar */}
          <Avatar className="size-12">
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback
              style={{ background: emojiAvatar.color }}
              className="text-xl"
            >
              {emojiAvatar.emoji}
            </AvatarFallback>
          </Avatar>
        </div>
        {/* Right part */}
        <div className="w-full">
          <p className="text-base font-bold">{profileMetadata?.name}</p>
          <p className="text-sm text-muted-foreground">
            {addressToShortAddress(props.profile)}
          </p>
          <p className="text-base mt-2">{profileMetadata?.bio}</p>
        </div>
      </div>
    </Link>
  );
}
