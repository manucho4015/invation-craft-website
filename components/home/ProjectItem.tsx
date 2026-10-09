import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Button } from "@/components/button";
import type { Project } from "../../types/project";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProjectItem({
    project,
    index,
    isOpen,
    onToggle,
}: {
    project: Project;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const vLineRef = useRef<SVGLineElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const q = gsap.utils.selector(wrap);

        tlRef.current?.kill();

        if (isOpen) {
            const tl = gsap.timeline({ onComplete: () => ScrollTrigger.refresh() });
            tl.set(wrap, { visibility: "visible" })
                .to(wrap, { height: "auto", duration: 0.7, ease: "power3.inOut" })
                .fromTo(
                    q(".process-copy > *"),
                    { y: 28, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.09 },
                    0.2
                )
                .fromTo(
                    q(".process-photo"),
                    { clipPath: "inset(100% 0% 0% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut", clearProps: "clipPath" },
                    0.15
                )
                .fromTo(
                    q(".process-photo img"),
                    { scale: 1.3 },
                    { scale: 1, duration: 1.2, ease: "power3.out" },
                    0.15
                )
                .fromTo(
                    q(".photo-caption"),
                    { y: 14, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
                    0.85
                );
            tlRef.current = tl;
        } else {
            tlRef.current = gsap
                .timeline({ onComplete: () => { gsap.set(wrap, { visibility: "hidden" }); ScrollTrigger.refresh(); } })
                .to(wrap, { height: 0, duration: 0.5, ease: "power3.inOut" });
        }

        gsap.to(vLineRef.current, {
            rotation: isOpen ? 90 : 0,
            svgOrigin: "7.5 7.5",
            duration: 0.4,
            ease: "power2.inOut",
        });

        return () => { tlRef.current?.kill(); };
    }, [isOpen]);

    return (
        // opacity:0 is the pre-intro state; the section's scroll animation reveals it
        <div className="process-item" style={{ opacity: 0 }}>
            <Button
                variant="ghost"
                className="process-toggle flex w-full items-center justify-between gap-4 text-left"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`project-${index}`}
            >
                <span className="process-label"><span>0{index + 1}</span><span>{project.title}</span></span>
                <svg
                    className="ml-auto shrink-0"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                >
                    <line x1="1.5" y1="7.5" x2="13.5" y2="7.5" />
                    <line ref={vLineRef} x1="7.5" y1="1.5" x2="7.5" y2="13.5" />
                </svg>
            </Button>

            <div
                ref={wrapRef}
                id={`project-${index}`}
                aria-hidden={!isOpen}
                style={{ height: 0, overflow: "hidden", visibility: "hidden" }}
            >
                <div className="process-panel">
                    <div className="process-copy">
                        <span className="process-number">{index + 1}</span>
                        <h3>{project.heading}</h3>
                        <p>{project.text}</p>
                        <div className="project-tags">
                            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                    </div>
                    <div className="process-photo">
                        <Image src={project.image} alt={project.imageAlt} width={1024} height={1024} />
                        <span className="photo-caption">{project.caption}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}