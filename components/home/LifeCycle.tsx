"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScanLine {
    dir: "h" | "v";
    pos: number;
    head: number;
    length: number;
    speed: number;
    alpha: number;
    weight: number;
}

// ─── Factory ─────────────────────────────────────────────────────────────────

const LENGTH_FRACTIONS = [0.10, 0.14, 0.18, 0.22, 0.28, 0.34, 0.38];

function makeLine(w: number, h: number, scatter = false): ScanLine {
    const dir: "h" | "v" = Math.random() > 0.42 ? "v" : "h";
    const dim = dir === "h" ? w : h;
    const perp = dir === "h" ? h : w;
    const frac = LENGTH_FRACTIONS[Math.floor(Math.random() * LENGTH_FRACTIONS.length)];
    const length = frac * dim;
    return {
        dir,
        pos: Math.random() * perp,
        head: scatter ? Math.random() * (dim + length) - length : -length,
        length,
        speed: 0.35 + Math.random() * 1.1,
        alpha: 0.20 + Math.random() * 0.55,
        weight: Math.random() > 0.6 ? 1.0 : 0.5,
    };
}

// ─── Content ─────────────────────────────────────────────────────────────────

const LIFECYCLE_ITEMS = [
    "Discovery call & kickoff",
    "Requirements & scope",
    "Design & prototyping",
    "Architecture & planning",
    "Iterative development",
    "Testing & client review",
    "Launch & handover",
];
// ─── Layout constants ─────────────────────────────────────────────────────────

const WHEEL_DIAMETER = 300;
const PAD_LEFT = 40;   // wheel start offset from left edge (px)
const PAD_RIGHT = 64;  // wheel end offset from right edge (px)

/**
 * Returns item position as percentages of container dimensions.
 * Diagonal: bottom-left (i=0) → top-right (i=n-1)
 */
function getItemPos(i: number, n: number) {
    const t = n > 1 ? i / (n - 1) : 0;
    return {
        leftPct: 6 + t * 70,    // 6% → 76%
        bottomPct: 18 + t * 56, // 18% → 74%
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Lifecycle() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const outerRingRef = useRef<SVGGElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const pathRef = useRef<SVGPathElement>(null);
    const linesRef = useRef<ScanLine[]>([]);
    const rafRef = useRef<number>(0);
    const sizeRef = useRef({ w: 0, h: 0 });
    const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

    // ── Blueprint canvas animation (unchanged) ───────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let running = true;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            sizeRef.current = { w: rect.width, h: rect.height };
            canvas.width = Math.round(rect.width * devicePixelRatio);
            canvas.height = Math.round(rect.height * devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        const NUM_LINES = 32;
        linesRef.current = Array.from({ length: NUM_LINES }, () => {
            const { w, h } = sizeRef.current;
            return makeLine(w, h, true);
        });

        const draw = () => {
            if (!running) return;
            const { w, h } = sizeRef.current;

            ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
            ctx.clearRect(0, 0, w, h);

            const FINE = 28;
            const MAJOR_N = 5;
            const MAJOR = FINE * MAJOR_N;

            ctx.lineWidth = 0.4;
            ctx.strokeStyle = "rgba(255,255,255,0.045)";
            for (let x = 0; x <= w; x += FINE) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y <= h; y += FINE) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            ctx.lineWidth = 0.6;
            ctx.strokeStyle = "rgba(255,255,255,0.10)";
            for (let x = 0; x <= w; x += MAJOR) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            for (let y = 0; y <= h; y += MAJOR) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            const TICK = 5;
            ctx.strokeStyle = "rgba(255,255,255,0.22)";
            ctx.lineWidth = 0.7;
            for (let x = MAJOR; x < w; x += MAJOR) {
                for (let y = MAJOR; y < h; y += MAJOR) {
                    ctx.beginPath(); ctx.moveTo(x - TICK, y); ctx.lineTo(x + TICK, y); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(x, y - TICK); ctx.lineTo(x, y + TICK); ctx.stroke();
                }
            }

            const bx = [MAJOR, w - MAJOR];
            const by = [MAJOR, h - MAJOR];
            const BRACKET = 10;
            ctx.strokeStyle = "rgba(255,255,255,0.30)";
            ctx.lineWidth = 0.8;
            bx.forEach((cx) => {
                by.forEach((cy) => {
                    const sx = cx < w / 2 ? 1 : -1;
                    const sy = cy < h / 2 ? 1 : -1;
                    ctx.beginPath();
                    ctx.moveTo(cx - sx * BRACKET, cy);
                    ctx.lineTo(cx, cy);
                    ctx.lineTo(cx, cy - sy * BRACKET);
                    ctx.stroke();
                });
            });

            linesRef.current.forEach((line) => {
                line.head += line.speed;
                const dim = line.dir === "h" ? w : h;
                if (line.head - line.length > dim) {
                    Object.assign(line, makeLine(w, h, false));
                    return;
                }
                const tail = line.head - line.length;
                let grad: CanvasGradient;
                if (line.dir === "h") {
                    grad = ctx.createLinearGradient(tail, line.pos, line.head, line.pos);
                } else {
                    grad = ctx.createLinearGradient(line.pos, tail, line.pos, line.head);
                }
                grad.addColorStop(0, "rgba(255,255,255,0)");
                grad.addColorStop(0.55, `rgba(255,255,255,${(line.alpha * 0.55).toFixed(3)})`);
                grad.addColorStop(1, `rgba(255,255,255,${line.alpha.toFixed(3)})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = line.weight;
                ctx.beginPath();
                if (line.dir === "h") {
                    ctx.moveTo(Math.max(0, tail), line.pos);
                    ctx.lineTo(Math.min(w, line.head), line.pos);
                } else {
                    ctx.moveTo(line.pos, Math.max(0, tail));
                    ctx.lineTo(line.pos, Math.min(h, line.head));
                }
                ctx.stroke();
            });

            const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, h * 0.85);
            vignette.addColorStop(0, "rgba(0,0,0,0)");
            vignette.addColorStop(1, "rgba(0,0,0,0.35)");
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, w, h);

            rafRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            running = false;
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    // ── Curtain reveal (unchanged) ───────────────────────────────────────────
    useEffect(() => {
        const wrapper = wrapperRef.current;
        const sticky = stickyRef.current;
        if (!wrapper || !sticky) return;

        gsap.set(sticky, { clipPath: "inset(100% 0% 0% 0%)" });

        const trigger = ScrollTrigger.create({
            trigger: wrapper,
            start: "top bottom",
            end: "top top",
            scrub: 1.8,
            onUpdate(self) {
                const remaining = (1 - self.progress) * 100;
                gsap.set(sticky, {
                    clipPath: `inset(${remaining.toFixed(2)}% 0% 0% 0%)`,
                });
            },
        });

        return () => { trigger.kill(); };
    }, []);

    // ── Wheel + lifecycle items animation ────────────────────────────────────
    useEffect(() => {
        const wrapper = wrapperRef.current;
        const sticky = stickyRef.current;
        const wheel = wheelRef.current;
        const path = pathRef.current;
        if (!wrapper || !sticky || !wheel) return;

        const n = LIFECYCLE_ITEMS.length;
        const containerW = sticky.offsetWidth;
        const containerH = sticky.offsetHeight;

        // Wheel travel & rotation — fully physics-derived from diameter
        const travelX = containerW - PAD_LEFT - WHEEL_DIAMETER - PAD_RIGHT;
        const totalRotation = Math.PI * WHEEL_DIAMETER * 360;

        // Initial states
        // y = WHEEL_DIAMETER/2 pushes wheel down so only top half is visible (clipped by overflow-hidden)
        gsap.set(wheel, { x: 0, y: WHEEL_DIAMETER / 2, rotation: 0 });
        itemRefs.current.forEach((el) => {
            if (el) gsap.set(el, { opacity: 0, y: 32, scale: 0.85 });
        });

        // Build SVG connecting path from item positions
        if (path) {
            const points = Array.from({ length: n }, (_, i) => {
                const item = itemRefs.current[i];
                const dot = dotRefs.current[i];
                if (!item || !dot) return { x: 0, y: 0 };
                // offsetLeft/offsetTop ignore the GSAP transforms (y: 32, scale: 0.85),
                // so this gives the dot's final resting centre
                return {
                    x: item.offsetLeft + dot.offsetLeft + dot.offsetWidth / 2,
                    y: item.offsetTop + dot.offsetTop + dot.offsetHeight / 2,
                };
            });
            const d = points.reduce(
                (acc, p, i) => `${acc}${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)} `,
                ""
            );
            path.setAttribute("d", d);
            const pathLen = path.getTotalLength();
            // Full dash = fully hidden; animate offset to 0 = fully drawn
            gsap.set(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

            // Line draws in sync with scroll progress
            // (added to timeline below after tl is created)
            // Stored here to access in closure
            (path as SVGPathElement & { _len?: number })._len = pathLen;
        }

        // ── Main scrubbed timeline ────────────────────────────────────────────
        const tl = gsap.timeline({ paused: true });

        // 1. Wheel rolls across — ease: none keeps it physically linear
        tl.to(
            wheel,
            { x: 0, y: 0, rotation: totalRotation, ease: "none", duration: 1 },
            0
        );
        // Counter-rotate outer rings — they appear stationary (fixed housing) as bearing rolls
        tl.to(outerRingRef.current, {
            rotation: -totalRotation,
            svgOrigin: "400 400",
            ease: "none",
            duration: 1,
        }, 0);

        // 2. Line draws across the full scroll range
        if (path) {
            tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
        }

        // 3. Items reveal as the wheel's leading edge reaches each item's x position.
        //    revealAt is normalised [0,1] → position in the timeline.
        //    Animation duration is short (0.07) to feel snappy / "ejected" from under wheel.
        const wheelStartCx = PAD_LEFT + WHEEL_DIAMETER;       // leading edge at start
        const wheelEndCx = PAD_LEFT + travelX + WHEEL_DIAMETER; // leading edge at end
        const wheelRange = wheelEndCx - wheelStartCx;

        LIFECYCLE_ITEMS.forEach((_, i) => {
            const el = itemRefs.current[i];
            if (!el) return;

            const { leftPct } = getItemPos(i, n);
            const itemX = (leftPct / 100) * containerW;
            const revealAt = Math.min(0.95, Math.max(0.01, (itemX - wheelStartCx) / wheelRange));

            tl.to(
                el,
                { opacity: 1, y: 0, scale: 1, duration: 0.07, ease: "back.out(1.7)" },
                revealAt
            );
        });

        // ── ScrollTrigger drives the timeline ────────────────────────────────
        // start: "top top"     = curtain is fully open (picks up exactly where curtain ends)
        // end:   "bottom bottom" = wrapper bottom hits viewport bottom (full 150vh of pin)
        const st = ScrollTrigger.create({
            trigger: wrapper,
            start: "top top",
            end: `+=${window.innerHeight * 1.5}`,
            pin: true,
            anticipatePin: 1,
            scrub: 1.5,
            onUpdate(self) {
                tl.progress(self.progress);
            },
        });

        return () => {
            st.kill();
            tl.kill();
        };
    }, []);

    // ────────────────────────────────────────────────────────────────────────────

    return (
        <section className="full-bleed" aria-label="Our software development cycle">
            <div ref={wrapperRef} className="relative">
                <div ref={stickyRef} className="sticky top-0 h-screen bg-blue overflow-hidden" style={{ willChange: "clip-path" }}>
                    <h2 className="text-white/80 absolute top-20 left-10">Support Across the Entire <br /> Product Lifecycle</h2>
                    {/* Blueprint canvas */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full pointer-events-none select-none"
                        aria-hidden="true"
                    />

                    {/* ── SVG lifecycle path — drawn progressively with the wheel ── */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ zIndex: 15 }}
                    >
                        <defs>
                            {/* Soft glow so the line reads as an active/live connection */}
                            <filter id="lc-glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <path
                            ref={pathRef}
                            fill="none"
                            stroke="rgba(255,255,255,0.40)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#lc-glow)"
                        />
                    </svg>

                    {/* ── Lifecycle items — diagonal, bottom-left → top-right ── */}
                    <div className="absolute inset-0" style={{ zIndex: 20 }}>
                        {LIFECYCLE_ITEMS.map((item, i) => {
                            const { leftPct, bottomPct } = getItemPos(i, LIFECYCLE_ITEMS.length);
                            return (
                                <div
                                    key={i}
                                    ref={(el) => { itemRefs.current[i] = el; }}
                                    className="absolute flex items-center gap-5"
                                    style={{ left: `${leftPct}%`, bottom: `${bottomPct}%` }}
                                >
                                    {/* Phase number */}
                                    <span className="text-white/30 font-mono text-[10px] tabular-nums leading-none select-none">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    {/* Node dot with ring — the point the path threads through */}
                                    <div ref={(el) => { dotRefs.current[i] = el; }}
                                        className="relative flex items-center justify-center w-3 h-3 shrink-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                                        <div className="absolute w-3 h-3 rounded-full border border-white/25" />
                                    </div>

                                    {/* Label */}
                                    <span className="text-white/85 text-sm font-medium tracking-wide whitespace-nowrap" style={{ fontSize: "clamp(1 rem, 1.25vw + .25rem,  1.5 rem)" }}>
                                        {item}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Ball bearing wheel ── */}
                    {/*
          - bottom-0 + y: WHEEL_DIAMETER/2 via GSAP → only top half visible initially
          - As scroll progresses, y animates to 0 → fully revealed
          - x animates 0 → travelX (left → right)
          - rotation: physically derived from circumference
        */}
                    <div
                        ref={wheelRef}
                        className="absolute bottom-0"
                        style={{
                            right: PAD_LEFT,
                            width: WHEEL_DIAMETER,
                            height: WHEEL_DIAMETER,
                            zIndex: 30,
                        }}
                    >
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 800 800"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Ball bearing"
                        >
                            <g fill="none" stroke="rgba(255,255,255,0.75)" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                    <clipPath id="bearing-clip">
                                        <circle cx="400" cy="400" r="360" />
                                    </clipPath>
                                </defs>

                                {/* Outer two rings */}
                                <g ref={outerRingRef} >
                                    <circle cx="400" cy="400" r="360" strokeWidth="2.5" />
                                    <circle cx="400" cy="400" r="330" strokeWidth="1.5" />
                                </g>

                                {/* Everything else clipped to the outer circumference */}
                                <g clipPath="url(#bearing-clip)">
                                    {/* Raceway outer */}
                                    <circle cx="400" cy="400" r="300" strokeWidth="1.2" />
                                    <circle cx="400" cy="400" r="280" strokeWidth="1.2" />

                                    {/* Cage boundary */}
                                    <circle cx="400" cy="400" r="250" strokeWidth="1" strokeDasharray="6 6" />
                                    <circle cx="400" cy="400" r="230" strokeWidth="1" strokeDasharray="6 6" />

                                    {/* Raceway inner */}
                                    <circle cx="400" cy="400" r="200" strokeWidth="1.2" />
                                    <circle cx="400" cy="400" r="170" strokeWidth="1.2" />

                                    {/* Inner ring */}
                                    <circle cx="400" cy="400" r="140" strokeWidth="2.5" />
                                    <circle cx="400" cy="400" r="110" strokeWidth="1.5" />

                                    {/* Ball bearings */}
                                    <g strokeWidth="1.2">
                                        <g id="ball">
                                            <circle cx="400" cy="140" r="16" />
                                            <circle cx="400" cy="140" r="10" strokeWidth="0.6" opacity="0.5" />
                                        </g>
                                        {[22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
                                            <use key={deg} href="#ball" transform={`rotate(${deg} 400 400)`} />
                                        ))}
                                    </g>

                                    {/* Radial guides */}
                                    <g strokeWidth="0.6" opacity="0.25">
                                        <line x1="400" y1="40" x2="400" y2="760" />
                                        <line x1="40" y1="400" x2="760" y2="400" />
                                        <line x1="120" y1="120" x2="680" y2="680" />
                                        <line x1="680" y1="120" x2="120" y2="680" />
                                    </g>

                                    {/* Outer technical ticks */}
                                    <g strokeWidth="1">
                                        <line x1="400" y1="40" x2="400" y2="70" />
                                        <line x1="400" y1="730" x2="400" y2="760" />
                                        <line x1="40" y1="400" x2="70" y2="400" />
                                        <line x1="730" y1="400" x2="760" y2="400" />
                                    </g>
                                </g>

                            </g>
                        </svg>
                    </div>
                </div>
            </div >
        </section>
    );
}