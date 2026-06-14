"use client";

import Reveal from "@/components/Reveal";

export default function Cta() {
  return (
    <section
      id="cta"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center sm:px-12"
    >
      <Reveal className="flex w-full flex-col items-center">
        <p className="mb-4 font-display text-[10px] font-medium uppercase tracking-[0.6em] text-accent">
          Hemen Başlayın
        </p>
        <h2 className="max-w-3xl font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground">
          Sektörünüz için
          <br />
          <span className="text-foreground/40">Purlina Matrix&apos;i</span>
          <br />
          keşfedin
        </h2>

        <form
          className="mt-12 flex w-full max-w-lg items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] p-2 pl-6 backdrop-blur-sm transition-colors focus-within:border-accent/40"
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </form>

        <div className="mt-20 flex items-center gap-6">
          <div className="h-px w-16 bg-foreground/10" />
          <p className="font-display text-[9px] uppercase tracking-[0.5em] text-muted-2">
            © Purlina — Yeni Nesil Toplama Teknolojisi
          </p>
          <div className="h-px w-16 bg-foreground/10" />
        </div>
      </Reveal>
    </section>
  );
}
