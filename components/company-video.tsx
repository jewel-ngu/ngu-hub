"use client";

import { PlayCircle } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const VIDEO_ID = "mOGl90k7F1M";
const VIDEO_URL = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&playsinline=1&rel=0`;

export function CompanyVideo(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry?.isIntersecting === true),
      { threshold: 0.45 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="video-panel" ref={sectionRef} aria-label="Introducing NGU Real Estate video">
      {playing ? (
        <iframe
          src={VIDEO_URL}
          title="Introducing NGU Real Estate"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="video-placeholder">
          <PlayCircle size={76} />
          <h2>Introducing NGU Real Estate</h2>
          <p>The video begins automatically when it enters view.</p>
        </div>
      )}
    </section>
  );
}
