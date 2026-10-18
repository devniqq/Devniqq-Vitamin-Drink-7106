import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Can3D } from "./can-3d";
import { Lockup, Mark, StackedLogo } from "./logo";

const EASE = [0.2, 0.8, 0.2, 1] as const;

// Headline split into words that rise in one after another.
function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className={`inline-block overflow-hidden align-bottom ${i < words.length - 1 ? "mr-[0.25em]" : ""}`}>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 6 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}

// Thin scroll progress bar across the top of the page.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[var(--orange)]" />;
}

// Scrolling strip of product facts between the hero and the logo section.
export function Ticker() {
  const items = ["Citrus", "Berry", "Classic", "Vitamin C", "Vitamin D", "Zinc", "B-complex", "One can a day"];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden bg-[var(--ink)] py-5 text-white">
      <motion.div
        className="font-display flex w-max gap-10 whitespace-nowrap text-2xl font-bold uppercase tracking-wider"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t}
            <span className="h-2 w-2 rounded-full bg-[var(--orange)]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Reveal({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ no, title, kicker }: { no: string; title: string; kicker: string }) {
  return (
    <Reveal className="mb-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--orange)]">
        {no} · {kicker}
      </p>
      <h2 className="font-display mt-3 text-4xl font-bold leading-tight md:text-5xl">{title}</h2>
    </Reveal>
  );
}

// ---------- Nav ----------
export function Nav() {
  const links = [
    ["#logo", "Logo"],
    ["#color", "Color"],
    ["#type", "Type"],
    ["#imagery", "Imagery"],
    ["#packaging", "Packaging"],
    ["#in-use", "In use"],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink)]/10 bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" aria-label="devniqq home">
          <Lockup size={36} />
        </a>
        <nav className="hidden gap-8 text-sm font-semibold md:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-[var(--orange)]">
              {label}
            </a>
          ))}
        </nav>
        <a href="#packaging" className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--orange)]">
          View the can
        </a>
      </div>
    </header>
  );
}

// ---------- Hero ----------
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const canY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const canScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      <div className="grain absolute inset-0" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-16 md:grid-cols-2 md:pt-24">
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--orange)]">
            Daily vitamin drink
          </motion.p>
          <h1 className="font-display mt-5 text-6xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
            <Words text="Everyday vitamins," />
            <br />
            <span className="text-[var(--orange)]">
              <Words text="in one can." delay={0.5} />
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--ink)]/75">
            devniqq is a daily vitamin drink for kids, athletes and adults. Clear labelling, simple taste, one can a day.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#logo" className="rounded-full bg-[var(--ink)] px-7 py-3 font-semibold text-white transition hover:bg-[var(--orange)]">
              Brand guidelines
            </a>
            <a href="#color" className="pill-line rounded-full bg-white px-7 py-3 font-semibold transition hover:border-[var(--orange)]">
              Colors & type
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          style={{ y: canY, scale: canScale }}
          className="relative h-[520px] md:h-[600px]"
        >
          <div className="absolute inset-x-10 bottom-10 top-10 rounded-[32px] bg-gradient-to-b from-white to-[var(--silver)]/40" />
          <div className="absolute inset-0">
            <Can3D flavor="Citrus" scrollSpin />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------- 01 Logo ----------
export function LogoSection() {
  const tiles = [
    { label: "Primary", bg: "bg-white", el: <Lockup size={64} animate /> },
    { label: "Reversed", bg: "bg-[var(--ink)]", el: <Lockup size={64} ink="#FFFFFF" drop="#FFFFFF" spark="#F26B1D" /> },
    { label: "Stacked", bg: "bg-white", el: <StackedLogo size={108} /> },
    { label: "Icon", bg: "bg-[var(--orange)]", el: <Mark size={120} drop="#14183F" spark="#FFFFFF" /> },
    { label: "Mono silver", bg: "bg-[var(--silver)]/30", el: <Lockup size={64} ink="#14183F" drop="#14183F" spark="#14183F" /> },
    { label: "On orange", bg: "bg-[var(--orange)]", el: <Lockup size={64} ink="#14183F" drop="#14183F" spark="#FFFFFF" /> },
  ];
  return (
    <section id="logo" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader no="01" kicker="Logo" title="A drop and a spark." />
      <div className="grid gap-5 md:grid-cols-3">
        {tiles.map((t, i) => (
          <Reveal key={t.label} i={i % 3} className={`card flex h-60 flex-col items-center justify-between p-6 ${t.bg}`}>
            <div className="flex flex-1 items-center justify-center">{t.el}</div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{t.label}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Reveal className="card bg-white p-8">
          <h3 className="font-display text-2xl font-bold">Construction</h3>
          <ul className="mt-4 space-y-2 leading-relaxed text-[var(--ink)]/80">
            <li>The drop stands for the drink. The spark marks the vitamin boost. Use the spark once per layout.</li>
            <li>Clear space equals the height of the "d" on every side.</li>
            <li>Minimum size: 24 px digital, 10 mm print.</li>
          </ul>
        </Reveal>
        <Reveal i={1} className="card bg-white p-8">
          <h3 className="font-display text-2xl font-bold">Don'ts</h3>
          <ul className="mt-4 space-y-2 leading-relaxed text-[var(--ink)]/80">
            <li>Don't stretch, rotate, or add shadows to the logo.</li>
            <li>Don't place the full-color logo on orange. Use the on-orange version.</li>
            <li>Don't recolor the wordmark outside the three brand colors.</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- 02 Color ----------
const PALETTE = [
  { name: "Night Ink", hex: "#14183F", rgb: "20 24 63", use: "Primary. Text, can label, headlines.", text: "#FFFFFF" },
  { name: "Signal Orange", hex: "#F26B1D", rgb: "242 107 29", use: "Accent. One highlight per layout, CTAs.", text: "#14183F" },
  { name: "Aluminium Silver", hex: "#C9CED6", rgb: "201 206 214", use: "Secondary. Can surfaces, dividers, panels.", text: "#14183F" },
];

export function ColorSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
  };
  return (
    <section id="color" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader no="02" kicker="Color" title="Three colors. One neutral." />
        <div className="grid gap-5 md:grid-cols-3">
          {PALETTE.map((c, i) => (
            <Reveal key={c.name} i={i} className="card overflow-hidden">
              <button onClick={() => copy(c.hex)} className="block w-full text-left">
                <div className="flex h-48 items-end p-6" style={{ background: c.hex, color: c.text }}>
                  <span className="font-display text-2xl font-bold">{c.name}</span>
                </div>
                <div className="space-y-1 p-6">
                  <p className="font-semibold">{copied === c.hex ? "Copied" : c.hex}</p>
                  <p className="text-sm text-[var(--ink)]/60">RGB {c.rgb}</p>
                  <p className="pt-2 text-sm text-[var(--ink)]/80">{c.use}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-wrap items-center gap-4">
          <div className="card flex items-center gap-3 px-5 py-3">
            <span className="h-6 w-6 rounded-full border border-[var(--ink)]/20 bg-[var(--paper)]" />
            <span className="text-sm font-semibold">Paper #F4F5F7 · neutral background</span>
          </div>
          <p className="text-sm text-[var(--ink)]/60">Click a swatch to copy its hex code.</p>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- 03 Typography ----------
export function TypeSection() {
  const scale = [
    { label: "Display 72", size: 64, sample: "Everyday vitamins." },
    { label: "H1 48", size: 44, sample: "One can a day." },
    { label: "H2 32", size: 32, sample: "Made for busy days." },
    { label: "Lead 20", size: 20, sample: "Vitamins that fit into your routine." },
    { label: "Body 16", size: 16, sample: "Body copy in Manrope, a clear and neutral sans for all text." },
  ];
  return (
    <section id="type" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader no="03" kicker="Typography" title="One family, clear hierarchy." />
      <div className="grid gap-5 md:grid-cols-5">
        <Reveal className="card flex flex-col justify-between bg-[var(--ink)] p-10 text-white md:col-span-2">
          <p className="font-display text-[160px] font-extrabold leading-none">Aa</p>
          <div className="mt-8">
            <p className="font-display text-3xl font-bold">Manrope</p>
            <p className="mt-1 text-white/70">Display and body · 400, 600, 700, 800</p>
          </div>
        </Reveal>
        <Reveal i={1} className="card bg-white p-8 md:col-span-3">
          <h3 className="font-display mb-6 text-xl font-bold">Type scale</h3>
          <div className="space-y-5">
            {scale.map((s) => (
              <div key={s.label} className="flex items-baseline gap-4 border-b border-[var(--ink)]/10 pb-4">
                <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-widest text-[var(--ink)]/50">{s.label}</span>
                <span className="font-display font-bold leading-tight" style={{ fontSize: s.size }}>
                  {s.sample}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- 04 Imagery ----------
function MoodTile({ title, desc, className, src, alt }: { title: string; desc: string; className: string; src: string; alt: string }) {
  return (
    <Reveal className={`card relative flex h-[30rem] flex-col justify-end overflow-hidden ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative z-10 m-4 rounded-xl bg-white/95 p-4 text-[var(--ink)]">
        <p className="font-display text-lg font-bold">{title}</p>
        <p className="text-sm text-[var(--ink)]/70">{desc}</p>
      </div>
    </Reveal>
  );
}

export function ImagerySection() {
  return (
    <section id="imagery" className="bg-[var(--ink)] py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--orange)]">04 · Imagery</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight md:text-5xl">Clean light, real people, the can in focus.</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          <MoodTile
            title="Kitchen"
            desc="Morning light, the can on the table, no fuss."
            className="bg-white"
            src={`${import.meta.env.BASE_URL}images/mood-kitchen.png`}
            alt="devniqq Citrus can on a kitchen table in morning light"
          />
          <MoodTile
            title="Athletes"
            desc="Outdoor or studio, hard light, sharp contrast."
            className="bg-[var(--silver)]"
            src={`${import.meta.env.BASE_URL}images/mood-athletes.png`}
            alt="Runner holding a devniqq can after a run"
          />
          <MoodTile
            title="Everyday"
            desc="Desks, bags, real routines."
            className="bg-[var(--orange)]"
            src={`${import.meta.env.BASE_URL}images/mood-everyday.png`}
            alt="Person at a desk reaching for a devniqq can"
          />
        </div>
      </div>
    </section>
  );
}

// ---------- 05 Packaging ----------
const FLAVORS = [
  { flavor: "Citrus", desc: "Light citrus taste. Vitamin C and B-complex.", tag: "Athletes" },
  { flavor: "Berry", desc: "Mild berry taste. Vitamin D and zinc for kids.", tag: "Kids" },
  { flavor: "Classic", desc: "Neutral taste. Full daily multivitamin.", tag: "Everyone" },
];

export function PackagingSection() {
  return (
    <section id="packaging" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader no="05" kicker="Packaging" title="One can. Three variants." />
      <div className="grid gap-5 md:grid-cols-3">
        {FLAVORS.map((f, i) => (
          <Reveal key={f.flavor} i={i} className="card flex flex-col bg-white p-6">
            <div className="h-80 w-full">
              <Can3D flavor={f.flavor} camera={6.8} />
            </div>
            <span className="mt-2 w-fit rounded-full border border-[var(--ink)]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">{f.tag}</span>
            <h3 className="font-display mt-3 text-2xl font-bold">{f.flavor}</h3>
            <p className="mt-1 text-[var(--ink)]/75">{f.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------- Footer ----------
export function Footer() {
  return (
    <footer className="border-t border-[var(--ink)]/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-16 text-center">
        <Lockup size={56} />
        <p className="text-[var(--ink)]/70">Everyday vitamins, in one can.</p>
        <p className="text-xs text-[var(--ink)]/50">© devniqq · Brand guidelines v2.0</p>
      </div>
    </footer>
  );
}
