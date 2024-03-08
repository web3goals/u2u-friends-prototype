"use client";

import { siteConfig } from "@/config/site";
import { Github } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block text-primary font-bold">
              {siteConfig.emoji}{" "}
              <span className="hidden md:inline-block">{siteConfig.name}</span>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-6">
          <Link
            href="/profiles"
            className="flex text-sm font-medium text-muted-foreground"
          >
            Explore
          </Link>
          <Link
            href="/profiles"
            className="flex text-sm font-medium text-muted-foreground"
          >
            Profile
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex text-sm font-medium text-muted-foreground"
          >
            GitHub
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
