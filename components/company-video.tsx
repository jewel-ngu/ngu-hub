"use client";

import { PlayCircle } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

function embedUrl(value: string): string {
  const youtubeWatch = value.match(/[?&]v=([^&]+)/)?.[1];
  const youtubeShort = value.match(/youtu\.be\/([^?]+)/)?.[1];
  const drive = value.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1];
  if (youtubeWatch || youtubeShort) return `https://www.youtube.com/embed/${youtubeWatch ?? youtubeShort}?autoplay=1&mute=1&playsinline=1&rel=0`;
  if (drive) return `https://drive.google.com/file/d/${drive}/preview`;
  return value;
}

export function CompanyVideo({ url }: { readonly url: string }): ReactNode {
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
      {playing && /\.(mp4|webm|mov)(\?|$)/i.test(url) ? (
        <video src={url} autoPlay muted playsInline controls />
      ) : playing ? (
        <iframe
          src={embedUrl(url)}
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
