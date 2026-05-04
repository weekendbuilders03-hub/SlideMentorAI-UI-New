import { useEffect, useRef, useState } from "react";
import "./Hero.scss";

const stats = [
  { num: "7", label: "Screens covered" },
  { num: "$19", label: "Pro plan / month" },
  { num: "99+", label: "Languages supported" },
  { num: "Azure", label: "Powered by" },
];

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pp-hero" ref={heroRef} aria-label="Hero">
      {/* Decorative blobs */}
      <div className="pp-hero__blob-top" aria-hidden="true" />
      <div className="pp-hero__blob-bottom" aria-hidden="true" />

      {/* Main content */}
      <div className={`pp-hero__inner${visible ? " visible" : ""}`}>
        {/* Badge */}
        <div className="pp-hero__badge">
          <div className="pp-hero__dot" aria-hidden="true" />
          Beta Review Document · April 2025
        </div>

        {/* Heading */}
        <h1 className="pp-hero__h1">
          PitchPerfect
          <br />
          <em>The AI Presentation Coach</em>
        </h1>

        {/* Sub-copy */}
        <p className="pp-hero__sub">
          A complete walkthrough of every screen — built for US professionals
          who want to stop winging presentations and start winning rooms.
        </p>

        {/* Stats row */}
        <div className="pp-hero__meta" role="list">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`pp-hero__meta-item${visible ? " visible" : ""}`}
              style={{ transitionDelay: `${0.25 + i * 0.1}s` }}
              role="listitem"
            >
              <div className="pp-hero__meta-num">{s.num}</div>
              <div className="pp-hero__meta-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="pp-hero__scroll" aria-hidden="true">
        SCROLL
        <div className="pp-hero__scroll-arrow" />
      </div>
    </section>
  );
}