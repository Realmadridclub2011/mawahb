// src/components/ui/UiCard.tsx
import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof JSX.IntrinsicElements;
};

export function UiCard({ as: Tag = "div", className = "", ...props }: Props) {
  return (
    <Tag
      className={[
        "ui-card ui-card-hover",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function UiIconCircle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ui-icon-circle", className].join(" ")} {...props} />;
}

export function UiPill({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ui-pill", className].join(" ")} {...props} />;
}