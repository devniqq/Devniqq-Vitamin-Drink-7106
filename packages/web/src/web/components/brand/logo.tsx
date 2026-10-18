import { motion } from "motion/react";

const INK = "#14183F";
const ORANGE = "#F26B1D";

type MarkProps = {
  size?: number;
  drop?: string;
  spark?: string;
  animate?: boolean;
};

// The devniqq mark: a drop with a single spark.
export function Mark({ size = 96, drop = INK, spark = ORANGE, animate = false }: MarkProps) {
  const Svg = (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="devniqq mark" role="img">
      <path d="M50 8 C50 8 18 46 18 66 a32 32 0 0 0 64 0 C82 46 50 8 50 8Z" fill={drop} />
      <path d="M68 26 L70 33 L77 35 L70 37 L68 44 L66 37 L59 35 L66 33 Z" fill={spark} />
    </svg>
  );
  if (!animate) return Svg;
  return (
    <motion.div whileHover={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 0.6 }} style={{ display: "inline-block" }}>
      {Svg}
    </motion.div>
  );
}

// Full lockup: mark + wordmark.
export function Lockup({
  size = 56,
  ink = INK,
  drop,
  spark,
  animate = false,
}: {
  size?: number;
  ink?: string;
  drop?: string;
  spark?: string;
  animate?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5" style={{ color: ink }}>
      <Mark size={size} drop={drop ?? ink} spark={spark} animate={animate} />
      <span className="font-display font-extrabold leading-none tracking-tight" style={{ fontSize: size * 0.7 }}>
        devniqq
      </span>
    </div>
  );
}

// Stacked lockup: mark above wordmark.
export function StackedLogo({ size = 110, ink = INK, drop, spark }: { size?: number; ink?: string; drop?: string; spark?: string }) {
  return (
    <div className="flex flex-col items-center gap-3" style={{ color: ink }}>
      <Mark size={size} drop={drop ?? ink} spark={spark} />
      <span className="font-display font-extrabold leading-none tracking-tight" style={{ fontSize: size * 0.4 }}>
        devniqq
      </span>
    </div>
  );
}
