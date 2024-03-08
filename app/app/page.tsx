import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-6 pb-8 pt-6 lg:h-[calc(100vh-4rem)]">
      {/* Text with button */}
      <section className="flex flex-col items-center py-8">
        <h1 className="text-4xl font-extrabold tracking-tighter text-center md:text-5xl">
          Social network in the U2U ecosystem
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight text-center text-muted-foreground mt-2">
          A place for your profiles, posts, likes and comments
        </h2>
        <Link href="/profiles">
          <Button className="mt-4" size="lg">
            Explore
          </Button>
        </Link>
      </section>
      {/* Image */}
      <section className="flex flex-col items-center max-w-[700px]">
        <Image
          src="/images/profiles.png"
          alt="Profiles"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full"
        />
      </section>
    </div>
  );
}
