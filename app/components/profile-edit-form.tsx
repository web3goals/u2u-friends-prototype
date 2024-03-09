"use client";

import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { profileAbi } from "@/contracts/abi/profile";
import useError from "@/hooks/useError";
import useMetadataLoader from "@/hooks/useMetadataLoader";
import { uploadJsonToIpfs } from "@/lib/ipfs";
import { ProfileMetadata } from "@/types/profile-metadata";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zeroAddress } from "viem";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";

export function ProfileEditForm() {
  const { address } = useAccount();

  /**
   * Define profile metadata
   */
  const { data: metadataUri, isFetched: isMetadataUriFetched } =
    useReadContract({
      address: siteConfig.contracts.profile,
      abi: profileAbi,
      functionName: "getURI",
      args: [address || zeroAddress],
    });
  const { data: metadata } = useMetadataLoader<ProfileMetadata>(metadataUri);

  /**
   * Display a form depending on metadata
   */
  if (isMetadataUriFetched && metadataUri != "" && metadata !== undefined) {
    return <EditForm metadata={metadata} />;
  }
  if (isMetadataUriFetched && metadataUri == "") {
    return <EditForm />;
  }
  return <Skeleton className="h-4" />;
}

function EditForm(props: { metadata?: ProfileMetadata }) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.metadata?.name || "",
      bio: props.metadata?.bio || "",
      website: props.metadata?.website || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsFormSubmitting(true);
      // Check clients
      if (!publicClient) {
        throw new Error("Public client is not ready");
      }
      if (!walletClient) {
        throw new Error("Wallet is not connected");
      }
      // Upload data to IPFS
      const matadata: ProfileMetadata = {
        name: values.name,
        bio: values.bio,
        website: values.website,
      };
      const metadataUri = await uploadJsonToIpfs(matadata);
      // Send request
      const txHash = await walletClient.writeContract({
        address: siteConfig.contracts.profile,
        abi: profileAbi,
        functionName: "setURI",
        args: [metadataUri],
      });
      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      // Show success message
      toast({
        title: "Profile data saved 👌",
      });
      setIsFormSubmitting(false);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Alice" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="I’m..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://alice.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isFormSubmitting}>
          {isFormSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
}
