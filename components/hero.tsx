import type { CSSProperties, ReactNode } from "react";

type HeroProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly home?: boolean;
  readonly image?: string;
};

const homeImage = "/images/home-city-v2.png";
const homeVideo = "https://ngu-real-estate-design.s3.ap-southeast-2.amazonaws.com/ngurealestate/images/Intranet/NGU+HUB+Updated+Video_V2.mov";

export function Hero({ title, subtitle, home = false, image }: HeroProps): ReactNode {
  const background = image ?? (home ? homeImage : "/images/work-apps-hero.png");
  const style = { "--hero-image": `url('${background}')` } as CSSProperties;

  return (
    <section className={`page-hero ${home ? "home-hero" : ""}`} style={style}>
      {home && (
        <video
          autoPlay
          className="hero-video"
          loop
          muted
          playsInline
          poster={homeImage}
          src={homeVideo}
        />
      )}
      <div className="hero-overlay" />
      <div className="hero-copy">
        <span className="hero-kicker">{home ? "CONNECTED BY AMBITION." : "NGU REAL ESTATE · THE HUB"}</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
