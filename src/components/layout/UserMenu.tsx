"use client";
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session } = useSession();
  if (session?.user) {
    return (
      <>
        <span className="px-4 py-2 text-charcoal font-medium">{session.user.name || session.user.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 text-charcoal hover:text-primary transition-colors duration-200 font-medium"
        >
          Sign Out
        </button>
      </>
    );
  }
  return (
    <>
      <Link href="/login" className="px-4 py-2 text-charcoal hover:text-primary transition-colors duration-200 font-medium">Sign In</Link>
      <Link href="/register" className="px-4 py-2 bg-primary text-pure-white rounded-lg hover:bg-deep-forest transition-colors duration-200 font-medium">Sign Up</Link>
    </>
  );
}
