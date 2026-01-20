"use client";

import { ReactNode, useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import { Tab } from "@/app/page";

const order: Tab[] = ["home", "search", "notify", "profile"];

type Props = {
  active: Tab;
  setActive: (t: Tab) => void;
  children: ReactNode;
};

export default function SwipeWrapper({ active, setActive, children }: Props) {
  const index = order.indexOf(active);

  const handlers = useSwipeable(
    useMemo(
      () => ({
        onSwipedLeft: () =>
          index < order.length - 1 && setActive(order[index + 1]),
        onSwipedRight: () => index > 0 && setActive(order[index - 1]),
        preventScrollOnSwipe: true,
        trackMouse: false,
        trackTouch: true,
      }),
      [index, setActive],
    ),
  );

  return <div {...handlers}>{children}</div>;
}
