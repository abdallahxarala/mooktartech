"use client";

import Image from "next/image";
import { useContextualAsset } from "@/lib/hooks/use-contextual-asset";
import type { AssetContext } from "@/lib/config/assets";

interface ContextualImageProps {
  category: string;
  context?: Partial<AssetContext>;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ContextualImage({
  category,
  context,
  className,
  fill,
  sizes,
  priority,
}: ContextualImageProps) {
  const asset = useContextualAsset({ category, context });

  if (!asset) return null;

  return (
    <div className={className}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
