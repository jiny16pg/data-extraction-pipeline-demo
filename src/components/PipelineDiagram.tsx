import type { PipelineStage } from "../types";

export default function PipelineDiagram({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="pipeline" role="list" aria-label="Processing pipeline">
      {stages.map((stage, index) => (
        <div className="pipeline__step" key={stage.label} role="listitem">
          <span className="pipeline__dot">{index + 1}</span>
          <span className="pipeline__label">{stage.label}</span>
          <span className="pipeline__detail">{stage.detail}</span>
          {index < stages.length - 1 && (
            <span className="pipeline__line" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
