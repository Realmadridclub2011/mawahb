import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof JSX.IntrinsicElements;
};

export function UiCard({ as: Tag = "div", className = "", ...props }: Props) {
  return (
    <Tag className={["ui-card ui-card-hover", className].join(" ")} {...props} />
  );
}

export function UiIconCircle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ui-icon-circle", className].join(" ")} {...props} />;
}

/** ✅ الجديد: بطاقة “Tile” بنفس شكل الصورة */
type UiTileProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "maroon" | "teal" | "cyan" | "emerald" | "amber";
};

export function UiTile({
  className = "",
  variant = "teal",
  children,
  ...props
}: UiTileProps) {
  const variantClass =
    variant === "maroon"
      ? "ui-tile-maroon"
      : variant === "cyan"
      ? "ui-tile-cyan"
      : variant === "emerald"
      ? "ui-tile-emerald"
      : variant === "amber"
      ? "ui-tile-amber"
      : "ui-tile-teal";

  return (
    <button
      className={[
        "ui-tile ui-tile-hover",
        variantClass,
        "text-right w-full",
        className,
      ].join(" ")}
      {...props}
    >
      <div className="ui-tile-glow" />
      <div className="ui-tile-inner">{children}</div>
    </button>
  );
}
