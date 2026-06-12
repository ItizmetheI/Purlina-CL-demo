"use client";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center px-6 pt-32 pb-16 sm:px-12 lg:px-20"
    >
      <div className="max-w-xl">
        <p className="mb-5 font-display text-xs font-medium uppercase tracking-[0.5em] text-accent">
          Yeni Nesil
        </p>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Kirliliği toplayan
          <br />
          sıvı matris.
        </h1>
        <p className="mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Suyla karışmayan, suda çözünmeyen inert bir sıvı faz — hidrofobik
          organik kirleticileri fiziksel olarak bünyesine alır. Kirleticiler
          suda dağılmadan Purlina fazında toplanır.
        </p>
      </div>

      <div className="mt-20 flex items-center gap-3 text-muted sm:absolute sm:bottom-12 sm:left-12 sm:mt-0 lg:left-20">
        <div className="relative h-10 w-px overflow-hidden bg-border">
          <div className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gradient-to-b from-accent to-transparent" />
        </div>
        <span className="font-display text-xs uppercase tracking-[0.35em]">Kaydır</span>
      </div>

      <style>{`
        @keyframes scrollcue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
