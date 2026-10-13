import type { CSSProperties, PointerEventHandler, ReactNode, Ref } from "react";
import type { CmsContent } from "@/lib/cms-types";

type AwardDisplayProps = {
  readonly award: CmsContent["award"];
  readonly interactive?: boolean;
  readonly showMobileGuide?: boolean;
  readonly personRef?: Ref<HTMLDivElement>;
  readonly onMoveStart?: PointerEventHandler<HTMLImageElement>;
  readonly onMove?: PointerEventHandler<HTMLImageElement>;
  readonly onMoveEnd?: PointerEventHandler<HTMLImageElement>;
  readonly onResizeStart?: PointerEventHandler<HTMLButtonElement>;
  readonly onResize?: PointerEventHandler<HTMLButtonElement>;
  readonly onResizeEnd?: PointerEventHandler<HTMLButtonElement>;
};

type AwardPersonStyle = CSSProperties & {
  readonly "--award-image-x": string;
  readonly "--award-image-y": string;
  readonly "--award-image-scale": number;
};

export function AwardDisplay({ award, interactive = false, showMobileGuide = false, personRef, onMoveStart, onMove, onMoveEnd, onResizeStart, onResize, onResizeEnd }: AwardDisplayProps): ReactNode {
  const personStyle: AwardPersonStyle = {
    "--award-image-x": `${award.imageOffsetX ?? 0}%`,
    "--award-image-y": `${award.imageOffsetY ?? 0}%`,
    "--award-image-scale": (award.imageScale ?? 100) / 100,
  };

  return (
    <section className={`winner award-display${interactive ? " award-display-interactive" : ""}`}>
      <div ref={personRef} className={`award-person${interactive ? " award-person-editable" : ""}`} style={personStyle}>
        <img
          src={award.imageUrl}
          alt={award.name}
          draggable={false}
          style={{ objectPosition: award.imagePosition }}
          onPointerDown={onMoveStart}
          onPointerMove={onMove}
          onPointerUp={onMoveEnd}
          onPointerCancel={onMoveEnd}
        />
        {interactive && (
          <button
            className="award-resize-handle"
            type="button"
            aria-label="Resize the agent image"
            title="Drag to resize"
            onPointerDown={onResizeStart}
            onPointerMove={onResize}
            onPointerUp={onResizeEnd}
            onPointerCancel={onResizeEnd}
          >↘</button>
        )}
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
      {showMobileGuide && <div className="award-mobile-safe-guide" aria-hidden="true"><span>Mobile image safe area</span></div>}
    </section>
  );
}
