export function ProfilePost(props: { address: `0x${string}`; post: bigint }) {
  return (
    <div className="w-full flex flex-col items-center border rounded px-4 py-4">
      <p className="text-sm text-muted-foreground">{props.post.toString()}</p>
    </div>
  );
}
