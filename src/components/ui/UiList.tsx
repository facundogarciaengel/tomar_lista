'use client';

type UiListProps = {
  items: React.ReactNode[];
  shimmer?: boolean;
};

// ReactBits: Animated List Placeholder
// props clave: shimmer
// Doc: https://reactbits.dev/loaders/animated-list
export function UiList({ items, shimmer = true }: UiListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4"
        >
          {shimmer ? <div className="rb-shimmer" aria-hidden /> : null}
          <div className="relative z-10 text-sm text-slate-100/90">{item}</div>
        </li>
      ))}
    </ul>
  );
}

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("react-bits-list")) return;

  const style = document.createElement("style");
  style.id = "react-bits-list";
  style.innerHTML = `
    .rb-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.25) 50%, transparent 70%);
      transform: translateX(-100%);
      animation: rb-shimmer 2.4s infinite;
    }

    @keyframes rb-shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;
  document.head.appendChild(style);
}

if (typeof window !== "undefined") {
  ensureStyles();
}
