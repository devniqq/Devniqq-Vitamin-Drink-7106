import { Reveal } from "./sections";
import { DrinkScene } from "./drink-scene";

// ---------- 06 In use: stylised 3D scene, the person drinks from the can ----------
export function InUseSection() {
  return (
    <section id="in-use" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--orange)]">06 · In use</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight md:text-5xl">Open it. Drink it. Done.</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--ink)]/75">
            One pull on the tab, no cup, no measuring. The can fits a gym bag, a school bag or a desk drawer.
          </p>
          <ul className="mt-8 space-y-3 text-[var(--ink)]/80">
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--orange)]" />Ready to drink, no mixing.</li>
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--orange)]" />330 ml, resealable for the same day.</li>
            <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--orange)]" />One can a day covers the daily vitamin routine.</li>
          </ul>
        </Reveal>

        <Reveal i={1} className="flex justify-center">
          <div className="relative w-full max-w-[380px]">
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-b from-white to-[var(--silver)]/40" />
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white to-[var(--silver)]/60 shadow-2xl" style={{ aspectRatio: "4 / 5" }}>
              <DrinkScene />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
