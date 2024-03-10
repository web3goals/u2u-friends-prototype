import { siteConfig } from "@/config/site";
import { postAbi } from "@/contracts/abi/post";
import { profileAbi } from "@/contracts/abi/profile";
import useError from "@/hooks/useError";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { emojiAvatarForAddress } from "@/lib/avatars";
import { addressToShortAddress } from "@/lib/converters";
import { PostMetadata } from "@/types/post-metadata";
import { ProfileMetadata } from "@/types/profile-metadata";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { zeroAddress } from "viem";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/use-toast";

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
          <PostHeaderLikeButton post={props.post} />
          <Button variant="outline" size="sm" disabled>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}

function PostHeaderLikeButton(props: { post: bigint }) {
  const { handleError } = useError();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const {
    data: likers,
    isFetched: isLikersFetched,
    refetch: refetchLikers,
  } = useReadContract({
    address: siteConfig.contracts.post,
    abi: postAbi,
    functionName: "getLikers",
    args: [props.post],
  });

  const isLiked = likers?.includes(address || zeroAddress);

  async function onSubmit() {
    try {
      setIsFormSubmitting(true);
      // Check clients
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      if (!walletClient) {
        throw new Error("Wallet is not connected");
      }
      // Send request
      const { request } = await publicClient.simulateContract({
        address: siteConfig.contracts.post,
        abi: postAbi,
        functionName: "like",
        args: [props.post],
        account: address,
      });
      const txHash = await walletClient.writeContract(request);
      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      // Show success message
      toast({
        title: "Liked 👌",
      });
      refetchLikers();
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      disabled={!isLikersFetched || isFormSubmitting}
      onClick={() => onSubmit()}
    >
      {(!isLikersFetched || isFormSubmitting) && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Like <span className="ml-1 font-extrabold">{likers?.length || ""}</span>
    </Button>
  );
}

function PostComments(props: {}) {
  return <></>;
}

function PostComment(props: {}) {
  return <></>;
}
