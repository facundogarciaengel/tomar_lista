'use client';

import clsx from "classnames";
import { UiBackground } from "@/components/ui/UiBackground";

type HeroProps = {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
  backgroundVariant?: "hyperspeed" | "aurora";
  className?: string;
};

// ReactBits: Hero con fondo animado
// props clave: title, subtitle, backgroundVariant
// Doc: https://reactbits.dev/sections/hero
export function Hero({ title, subtitle, cta, backgroundVariant = "hyperspeed", className }: HeroProps) {
  return (
    <UiBackground variant={backgroundVariant} className={clsx("p-8 md:p-12", className)} density={0.4} speed={14}>
      <div className="space-y-6 text-slate-50">
        <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl drop-shadow-lg">{title}</h1>
        {subtitle ? <p className="max-w-2xl text-lg text-slate-100/80">{subtitle}</p> : null}
        {cta}
      </div>
    </UiBackground>
  );
}
