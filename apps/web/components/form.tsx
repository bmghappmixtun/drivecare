import type { ReactNode } from "react";

export function FieldLabel({ children, required = false }: { children: ReactNode; required?: boolean }) {
  return (
    <label>
      {children}
      {required ? (
        <span className="required-mark" aria-label="obligatoire">
          *
        </span>
      ) : null}
    </label>
  );
}

export function FormAlert({
  children,
  tone = "success"
}: {
  children: ReactNode;
  tone?: "success" | "error" | "info";
}) {
  return (
    <div className={`form-alert ${tone}`} role={tone === "error" ? "alert" : "status"} aria-live="polite">
      {children}
    </div>
  );
}
