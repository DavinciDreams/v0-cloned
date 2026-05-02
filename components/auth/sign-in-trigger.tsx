"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useCallback } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface SignInTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> {
  children: ReactNode;
  fallbackHref?: string;
}

export function SignInTrigger({
  children,
  fallbackHref = "/canvas",
  disabled,
  ...props
}: SignInTriggerProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();
  const router = useRouter();

  const handleClick = useCallback(async () => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.push(fallbackHref);
      return;
    }

    try {
      await clerk.openSignIn();
    } catch (error) {
      const clerkError =
        typeof error === "object" && error !== null
          ? (error as { errors?: Array<{ code?: string }> })
          : null;
      const code = clerkError?.errors?.[0]?.code;

      if (code === "cannot_render_single_session_enabled") {
        router.push(fallbackHref);
        return;
      }

      console.error("Failed to open Clerk sign-in modal:", error);
    }
  }, [clerk, fallbackHref, isLoaded, isSignedIn, router]);

  return (
    <button
      type="button"
      disabled={disabled || !isLoaded}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
