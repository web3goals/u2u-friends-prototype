export default function ProfilePage({
  params,
}: {
  params: { address: string };
}) {
  return <div className="container py-10 lg:px-80">{params.address}</div>;
}
