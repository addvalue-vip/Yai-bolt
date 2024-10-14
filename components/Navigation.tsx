"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              YT Transcript AI
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium",
                pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Home
            </Link>
            <Link
              href="/transcribe"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium",
                pathname === "/transcribe" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              Transcribe
            </Link>
            <Link
              href="/about"
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium",
                pathname === "/about" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;