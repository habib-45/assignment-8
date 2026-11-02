"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HeartIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { cn } from "cn";

interface WishlistButtonProps {
  studioId: string;
  title: string;
  className?: string;
}

/**
 * Heart toggle used on studio cards and the detail gallery. Anonymous
 * visitors are sent to /login with a redirect instead of silently failing;
 * signed-in users get an optimistic save/remove plus a toast.
 */
export function WishlistButton({ studioId, title, className }: WishlistButtonProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isSaved, toggle, busyId } = useWishlist();
  const saved = isSaved(studioId);
  const busy = busyId === studioId;

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (loading) return;
    if (!user) {
      toast.info("Sign in to save studios", {
        description: "Your wishlist follows your account across devices.",
      });
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${studioId}`)}`);
      return;
    }
    await toggle(studioId, title);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      className={cn(
        "z-10 flex size-9 items-center justify-center rounded-full bg-black/55 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-black/75 focus-visible:ring-3 focus-visible:ring-ring/60 outline-none",
        saved && "bg-rose-500/95 hover:bg-rose-500",
        className
      )}
    >
      {busy ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : (
        <HeartIcon
          className={cn("size-4 transition-transform", saved && "fill-current scale-110")}
        />
      )}
    </button>
  );
}
