"use client";

import Reveal from "@/components/Reveal";

export default function Cta() {
  return (
    <section
      id="cta"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center sm:px-12"
    >
      <Reveal className="flex w-full flex-col items-center">
        <p className="mb-3 font-display text-xs font-medium uppercase tracking-[0.5em] text-accent">
          Hemen Başlayın
        </p>
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl">
          Sektörünüz için Purlina Matrix&apos;i keşfedin
        </h2>

        <form
          className="mt-10 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-surface p-2 pl-6 shadow-[0_20px_60px_-30px_rgba(16,20,28,0.35)] transition-colors focus-within:border-accent/50"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Purlina Matrix Oluştur"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-2 focus:outline-none sm:text-base"
          />
          <button
            type="submit"
            aria-label="Oluştur"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-warm text-white transition-transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </form>

        <p className="mt-16 font-display text-xs uppercase tracking-[0.4em] text-muted-2">
          © Purlina — Yeni Nesil Toplama Teknolojisi
        </p>
      </Reveal>
    </section>
  );
}
