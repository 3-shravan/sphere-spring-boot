import Lenis from "lenis";
import { useEffect, useRef } from "react";

export function useSmoothScrollRef(containerRef, options = {}) {
  const { enabled = true } = options;

  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (!containerRef?.current) return;
    if (typeof window === "undefined") return;

    const el = containerRef.current;

    const lenis = new Lenis({
      wrapper: el,
      content: el.firstElementChild || el,
      duration: 1.2,
      smooth: true,
      gestureOrientation: "vertical",
    });

    const raf = (time) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
    };
  }, [enabled, containerRef]);

  return lenisRef;
}
