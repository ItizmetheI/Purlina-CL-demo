"use client";

const RADIUS = "clamp(6.5rem, 19vw, 12.5rem)";
const DURATION = "46s";

const ITEMS = [
  {
    label: "Otomotiv",
    color: "text-foreground",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.75" />
        <path d="M12 3v4.2M12 16.8V21M21 12h-4.2M7.2 12H3M18.4 5.6l-2.97 2.97M8.57 15.43l-2.97 2.97M18.4 18.4l-2.97-2.97M8.57 8.57 5.6 5.6" />
      </svg>
    ),
  },
  {
    label: "Medikal",
    color: "text-accent",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M5 6.5l14 11M19 6.5l-14 11" />
        <path d="M12 2.5 10.3 4M12 2.5 13.7 4M12 21.5 10.3 20M12 21.5 13.7 20" />
        <path d="M5 6.5 4.3 4M5 6.5l2.6-.6M19 6.5 19.7 4M19 6.5l-2.6-.6M5 17.5 4.3 20M5 17.5l2.6.6M19 17.5l.7 2.5M19 17.5l-2.6.6" />
      </svg>
    ),
  },
  {
    label: "Kozmetik",
    color: "text-accent-warm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2h5" />
        <path d="M10.25 2v3.1c0 .5-.2 1-.57 1.36l-1.36 1.36A2.5 2.5 0 0 0 7.6 9.57V19.5A2.5 2.5 0 0 0 10.1 22h3.8a2.5 2.5 0 0 0 2.5-2.5V9.57c0-.66-.26-1.3-.73-1.77l-1.36-1.36a1.92 1.92 0 0 1-.56-1.35V2" />
        <path d="M8.2 13.5h7.6" />
      </svg>
    ),
  },
];

export default function SectorOrbit() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex sm:justify-end sm:pr-[10%] lg:pr-[16%]"
      aria-hidden="true"
    >
      <div className="orbit-ring relative h-0 w-0">
        {ITEMS.map((item, i) => {
          const angle = (360 / ITEMS.length) * i;
          return (
            <div
              key={item.label}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${RADIUS}) rotate(${-angle}deg)`,
              }}
            >
              <div className="orbit-counter flex h-16 w-16 flex-col items-center justify-center gap-1.5 rounded-full border border-border bg-surface/90 shadow-[0_20px_50px_-25px_rgba(16,20,28,0.45)] backdrop-blur-sm sm:h-20 sm:w-20">
                <span className={`h-6 w-6 sm:h-7 sm:w-7 ${item.color}`}>{item.icon}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .orbit-ring {
          animation: orbit-spin ${DURATION} linear infinite;
        }
        .orbit-counter {
          animation: orbit-spin-reverse ${DURATION} linear infinite;
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}
