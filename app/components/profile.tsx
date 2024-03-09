"use client";

import { siteConfig } from "@/config/site";
import { profileAbi } from "@/contracts/abi/profile";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { emojiAvatarForAddress } from "@/lib/avatars";
import { addressToShortAddress } from "@/lib/converters";
import { ProfileMetadata } from "@/types/profile-metadata";
import Link from "next/link";
import { isAddressEqual, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export function Profile(props: { address: `0x${string}` }) {
  return (
    <>
      <ProfileHeader address={props.address} />
      <Separator className="my-8" />
    </>
  );
}

function ProfileHeader(props: { address: `0x${string}` }) {
  const { address } = useAccount();

  /**
   * Define profile metadata
   */
  const { data: metadataUri, isFetched: isMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.profile,
      abi: profileAbi,
      functionName: "getURI",
      args: [props.address],
    });
  const { data: metadata, isLoaded: isMetadataLoaded } =
    useMetadataLoader<ProfileMetadata>(metadataUri);

  const emojiAvatar = emojiAvatarForAddress(props.address);

  if (!isMetadataUriFetched || !isMetadataLoaded) {
    return <Skeleton className="h-4" />;
  }

  return (
    <div>
      {/* Avatar */}
      <Avatar className="size-32">
        <AvatarImage src="" alt="Avatar" />
        <AvatarFallback
          style={{ background: emojiAvatar.color }}
          className="text-5xl"
        >
          {emojiAvatar.emoji}
        </AvatarFallback>
      </Avatar>
      {/* Name */}
      {metadata?.name && (
        <h2 className="text-2xl font-bold tracking-tight mt-4">
          {metadata.name}
        </h2>
      )}
      {/* Bio */}
      {metadata?.bio && (
        <p className="text-muted-foreground mt-2">{metadata.bio}</p>
      )}
      {/* Links */}
      <div className="flex flex-row gap-4 mt-4">
        <a
          href={`${siteConfig.contracts.chain.blockExplorers.default.url}address/${props.address}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium underline underline-offset-4"
        >
          {addressToShortAddress(props.address)}
        </a>{" "}
        {metadata?.website && (
          <a
            href={metadata.website}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            {metadata.website}
          </a>
        )}
      </div>
      {/* Edit button */}
      {isAddressEqual(props.address, address || zeroAddress) && (
        <Link href="/profiles/edit">
          <Button variant="outline" className="mt-4">
            Edit
          </Button>
        </Link>
      )}
    </div>
  );
}
