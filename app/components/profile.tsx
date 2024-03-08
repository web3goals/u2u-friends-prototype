"use client";

import { siteConfig } from "@/config/site";
import { emojiAvatarForAddress } from "@/lib/avatars";
import { addressToShortAddress } from "@/lib/converters";
import Link from "next/link";
import { isAddressEqual, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

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

  const emojiAvatar = emojiAvatarForAddress(props.address);

  return (
    <div>
      <Avatar className="size-32">
        <AvatarImage src="" alt="Avatar" />
        <AvatarFallback
          style={{ background: emojiAvatar.color }}
          className="text-5xl"
        >
          {emojiAvatar.emoji}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-row gap-2 mt-4">
        <a
          href={`${siteConfig.contracts.chain.blockExplorers.default.url}address/${props.address}`}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          {addressToShortAddress(props.address)}
        </a>{" "}
      </div>
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
