"use client";

import { useEffect } from "react";

/** Active les animations d'apparition au scroll de la homepage (progressive enhancement). */
export function RevealInit() {
  useEffect(() => {
    const root = document.querySelector(".nb-home");
    if (!root) return;
    root.classList.add("js");
    const els = root.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add("in");
            io.unobserve(x.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}
