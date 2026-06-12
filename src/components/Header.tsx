"use client";

export default function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between border-b border-border/60 bg-background/70 px-6 pb-4 pt-6 backdrop-blur-md sm:px-10 sm:pb-5 sm:pt-8">
      <a href="#top" className="pointer-events-auto flex flex-col leading-[1.05]">
        <span className="font-display text-[0.65rem] font-medium uppercase tracking-[0.5em] text-muted">
          Purlina
        </span>
        <span className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Matrix
        </span>
      </a>

      <nav className="pointer-events-auto hidden items-center gap-9 font-display text-xs font-medium uppercase tracking-[0.3em] text-muted sm:flex">
        <a href="#benefits" className="transition-colors hover:text-foreground">
          Faydalar
        </a>
        <a href="#sectors" className="transition-colors hover:text-foreground">
          Sektörler
        </a>
        <a href="#cta" className="transition-colors hover:text-foreground">
          İletişim
        </a>
      </nav>

      <button
        type="button"
        aria-label="Menü"
        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/70 backdrop-blur-sm sm:hidden"
      >
        <span className="sr-only">Menü</span>
        <div className="flex flex-col gap-[5px]">
          <span className="block h-[1.5px] w-4 bg-foreground" />
          <span className="block h-[1.5px] w-4 bg-foreground" />
        </div>
      </button>
    </header>
  );
}
