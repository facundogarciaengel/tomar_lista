'use client';

import clsx from "classnames";

type UiCardProps = {
  title: string;
  description?: string;
  accent?: string;
  children?: React.ReactNode;
};

// ReactBits: Fluid Glass Cards
// props clave: title, accent
// Doc: https://reactbits.dev/cards/fluid-glass
export function UiCard({ title, description, accent = "#22d3ee", children }: UiCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
      style={{ boxShadow: `0 20px 45px -20px ${accent}80` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" aria-hidden />
      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-8 rounded-full" style={{ backgroundColor: accent }} />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {description ? <p className="text-sm text-slate-100/80">{description}</p> : null}
        {children}
      </div>
    </div>
  );
}

type UiCardGridProps = {
  items: UiCardProps[];
  columns?: number;
};

export function UiCardGrid({ items, columns = 3 }: UiCardGridProps) {
  return (
    <div
      className={clsx("grid gap-6", {
        "md:grid-cols-2 xl:grid-cols-3": columns === 3,
        "md:grid-cols-2": columns === 2,
        "md:grid-cols-3": columns === 4
      })}
    >
      {items.map((item) => (
        <UiCard key={item.title} {...item} />
      ))}
    </div>
  );
}
