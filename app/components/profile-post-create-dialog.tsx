"use client";

import { siteConfig } from "@/config/site";
import { postAbi } from "@/contracts/abi/post";
import useError from "@/hooks/useError";
import { uploadJsonToIpfs } from "@/lib/ipfs";
import { PostMetadata } from "@/types/post-metadata";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePublicClient, useWalletClient } from "wagmi";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

export function ProfilePostCreateDialog(props: { onCreate: () => {} }) {
  const { handleError } = useError();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const formSchema = z.object({
    text: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
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
      const matadata: PostMetadata = {
        text: values.text,
      };
      const metadataUri = await uploadJsonToIpfs(matadata);
      // Send request
      const txHash = await walletClient.writeContract({
        address: siteConfig.contracts.post,
        abi: postAbi,
        functionName: "create",
        args: [metadataUri],
      });
      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      // Show success message
      toast({
        title: "Post created 👌",
      });
      props.onCreate();
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      handleError(error, true);
    } finally {
      setIsFormSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button>Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="What is happening?!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isFormSubmitting}>
                {isFormSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
