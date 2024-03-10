"use client";

import { siteConfig } from "@/config/site";
import { postAbi } from "@/contracts/abi/post";
import { isAddressEqual, zeroAddress } from "viem";
import { useAccount, useReadContract } from "wagmi";
import EntityList from "./entity-list";
import { ProfilePost } from "./profile-post";
import { ProfilePostCreateDialog } from "./profile-post-create-dialog";

export function ProfilePosts(props: { address: `0x${string}` }) {
  const { address } = useAccount();

  /**
   * Define profile posts
   */
  const { data: posts, refetch: refetchPosts } = useReadContract({
    address: siteConfig.contracts.post,
    abi: postAbi,
    functionName: "getPosts",
    args: [props.address],
  });

  return (
    <div className="flex flex-col items-start gap-4">
      {isAddressEqual(props.address, address || zeroAddress) && (
        <ProfilePostCreateDialog onCreate={() => refetchPosts()} />
      )}
      <EntityList
        entities={posts?.toReversed()}
        renderEntityCard={(post: bigint, index: number) => (
          <ProfilePost key={index} address={props.address} post={post} />
        )}
        noEntitiesText="No posts 😐"
      />
    </div>
  );
}
