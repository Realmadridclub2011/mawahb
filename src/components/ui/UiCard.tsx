// src/components/ui/UiCard.tsx
import React from "react";

type CardVariant = "teal" | "cyan" | "blue" | "amber" | "rose" | "purple" | "slate" | "white";
type CardPadding = "none" | "sm" | "md" | "lg";

type Props<T extends keyof JSX.IntrinsicElements = "div"> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    variant?: CardVariant; // ui-card-teal ... etc
    hover?: boolean;       // ui-card-hover
    accent?: boolean;      // ui-card-accent (اختياري لو عامل له CSS)
    padding?: CardPadding; // ui-pad-*
  };

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const variantClass: Record<CardVariant, string> = {
  teal: "ui-card-teal",
  cyan: "ui-card-cyan",
  blue: "ui-card-blue",
  amber: "ui-card-amber",
  rose: "ui-card-rose",
  purple: "ui-card-purple",
  slate: "ui-card-slate",
  white: "ui-card-white",
};

const padClass: Record<CardPadding, string> = {
  none: "ui-pad-none",
  sm: "ui-pad-sm",
  md: "ui-pad-md",
  lg: "ui-pad-lg",
};

export function UiCard<T extends keyof JSX.IntrinsicElements = "div">({
  as,
  className,
  variant = "white",
  hover = true,
  accent = false,
  padding = "none",
  ...props
}: Props<T>) {
  const Tag = (as ?? "div") as any;

  return (
    <Tag
      className={cx(
        "ui-card",
        hover && "ui-card-hover",
        accent && "ui-card-accent",
        variantClass[variant],
        padClass[padding],
        className
      )}
      {...props}
    />
  );
}

export function UiIconCircle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ui-icon-circle", className)} {...props} />;
}

export function UiPill({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ui-pill", className)} {...props} />;
}

/** اختياري: دائرة/بلور للأيقونات الكبيرة (لو حابب تستخدمها) */
export function UiIllus({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ui-illus", className)} {...props} />;
}
