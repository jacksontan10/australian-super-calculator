import { useId, type ReactNode } from "react";

export type InfoTooltipAlign = "center" | "start";

export interface InfoTooltipProps {
  /** Shown in aria-label for the info button */
  label: string;
  children: ReactNode;
  /**
   * "start" lines the panel up with the left edge of the trigger (helps when the trigger sits
   * near the left side of the screen so the panel stays on-screen).
   */
  align?: InfoTooltipAlign;
}

export const InfoTooltip = ({ label, children, align = "center" }: InfoTooltipProps) => {
  const rawId = useId();
  const panelId = `tooltip-${rawId.replace(/:/g, "")}`;

  return (
    <span
      className={
        align === "start"
          ? "info-tooltip info-tooltip--align-start"
          : "info-tooltip"
      }
    >
      <button
        type="button"
        className="info-tooltip__trigger"
        aria-label={`More information: ${label}`}
        aria-describedby={panelId}
      >
        <span className="info-tooltip__icon" aria-hidden>
          i
        </span>
      </button>
      <span id={panelId} role="tooltip" className="info-tooltip__panel">
        <span className="info-tooltip__panel-inner">{children}</span>
      </span>
    </span>
  );
};
