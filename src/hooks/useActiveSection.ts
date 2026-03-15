"use client";

import { useEffect, useState } from "react";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-80px 0px 0px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

export default useActiveSection;
