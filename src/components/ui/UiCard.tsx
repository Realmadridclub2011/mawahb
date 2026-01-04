// src/components/ui/UiCard.tsx
import React from "react";

/** className join helper */
function cn(...xs: Array<string | undefined | null | false>) {
  return xs.filter(Boolean).join(" ");
}

type AsTag = keyof JSX.IntrinsicElements;

type UiCardProps = React.HTMLAttributes<HTMLElement> & {
  as?: AsTag;
  /** نفس فكرة shadcn: لو عايز تمرر class للمكوّن ابن بدل ما يعمل wrapper */
  asChild?: boolean;

  /** شكل الكارد */
  variant?: "base" | "teal" | "blue" | "purple" | "amber" | "rose" | "cyan" | "glass";

  /** خط accent أعلى الكارد */
  accent?: boolean;

  /** padding جاهز */
  padding?: "none" | "sm" | "md" | "lg";
};

export function UiCard({
  as: Tag = "div",
  asChild = false,
  className = "",
  variant = "base",
  accent = false,
  padding = "md",
  ...props
}: UiCardProps) {
  const paddingClass =
    padding === "none"
      ? ""
      : padding === "sm"
      ? "p-3"
      : padding === "lg"
      ? "p-6"
      : "p-4";

  const variantClass =
    variant === "teal"
      ? "ui-card-teal"
      : variant === "blue"
      ? "ui-card-blue"
      : variant === "purple"
      ? "ui-card-purple"
      : variant === "amber"
      ? "ui-card-amber"
      : variant === "rose"
      ? "ui-card-rose"
      : variant === "cyan"
      ? "ui-card-cyan"
      : variant === "glass"
      ? "ui-glass"
      : ""; // base = ui-card

  // لو asChild = true هنرجّع Fragment؟ لا، الأفضل نخليها بسيطة: asChild يعني أنت بتمرر Tag بنفسك
  // فخلّيه نفس behavior: Tag بيتغير بالـ as prop.
  return React.createElement(Tag, {
    ...props,
    className: cn(
      // base style
      variant === "glass" ? "ui-glass ui-card-hover" : "ui-card ui-card-hover",
      // variant gradient
      variantClass,
      // accent top line
      accent && "ui-accent",
      // spacing
      paddingClass,
      className
    ),
  });
}

type UiIconCircleProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
};

export function UiIconCircle({
  className = "",
  size = "md",
  ...props
}: UiIconCircleProps) {
  const sizeClass =
    size === "sm"
      ? "w-10 h-10"
      : size === "lg"
      ? "w-14 h-14"
      : "w-[46px] h-[46px]";

  return (
    <div className={cn("ui-icon-circle", sizeClass, className)} {...props} />
  );
}

/** مربع أكبر للرسومات/Illustration بدل الأيقونات الصغيرة */
export function UiIllus({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-illus", className)} {...props} />;
}

type UiPillProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "teal" | "blue" | "rose" | "amber" | "purple" | "cyan";
};

export function UiPill({
  className = "",
  tone = "default",
  ...props
}: UiPillProps) {
  const toneClass =
    tone === "teal"
      ? "border-[rgba(20,184,166,.22)] bg-[rgba(20,184,166,.10)]"
      : tone === "blue"
      ? "border-[rgba(59,130,246,.22)] bg-[rgba(59,130,246,.10)]"
      : tone === "rose"
      ? "border-[rgba(244,63,94,.22)] bg-[rgba(244,63,94,.10)]"
      : tone === "amber"
      ? "border-[rgba(251,191,36,.25)] bg-[rgba(251,191,36,.12)]"
      : tone === "purple"
      ? "border-[rgba(168,85,247,.22)] bg-[rgba(168,85,247,.10)]"
      : tone === "cyan"
      ? "border-[rgba(6,182,212,.22)] bg-[rgba(6,182,212,.10)]"
      : "";

  return <div className={cn("ui-pill px-3 py-1", toneClass, className)} {...props} />;
}
