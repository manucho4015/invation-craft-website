"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
    ArrowUpRight,
    ArrowRight,
    CodeXml,
    Menu,
    X,
    Globe2,
    Smartphone,
    Monitor,
    Layers3,
    ShieldCheck,
    Download,
} from "lucide-react";
import { Button } from "@/components/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/dialog";
import type { Project } from "../types/project";
import studio from "../public/technology-studio.jpg";
import team from "../public/team-studio.jpg";
import ProjectItem from "@/components/home/ProjectItem";
import Lifecycle from "@/components/home/LifeCycle";
import Footer from "@/components/layout/Footer";

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// PLACEHOLDER CONTENT: swap in your real projects and screenshots
const projects: Project[] = [
    { title: "Project One", heading: <>Project <span className="accent-text">One</span><br />Web platform</>, text: "Short description of what the product does, who it serves, and the outcome it delivered.", tags: ["Web", "Next.js", "Supabase"], image: team, imageAlt: "Project One interface", caption: "01 / Web platform" },
    { title: "Project Two", heading: <>Project <span className="accent-text">Two</span><br />Mobile app</>, text: "Short description of what the product does, who it serves, and the outcome it delivered.", tags: ["Mobile", "React Native", "Expo"], image: studio, imageAlt: "Project Two interface", caption: "02 / Mobile app" },
    { title: "Project Three", heading: <>Project <span className="accent-text">Three</span><br />Desktop app</>, text: "Short description of what the product does, who it serves, and the outcome it delivered.", tags: ["Desktop", "TypeScript"], image: team, imageAlt: "Project Three interface", caption: "03 / Desktop app" },
    { title: "Project Four", heading: <>Project <span className="accent-text">Four</span><br />SaaS dashboard</>, text: "Short description of what the product does, who it serves, and the outcome it delivered.", tags: ["Web", "SaaS", "Analytics"], image: studio, imageAlt: "Project Four interface", caption: "04 / SaaS dashboard" },
    { title: "Project Five", heading: <>Project <span className="accent-text">Five</span><br />Cross-platform suite</>, text: "Short description of what the product does, who it serves, and the outcome it delivered.", tags: ["Web", "Mobile", "Desktop"], image: studio, imageAlt: "Project Five interface", caption: "05 / Cross-platform suite" },
];

function Brand() {
    return (
        <a href="#home" className="brand" aria-label="Invasion-Craft home">
            <span className="brand-mark"><CodeXml size={26} strokeWidth={1.8} /></span>
            invasion-craft<span className="accent-text">.</span>
        </a>
    );
}

export default function HomeClient() {
    const [activeStep, setActiveStep] = useState<number | null>(4);
    const [menuOpen, setMenuOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [briefReady, setBriefReady] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const processRef = useRef<HTMLElement>(null);

    useIsoLayoutEffect(() => {
        const section = processRef.current;
        if (!section) return;

        const items = gsap.utils.toArray<HTMLElement>(".process-item", section);
        const last = items.length - 1;
        const STEP_MS = 1200; // one scroll gesture advances one slide; long enough to read the opened project

        const mm = gsap.matchMedia();

        // Reduced motion: no intro, show everything in its final state
        mm.add("(prefers-reduced-motion: reduce)", () => {
            gsap.set(items, { opacity: 1, y: 0 });
            setActiveIndex(last);
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.set(items, { opacity: 0, y: 70 });

            let shown = -1; // index of the last slide revealed
            let busyUntil = 0;
            let done = false;
            let observer: Observer | null = null;
            let st: ScrollTrigger | null = null; // declared first so callbacks can't hit it uninitialized

            const unlock = () => {
                observer?.kill();
                observer = null;
            };

            const finish = () => {
                if (done) return;
                done = true;
                unlock();
                st?.kill();
                setActiveIndex(last);
            };

            const next = () => {
                const now = performance.now();
                if (now < busyUntil || shown >= last) return;
                busyUntil = now + STEP_MS;
                shown += 1;

                // Opens the new slide and closes the previous one
                setActiveIndex(shown);

                gsap.to(items[shown], {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    overwrite: true,
                    onComplete: () => { if (shown === last) finish(); },
                });
            };

            const prev = () => {
                const now = performance.now();
                if (now < busyUntil) return;
                if (shown < 0) { unlock(); return; } // nothing revealed: let the user scroll back up
                busyUntil = now + STEP_MS;

                gsap.to(items[shown], { y: 70, opacity: 0, duration: 0.5, ease: "power2.in", overwrite: true });
                shown -= 1;

                // Re-open the slide before it (or close everything if none are left)
                setActiveIndex(shown >= 0 ? shown : null);
            };

            const lock = () => {
                if (done || observer) return;
                observer = Observer.create({
                    target: window,
                    type: "wheel,touch",
                    wheelSpeed: -1, // so onUp = scrolling down, onDown = scrolling up
                    tolerance: 10,
                    preventDefault: true,
                    allowClicks: true,
                    ignore: "[role='dialog']",
                    onUp: () => next(),
                    onDown: () => prev(),
                });
                gsap.to(window, { scrollTo: { y: section }, duration: 0.5, ease: "power2.out", overwrite: true });
            };

            st = ScrollTrigger.create({
                trigger: section,
                start: "top 40%",
                end: "bottom top",
                onEnter: lock,
                onLeaveBack: unlock,
                onLeave: () => {
                    // user jumped past (anchor link, keyboard, reload mid-page): skip the intro
                    if (!done) {
                        gsap.set(items, { opacity: 1, y: 0 });
                        finish();
                    }
                },
            });

            // If a callback already ran finish() during create(), the trigger wasn't killed yet
            if (done) st.kill();

            return () => {
                st?.kill();
                unlock();
            };
        });

        return () => mm.revert();
    }, []);

    function openContact() {
        setBriefReady(false);
        setContactOpen(true);
    }

    function downloadBrief(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const text = `INVASION-CRAFT — PROJECT BRIEF\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPlatform: ${data.get("platform")}\n\nProject idea\n${data.get("idea")}\n`;
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "invasion-craft-project-brief.txt";
        link.click();
        URL.revokeObjectURL(url);
        setBriefReady(true);
    }

    return (
        <>
            <main className="site-shell is-first" id="home">
                <section className="hero" aria-labelledby="hero-title">
                    <Image
                        className="hero-image"
                        src={studio}
                        alt="Modern technology studio with web, tablet, and desktop applications"
                        priority
                        fill
                        sizes="100vw"
                    />
                    <header className="navbar">
                        <Brand />
                        <nav aria-label="Main navigation" className={`nav-links ${menuOpen ? "is-open" : ""}`}>
                            <a href="#about" onClick={() => setMenuOpen(false)}>Who we are</a>
                            <a href="#services" onClick={() => setMenuOpen(false)}>What we build</a>
                            <a href="#process" onClick={() => setMenuOpen(false)}>Our process</a>
                            <a href="#why-us" onClick={() => setMenuOpen(false)}>Why choose us</a>
                        </nav>
                        <Button variant="craft" size="sm" className="nav-contact" onClick={openContact}>
                            Contact us <ArrowUpRight />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="menu-trigger"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X /> : <Menu />}
                        </Button>
                    </header>
                    <div className="hero-copy">
                        <div>
                            <div className="eyebrow">Ideas into impact</div>
                            <h1 id="hero-title">Invasion-Craft<br />Software, thoughtfully built.</h1>
                        </div>
                        <div>
                            <p>We bring your ideas to life through purposeful SaaS applications. Web, mobile, and desktop — crafted to work beautifully together.</p>
                            <Button variant="hero" onClick={openContact}>Start your project <ArrowUpRight /></Button>
                        </div>
                    </div>
                </section>

                <section id="about" className="about-section content-width" aria-labelledby="about-title">
                    <div className="platform-card" id="services">
                        <div className="eyebrow">One vision.<br />Every platform.</div>
                        <CodeXml className="craft-symbol" strokeWidth={1.1} />
                        <div className="platform-bottom">
                            <div>
                                <div className="platform-number">3<span>↗</span></div>
                                <p>Platforms. Endless possibilities.</p>
                            </div>
                            <div className="platform-names">Web apps<br />Mobile apps<br />Desktop apps</div>
                        </div>
                    </div>
                    <div className="about-card">
                        <div className="about-copy">
                            <h2 id="about-title">Who <span className="accent-text">We</span> Are</h2>
                            <p>We’re Invasion-Craft. A technology company turning ambitious ideas into software that makes a difference.</p>
                            <p>From the first conversation to the final release, we bring design and engineering together to craft SaaS applications around your business — and the people who use them.</p>
                        </div>
                        <Image
                            className="about-image"
                            src={team}
                            alt="Software engineers collaborating on code and app designs"
                            width={1024}
                            height={1024}
                        />
                    </div>
                </section>

                <section id="process" ref={processRef} className="process-section content-width" aria-labelledby="process-title">
                    <div className="section-heading">
                        <h2 id="process-title">Work We’re <span className="accent-text">Proud</span> Of<br />Selected Projects</h2>
                        <span className="section-tag">BUILT FOR WEB. MOBILE. DESKTOP.</span>
                    </div>
                    <div className="process-stack">
                        {projects.map((project, index) => (
                            <ProjectItem
                                key={project.title}
                                project={project}
                                index={index}
                                isOpen={activeIndex === index}
                                onToggle={() => setActiveIndex(activeIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Lifecycle />

            <section id="why-us" className="benefits-section content-width site-shell is-last" aria-labelledby="benefits-title">
                <h2 id="benefits-title">Why <span className="accent-text">Choose</span> Invasion-Craft</h2>
                <div className="benefits-grid">
                    <article className="benefit">
                        <Layers3 className="benefit-icon" />
                        <h3>End-to-End Solutions</h3>
                        <p>One team for your entire product journey. Strategy, design, development, and beyond.</p>
                    </article>
                    <article className="benefit">
                        <ShieldCheck className="benefit-icon" />
                        <h3>A Long-Term Partner</h3>
                        <p>Support that doesn’t stop at launch. We’re here as your product and business evolve.</p>
                    </article>
                    <article className="benefit benefit-tall">
                        <div>
                            <h3>One Experience.<br />Every Platform.</h3>
                            <div className="cross-platform">
                                <Globe2 size={42} strokeWidth={1} />
                                <Smartphone size={35} strokeWidth={1} />
                                <Monitor size={52} strokeWidth={1} />
                            </div>
                        </div>
                        <div>
                            <h3>Built Around You</h3>
                            <p>Not a one-size-fits-all solution. Purpose-built applications that reflect your vision, connect your workflows, and fit your world.</p>
                        </div>
                    </article>
                    <article className="benefit benefit-wide">
                        <Image src={team} width={1024} height={1024} alt="Thoughtful craftsmanship from our software team" />
                        <h3>Craft in Every Detail</h3>
                        <p>Thoughtful design meets reliable engineering. Software that feels as good as it performs.</p>
                    </article>
                </div>
            </section>

            <Footer onContact={openContact} />

            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Every great product starts with an idea.</DialogTitle>
                        <DialogDescription>Tell us what you have in mind.</DialogDescription>
                    </DialogHeader>
                    <form className="contact-fields" onSubmit={downloadBrief}>
                        <label>Your name<input name="name" autoComplete="name" placeholder="Full name" required /></label>
                        <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
                        <label>
                            Platform
                            <select name="platform" className="h-10 rounded-md border border-input bg-secondary px-3">
                                <option>Web application</option>
                                <option>Mobile application</option>
                                <option>Desktop application</option>
                                <option>Multiple platforms</option>
                            </select>
                        </label>
                        <label>Your project<textarea name="idea" placeholder="What would you like to build?" required /></label>
                        <p className="contact-note">
                            {briefReady
                                ? "Your project brief is ready and downloaded. No details have been sent."
                                : "Save your project brief to share with our team. This form does not send an enquiry yet."}
                        </p>
                        <Button variant="craft" type="submit">
                            <Download />
                            {briefReady ? "Download again" : "Download project brief"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}