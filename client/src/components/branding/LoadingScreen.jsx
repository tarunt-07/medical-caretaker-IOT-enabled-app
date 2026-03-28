import { useEffect, useMemo, useState } from "react";
import BrandLogo from "./BrandLogo";

const LOADER_DURATION = 8000;
const FACT_ROTATION_MS = 2000;

const FACTS = [
  "Medication reminders improve adherence and reduce missed doses.",
  "Hydration can support recovery and help the body process medication safely.",
  "Keeping a daily symptom log helps doctors adjust treatment faster.",
  "Consistent medicine timing can improve treatment effectiveness for many conditions.",
];

function LoadingScreen({ visible }) {
  const [progress, setProgress] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  const factSteps = useMemo(
    () => FACTS.map((fact, index) => ({ id: index, fact })),
    []
  );

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const startedAt = Date.now();

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min((elapsed / LOADER_DURATION) * 100, 100);
      setProgress(nextProgress);
    }, 100);

    const factTimer = window.setInterval(() => {
      setFactIndex((current) => (current + 1) % FACTS.length);
    }, FACT_ROTATION_MS);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(factTimer);
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="loader-screen" role="status" aria-live="polite">
      <div className="loader-glow loader-glow-left" />
      <div className="loader-glow loader-glow-right" />

      <div className="loader-card glass-card">
        <BrandLogo size="xl" subtitle="Preparing your care dashboard" />

        <div className="loader-copy">
          <div className="loader-eyebrow">Launching prantar.io</div>
          <h1 className="loader-title">Setting up your medical workspace</h1>
          <p className="loader-text">
            Syncing care tools, loading records, and getting your health companion ready.
          </p>
        </div>

        <div className="loader-facts">
          {factSteps.map((item, index) => (
            <div
              key={item.id}
              className={`loader-fact ${index === factIndex ? "is-active" : ""}`}
            >
              {item.fact}
            </div>
          ))}
        </div>

        <div className="loader-progress">
          <div className="loader-progress-track">
            <div
              className="loader-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="loader-progress-meta">
            <span>Loading care intelligence</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
