import React from "react";
import type { ComponentProps } from "react";
export default function Link({ prefetch, ...props }: ComponentProps<"a"> & { prefetch?: boolean | null }) {
  return <a {...props} data-prefetch={prefetch === false ? "off" : "on"} />;
}
