import type { ComponentProps } from "react";

// Render the real asset without Next's server-only image configuration.
export default function GoogleImage({ src, alt, width, height, className, loading, "aria-hidden": ariaHidden }: ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={width} height={height} className={className} loading={loading} aria-hidden={ariaHidden} />;
}
