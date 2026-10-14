import type { CSSProperties, MouseEventHandler, PointerEventHandler, ReactNode, Ref } from "react";
import type { CmsContent } from "@/lib/cms-types";

type AwardDisplayProps = {
  readonly award: CmsContent["award"];
  readonly interactive?: boolean;
  readonly showImageFrame?: boolean;
  readonly personRef?: Ref<HTMLDivElement>;
  readonly onImageDoubleClick?: MouseEventHandler<HTMLImageElement>;
  readonly onMoveStart?: PointerEventHandler<HTMLImageElement>;
  readonly onMove?: PointerEventHandler<HTMLImageElement>;
  readonly onMoveEnd?: PointerEventHandler<HTMLImageElement>;
};

type AwardPersonStyle = CSSProperties & {
  readonly "--award-image-x": string;
  readonly "--award-image-y": string;
  readonly "--award-image-scale": number;
};

export function AwardDisplay({ award, interactive = false, showImageFrame = false, personRef, onImageDoubleClick, onMoveStart, onMove, onMoveEnd }: AwardDisplayProps): ReactNode {
  const personStyle: AwardPersonStyle = {
    "--award-image-x": `${award.imageOffsetX ?? 0}%`,
    "--award-image-y": `${award.imageOffsetY ?? 0}%`,
    "--award-image-scale": (award.imageScale ?? 100) / 100,
  };

  return (
    <section className={`winner award-display${interactive ? " award-display-interactive" : ""}`}>
      <div ref={personRef} className={`award-person${showImageFrame ? " award-person-framed" : ""}${interactive ? " award-person-editable" : ""}`} style={personStyle}>
        <img
          src={award.imageUrl}
          alt={award.name}
          draggable={false}
          style={{ objectPosition: award.imagePosition }}
          onDoubleClick={onImageDoubleClick}
          onPointerDown={onMoveStart}
          onPointerMove={onMove}
          onPointerUp={onMoveEnd}
          onPointerCancel={onMoveEnd}
        />
        {showImageFrame && <span className="award-frame-label">{interactive ? "Drag image inside frame" : "Double-click image to adjust"}</span>}
      </div>
      <div className="award-copy">
        <div className="award-stars" aria-hidden="true">★ <span>★</span> ★</div>
        <h1>AGENT OF<br />THE MONTH</h1>
        <p className="award-month">{award.month}</p>
        <div className="award-rule" />
        <h2>{award.heading}</h2>
        <p className="award-category">{award.category}</p>
        <strong className="award-name">{award.name}</strong>
      </div>
    </section>
  );
}
