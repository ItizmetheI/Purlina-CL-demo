"use client";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-end px-6 pb-16 sm:px-12 sm:pb-24 lg:px-20"
    >
      <p className="mb-6 font-display text-[10px] font-medium uppercase tracking-[0.6em] text-accent opacity-80">
        Yeni Nesil Toplama Teknolojisi
      </p>

      <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-foreground">
        Kirliliği
        <br />
        <span className="text-foreground/60">toplayan</span>
        <br />
        sıvı matris.
      </h1>

      <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
        Hidrofobik organik kirleticileri fiziksel olarak bünyesine alır —
        suda dağılmadan Purlina fazında toplanır.
      </p>

      <div className="absolute bottom-10 right-6 flex flex-col items-center gap-3 sm:right-12 lg:right-20">
        <div className="relative h-16 w-px overflow-hidden bg-foreground/10">
          <div className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-gradient-to-b from-accent to-transparent" />
        </div>
        <span className="font-display text-[9px] uppercase tracking-[0.5em] text-muted-2 [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollcue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(250%); }
        }
      `}</style>
    </section>
  );
}
