import type { RefObject } from "react";

export const clickOutside = <T extends RefObject<HTMLElement | null>>(
  refs: T[],
  callback: () => void
) => {
  return (e: PointerEvent) => {
    const clicked = refs.some((ref) => {
      return ref.current?.contains(e.target as Node);
    });

    if (!clicked) callback();
  };
};
