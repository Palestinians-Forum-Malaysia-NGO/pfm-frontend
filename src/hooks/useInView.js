import { useState, useEffect, useRef } from "react";

/**
 * Returns [ref, inView] — inView becomes true once the element
 * enters the viewport. Triggers only once (observer disconnects after).
 *
 * Usage:
 *   const [ref, inView] = useInView();
 *   <div ref={ref} className={inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} />
 */
const useInView = (threshold = 0.15) => {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

export default useInView;
