const stages = [
  { label: "Upload", threshold: 25 },
  { label: "Match", threshold: 50 },
  { label: "Load", threshold: 75 },
  { label: "Ready", threshold: 100 },
];

export default function ProcessingProgress({ progress }: { progress: number }) {
  return (
    <section className="processing-section" aria-labelledby="processing-title">
      <div className="section-heading">
        <h2 id="processing-title">Processing</h2>
        <strong>{progress}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="stage-row">
        {stages.map((stage) => {
          const complete = progress >= stage.threshold;
          return (
            <div className="stage" key={stage.label}>
              <span className={complete ? "stage-dot stage-dot--done" : "stage-dot"}>
                {complete ? "✓" : ""}
              </span>
              {stage.label}
            </div>
          );
        })}
      </div>
    </section>
  );
}
