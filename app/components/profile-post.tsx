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
import { ProfilePostCommentDialog } from "./profile-post-comment-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/use-toast";
import { ipfsUriToHttpUri } from "@/lib/ipfs";

export function ProfilePost(props: { address: `0x${string}`; post: bigint }) {
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

  /**
   * Define post comments
   */
  const {
    data: postComments,
    isFetched: isPostCommentsFetched,
    refetch: refetchPostComments,
  } = useReadContract({
    address: siteConfig.contracts.post,
    abi: postAbi,
    functionName: "getComments",
    args: [props.post],
  });

  const emojiAvatar = emojiAvatarForAddress(props.address);

  if (
    !isProfileMetadataUriFetched ||
    !isProfileMetadataLoaded ||
    !isPostMetadataUriFetched ||
    !isPostMetadataLoaded ||
    !isPostCommentsFetched
  ) {
    return <Skeleton className="w-full h-4" />;
  }

  return (
    <div className="w-full flex flex-col items-center border rounded px-4 py-4">
      {/* Header */}
      <div className="w-full flex flex-row gap-2">
        {/* Left part */}
        <div>
          {/* Avatar */}
          <Avatar className="size-12">
            <AvatarImage
              src={
                profileMetadata?.avatar
                  ? ipfsUriToHttpUri(profileMetadata.avatar)
                  : undefined
              }
              alt="Avatar"
            />
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
            <PostLikeButton post={props.post} />
            <ProfilePostCommentDialog
              post={props.post}
              onComment={() => refetchPostComments()}
            />
          </div>
        </div>
      </div>
      {/* Comments */}
      <PostComments comments={postComments?.toReversed()} />
    </div>
  );
}

function PostLikeButton(props: { post: bigint }) {
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

function PostComments(props: { comments: bigint[] | undefined }) {
  if (props.comments === undefined || props.comments.length === 0) {
    return <></>;
  }

  return (
    <>
      <Separator className="my-4" />
      <div className="w-full flex flex-col gap-4">
        {props.comments.map((comment, index) => (
          <PostComment key={index} comment={comment} />
        ))}
      </div>
    </>
  );
}

function PostComment(props: { comment: bigint }) {
  /**
   * Define comment metadata
   */
  const { data: commentMetadataUri, isFetched: isCommentMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.post,
      abi: postAbi,
      functionName: "tokenURI",
      args: [props.comment],
    });
  const { data: commentMetadata, isLoaded: isCommentMetadataLoaded } =
    useMetadataLoader<PostMetadata>(commentMetadataUri);

  /**
   * Define comment author metadata
   */
  const { data: author, isFetched: isAuthorFetched } = useReadContract({
    address: siteConfig.contracts.post,
    abi: postAbi,
    functionName: "ownerOf",
    args: [props.comment],
  });
  const {
    data: authorProfileMetadataUri,
    isFetched: isAuthorProfileMetadataUriFetched,
  } = useReadContract({
    address: siteConfig.contracts.profile,
    abi: profileAbi,
    functionName: "getURI",
    args: [author || zeroAddress],
  });
  const {
    data: authorProfileMetadata,
    isLoaded: isAuthorProfileMetadataLoaded,
  } = useMetadataLoader<ProfileMetadata>(authorProfileMetadataUri);

  const emojiAvatar = emojiAvatarForAddress(author || zeroAddress);

  if (
    !isCommentMetadataUriFetched ||
    !isCommentMetadataLoaded ||
    !isAuthorFetched ||
    !isAuthorProfileMetadataUriFetched ||
    !isAuthorProfileMetadataLoaded
  ) {
    return <Skeleton className="w-full h-4" />;
  }

  return (
    <div className="w-full flex flex-row gap-2">
      <div>
        {/* Avatar */}
        <Avatar className="size-8">
          <AvatarImage
            src={
              authorProfileMetadata?.avatar
                ? ipfsUriToHttpUri(authorProfileMetadata.avatar)
                : undefined
            }
            alt="Avatar"
          />
          <AvatarFallback
            style={{ background: emojiAvatar.color }}
            className="text-xs"
          >
            {emojiAvatar.emoji}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <p className="text-sm font-bold">{authorProfileMetadata?.name}</p>
        <p className="text-xs text-muted-foreground">
          {addressToShortAddress(author || zeroAddress)}
          {" · "}
          {new Date(commentMetadata?.createdDate || 0).toLocaleTimeString()}
        </p>
        <p className="text-sm mt-2">{commentMetadata?.text}</p>
      </div>
    </div>
  );
}
