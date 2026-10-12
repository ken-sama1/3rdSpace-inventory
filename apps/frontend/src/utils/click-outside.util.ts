import type { RefObject } from "react";

export const clickOutside = (
  refs: RefObject<HTMLElement | null>[],
  callback: () => void
) => {
  return (e: PointerEvent) => {
    const clicked = refs.some((ref) => {
      return ref.current?.contains(e.target as Node);
    });

    if (!clicked) callback();
  };
};
