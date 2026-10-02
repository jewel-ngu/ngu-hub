"use client";

import { ExternalLink, Play } from "lucide-react";
import { useState, type ReactNode } from "react";
import { getTrainingEmbedUrl, type TrainingVideo } from "@/lib/training-data";

export function TrainingPlaylist({ videos, label }: { readonly videos: readonly TrainingVideo[]; readonly label: string }): ReactNode {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = videos[selectedIndex];
  if (!selected) return null;

  return (
    <section className="training-playlist">
      <div className="playlist-player">
        <div className="playlist-frame">
          <iframe src={getTrainingEmbedUrl(selected.href)} title={selected.title} allow="autoplay; fullscreen" allowFullScreen />
        </div>
        <div className="playlist-now-playing">
          <p className="eyebrow">NOW PLAYING · {label}</p>
          <h2>{selected.title}</h2>
          <div><span>{selected.date}</span><a href={selected.href} target="_blank" rel="noreferrer">Open video <ExternalLink size={15} /></a></div>
        </div>
      </div>
      <div className="playlist-list" aria-label={`${label} playlist`}>
        <div className="playlist-list-heading"><p className="eyebrow">VIDEO LIBRARY</p><strong>{videos.length} sessions</strong></div>
        {videos.map((video, index) => (
          <button className={index === selectedIndex ? "active" : ""} onClick={() => setSelectedIndex(index)} type="button" key={`${video.title}-${video.date}`}>
            <span><Play size={15} fill="currentColor" /></span>
            <span><strong>{video.title}</strong><small>{video.date}</small></span>
          </button>
        ))}
      </div>
    </section>
  );
}
