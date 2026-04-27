import { useEffect, useMemo, useRef, useState } from "react";

export type WheelDare = {
  label: string;
  short: string;
};

type Props = {
  dares: WheelDare[];
  spinning: boolean;
  /** index that should land under the pointer when spinning ends */
  targetIndex: number | null;
  onSpinComplete: () => void;
};

const SLICE_COLORS = [
  "hsl(var(--w1))",
  "hsl(var(--w2))",
  "hsl(var(--w3))",
  "hsl(var(--w4))",
  "hsl(var(--w5))",
  "hsl(var(--w6))",
  "hsl(var(--w7))",
  "hsl(var(--w8))",
];

export const FunWheel = ({ dares, spinning, targetIndex, onSpinComplete }: Props) => {
  const [rotation, setRotation] = useState(0);
  const completedRef = useRef(false);
  const sliceCount = dares.length;
  const sliceAngle = 360 / sliceCount;

  const slices = useMemo(() => {
    const radius = 160;
    const cx = 170;
    const cy = 170;
    return dares.map((dare, i) => {
      const startAngle = i * sliceAngle - 90;
      const endAngle = startAngle + sliceAngle;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      const largeArc = sliceAngle > 180 ? 1 : 0;
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      // Text position
      const midAngle = startAngle + sliceAngle / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const tx = cx + radius * 0.62 * Math.cos(midRad);
      const ty = cy + radius * 0.62 * Math.sin(midRad);

      return {
        path,
        color: SLICE_COLORS[i % SLICE_COLORS.length],
        label: dare.short,
        tx,
        ty,
        rotate: midAngle + 90,
      };
    });
  }, [dares, sliceAngle]);

  useEffect(() => {
    if (spinning && targetIndex !== null) {
      completedRef.current = false;
      // pointer is at top (angle -90 / 270). Each slice center sits at i*sliceAngle - 90 + sliceAngle/2.
      // We want that center under the pointer (top). So required rotation R such that
      // (centerAngle + R) mod 360 == -90 (i.e. 270)
      const centerAngle = targetIndex * sliceAngle + sliceAngle / 2 - 90;
      const desired = -90 - centerAngle; // before normalizing
      const fullTurns = 6 * 360;
      // Compute current rotation modded
      const currentMod = ((rotation % 360) + 360) % 360;
      const desiredMod = ((desired % 360) + 360) % 360;
      let delta = desiredMod - currentMod;
      if (delta <= 0) delta += 360;
      const next = rotation + fullTurns + delta;
      setRotation(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, targetIndex]);

  return (
    <div className="relative mx-auto w-full max-w-[360px] aspect-square">
      {/* Outer ring with bulbs */}
      <div className="absolute inset-0 rounded-full bg-gradient-warm shadow-pop" />
      <div className="absolute inset-[10px] rounded-full bg-card" />

      {/* Pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20">
        <div className="ticker" />
      </div>

      {/* Wheel SVG */}
      <div className="absolute inset-[18px]">
        <svg
          viewBox="0 0 340 340"
          className="w-full h-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 5.2s cubic-bezier(0.17, 0.67, 0.23, 1)"
              : "none",
          }}
          onTransitionEnd={() => {
            if (spinning && !completedRef.current) {
              completedRef.current = true;
              onSpinComplete();
            }
          }}
        >
          {slices.map((s, i) => (
            <g key={i}>
              <path d={s.path} fill={s.color} stroke="hsl(var(--card))" strokeWidth={2} />
              <text
                x={s.tx}
                y={s.ty}
                fill="hsl(var(--primary-foreground))"
                fontSize="14"
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${s.rotate} ${s.tx} ${s.ty})`}
                style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "0.02em" }}
              >
                {s.label}
              </text>
            </g>
          ))}
          <circle cx={170} cy={170} r={28} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={3} />
          <circle cx={170} cy={170} r={10} fill="hsl(var(--primary))" />
        </svg>
      </div>
    </div>
  );
};
