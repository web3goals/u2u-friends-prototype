import { siteConfig } from "@/config/site";
import { profileAbi } from "@/contracts/abi/profile";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { ProfileMetadata } from "@/types/profile-metadata";
import { useReadContract } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { emojiAvatarForAddress } from "@/lib/avatars";
import { Skeleton } from "./ui/skeleton";
import { addressToShortAddress } from "@/lib/converters";
import { postAbi } from "@/contracts/abi/post";
import { PostMetadata } from "@/types/post-metadata";
import { Button } from "./ui/button";

export function ProfilePost(props: { address: `0x${string}`; post: bigint }) {
  return (
    <div className="w-full flex flex-col items-center border rounded px-4 py-4">
      <PostHeader address={props.address} post={props.post} />
    </div>
  );
}

function PostHeader(props: { address: `0x${string}`; post: bigint }) {
  /**
   * Define profile metadata
   */
  const { data: profileMetadataUri, isFetched: isProfileMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.profile,
      abi: profileAbi,
      functionName: "getURI",
      args: [props.address],
    });
  const { data: profileMetadata, isLoaded: isProfileMetadataLoaded } =
    useMetadataLoader<ProfileMetadata>(profileMetadataUri);

  /**
   * Define post metadata
   */
  const { data: postMetadataUri, isFetched: isPostMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.post,
      abi: postAbi,
      functionName: "tokenURI",
      args: [props.post],
    });
  const { data: postMetadata, isLoaded: isPostMetadataLoaded } =
    useMetadataLoader<PostMetadata>(postMetadataUri);

  const emojiAvatar = emojiAvatarForAddress(props.address);

  if (
    !isProfileMetadataUriFetched ||
    !isProfileMetadataLoaded ||
    !isPostMetadataUriFetched ||
    !isPostMetadataLoaded
  ) {
    return <Skeleton className="w-full h-4" />;
  }

  return (
    <div className="w-full flex flex-row gap-2">
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
          {addressToShortAddress(props.address)}
          {" · "}
          {new Date(postMetadata?.createdDate || 0).toLocaleString()}
        </p>
        <p className="text-base mt-2">{postMetadata?.text}</p>
        <div className="flex flex-row gap-2 mt-2">
          <Button variant="outline" size="sm" disabled>
            Like X
          </Button>
          <Button variant="outline" size="sm" disabled>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

function PostComments(props: {}) {
  return <></>;
}

function PostComment(props: {}) {
  return <></>;
}
