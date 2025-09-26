'use client';

import clsx from "classnames";
import { useMemo } from "react";

export type UiBackgroundVariant = "hyperspeed" | "aurora";

type UiBackgroundProps = {
  variant?: UiBackgroundVariant;
  color?: string;
  speed?: number;
  density?: number;
  className?: string;
  children?: React.ReactNode;
};

// ReactBits: Hyperspeed Background
// props clave: color, speed, density
// Doc: https://reactbits.dev/backgrounds/hyperspeed
// ReactBits: Aurora Background
// props clave: color, speed
// Doc: https://reactbits.dev/backgrounds/aurora
export function UiBackground({
  variant = "hyperspeed",
  color = "#22d3ee",
  speed = 12,
  density = 0.35,
  className,
  children
}: UiBackgroundProps) {
  const style = useMemo(() => {
    if (variant === "aurora") {
      return {
        "--aurora-color": color,
        "--aurora-speed": `${speed}s`
      } as React.CSSProperties;
    }

    return {
      "--hyper-color": color,
      "--hyper-speed": `${speed}s`,
      "--hyper-density": density
    } as React.CSSProperties;
  }, [variant, color, speed, density]);

  return (
    <div className={clsx("relative overflow-hidden rounded-3xl", className)} style={style}>
      <div
        className={clsx("absolute inset-0", {
          "rb-hyperspeed": variant === "hyperspeed",
          "rb-aurora": variant === "aurora"
        })}
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

type BackgroundStyle = {
  name: string;
  css: string;
};

const styles: BackgroundStyle[] = [
  {
    name: "rb-hyperspeed",
    css: `
      .rb-hyperspeed {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 20%, var(--hyper-color) 0%, transparent 60%),
          radial-gradient(circle at 80% 0%, rgba(34, 211, 238, 0.35) 0%, transparent 55%),
          radial-gradient(circle at 50% 100%, rgba(30, 64, 175, 0.55) 0%, transparent 65%);
        filter: blur(calc(40px * var(--hyper-density)));
        animation: rb-hyperspeed var(--hyper-speed) linear infinite;
        transform: scale(1.1);
        opacity: 0.85;
      }

      @keyframes rb-hyperspeed {
        0% {
          transform: scale(1.1) translate3d(0, 0, 0);
        }
        50% {
          transform: scale(1.2) translate3d(2%, -2%, 0);
        }
        100% {
          transform: scale(1.1) translate3d(0, 0, 0);
        }
      }
    `
  },
  {
    name: "rb-aurora",
    css: `
      .rb-aurora {
        position: absolute;
        inset: -10%;
        background: conic-gradient(from 45deg, transparent 10%, var(--aurora-color) 40%, rgba(34, 197, 94, 0.4) 70%, transparent 90%);
        filter: blur(120px);
        animation: rb-aurora var(--aurora-speed) ease-in-out infinite alternate;
        opacity: 0.8;
      }

      @keyframes rb-aurora {
        0% {
          transform: translate3d(-5%, -5%, 0) scale(1.1);
        }
        100% {
          transform: translate3d(5%, 5%, 0) scale(1.15);
        }
      }
    `
  }
];

function injectStyles() {
  if (typeof document === "undefined") return;

  const existing = document.getElementById("react-bits-styles");
  if (existing) return;

  const style = document.createElement("style");
  style.id = "react-bits-styles";
  style.innerHTML = styles.map((entry) => entry.css).join("\n");
  document.head.appendChild(style);
}

if (typeof window !== "undefined") {
  injectStyles();
}
