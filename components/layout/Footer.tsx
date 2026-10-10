"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CodeXml } from "lucide-react";

const nowYear = new Date().getFullYear();

gsap.registerPlugin(ScrollTrigger);


// PLACEHOLDER CONTENT: swap in your real details and routes
const ADDRESS = "Invasion-Craft HQ, Your Street, Your City, Your Country";
const EMAIL = "hello@invasion-craft.com";
const PHONE = "+000 000 000 000";

const COLUMNS = [
    {
        title: "Company",
        links: [
            { label: "Who we are", href: "#about" },
            { label: "Our work", href: "#process" },
            { label: "Why choose us", href: "#why-us" },
        ],
    },
    {
        title: "Services",
        links: [
            { label: "Web apps", href: "#services" },
            { label: "Mobile apps", href: "#services" },
            { label: "Desktop apps", href: "#services" },
            { label: "SaaS products", href: "#services" },
        ],
    },
    {
        title: "Process",
        links: [
            { label: "Discovery & kickoff", href: "#" },
            { label: "Design & prototyping", href: "#" },
            { label: "Development", href: "#" },
            { label: "Launch & handover", href: "#" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "#" },
            { label: "Terms of use", href: "#" },
            { label: "Cookies", href: "#" },
        ],
    },
];

function XIcon({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function StrokeIcon({ size = 14, children }: { size?: number; children: React.ReactNode }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <StrokeIcon>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </StrokeIcon>
    );
}

function InstagramIcon() {
    return (
        <StrokeIcon>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </StrokeIcon>
    );
}

function FacebookIcon() {
    return (
        <StrokeIcon>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </StrokeIcon>
    );
}

const linkClass = "text-[12.5px] text-white/70 transition-colors duration-200 hover:text-white";

export default function Footer({ onContact }: { onContact?: () => void }) {
    const rootRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const q = gsap.utils.selector(root);

        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            // Paused timeline; fromTo applies the hidden start state immediately
            const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

            tl
                // 1. Curtain rises from the bottom edge
                .fromTo(
                    q("[data-panel]"),
                    { clipPath: "inset(100% 0% 0% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power4.inOut" },
                    0
                )
                // 2. Link columns rise in, one after another
                .fromTo(
                    q("[data-col]"),
                    { y: 32, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, stagger: 0.09 },
                    0.5
                )
                // 3. Divider draws left to right
                .fromTo(
                    q("[data-line]"),
                    { scaleX: 0 },
                    { scaleX: 1, duration: 0.9, ease: "power3.inOut", transformOrigin: "left center" },
                    0.75
                )
                // 4. Address, copyright and socials
                .fromTo(
                    q("[data-bottom]"),
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
                    0.95
                )
                // 5. Giant wordmark rises last
                .fromTo(
                    q("[data-wordmark]"),
                    { yPercent: 70, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 1.4, ease: "expo.out" },
                    0.6
                );

            const st = ScrollTrigger.create({
                trigger: root,
                start: "top 92%",
                end: "max",
                refreshPriority: -1,
                invalidateOnRefresh: true,
                // Play when the footer scrolls into view
                onEnter: () => { tl.timeScale(1).play(); },
                // Wind it back only when the user scrolls up past the start point,
                // so it is ready to replay next time
                onLeaveBack: () => { tl.timeScale(2).reverse(); },
                // Covers reloading while already at (or past) the footer
                onRefresh: (self) => {
                    if (self.progress > 0 && tl.progress() === 0 && !tl.isActive()) {
                        tl.timeScale(1).play();
                    }
                },
            });

            return () => {
                st.kill();
                tl.kill();
            };
        });

        // Reduced motion: nothing to set up, the footer is simply visible
        return () => mm.revert();
    }, []);

    return (
        <footer ref={rootRef} className="mt-16" aria-label="Site footer">
            <div
                data-panel
                className="bg-blue text-white overflow-hidden"
            >
                <div className="px-8 pt-12 sm:px-12">
                    {/* Link columns */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
                        {COLUMNS.map((col) => (
                            <div key={col.title} data-col>
                                <h3 className="mb-5 text-[15px] font-medium text-white">{col.title}</h3>
                                <ul className="grid gap-3">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className={linkClass}>{link.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div data-col>
                            <h3 className="mb-5 text-[15px] font-medium text-white">Contact</h3>
                            <ul className="grid gap-3">
                                <li><a href={`mailto:${EMAIL}`} className={linkClass}>{EMAIL}</a></li>
                                <li><a href={`tel:${PHONE.replace(/\s/g, "")}`} className={linkClass}>{PHONE}</a></li>
                                {onContact && (
                                    <li>
                                        <button type="button" onClick={onContact} className={`${linkClass} cursor-pointer`}>
                                            Start a project
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div data-line className="my-10 h-px bg-white/20" />

                    {/* Address, copyright, socials */}
                    <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                        <div className="grid gap-4">
                            <p data-bottom className="max-w-sm text-[13px] leading-relaxed text-white/85">{ADDRESS}</p>
                            <p data-bottom className="flex items-center gap-2 text-[13px] text-white/85">
                                <CodeXml size={16} strokeWidth={1.8} aria-hidden="true" />
                                © {nowYear} Invasion-Craft. All rights reserved.
                            </p>
                        </div>

                        <div data-bottom className="flex items-center gap-3">
                            {[
                                { label: "LinkedIn", icon: <LinkedinIcon /> },
                                { label: "X", icon: <XIcon /> },
                                { label: "Instagram", icon: <InstagramIcon /> },
                                { label: "Facebook", icon: <FacebookIcon /> },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href="#"
                                    aria-label={s.label}
                                    className="grid h-7 w-7 place-items-center rounded-full bg-white text-blue transition-transform duration-200 hover:-translate-y-0.5"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Giant wordmark, fading out toward the bottom edge */}
                <div
                    aria-hidden="true"
                    className="mt-10 select-none overflow-hidden"
                    style={{
                        WebkitMaskImage: "linear-gradient(to bottom, black 15%, transparent 92%)",
                        maskImage: "linear-gradient(to bottom, black 15%, transparent 92%)",
                    }}
                >
                    <div
                        data-wordmark
                        className="whitespace-nowrap px-2 text-center font-semibold text-white/20"
                        style={{ fontSize: "12.5cqw", lineHeight: 0.85, letterSpacing: "-0.04em" }}
                    >
                        Invasion-Craft
                    </div>
                </div>
            </div>
        </footer>
    );
}