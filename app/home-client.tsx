"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import {
    ArrowUpRight,
    ArrowRight,
    CodeXml,
    Menu,
    X,
    Plus,
    Minus,
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
import studio from "../public/technology-studio.jpg";
import team from "../public/team-studio.jpg";

const steps = [
    { title: "Discovery & strategy", heading: <>A clear vision.<br /><span className="accent-text">A stronger foundation.</span></>, text: "Great software starts with the right questions. We explore your goals, your users, and your business to shape a focused product strategy.", image: team, caption: "01 / Understand the possibilities" },
    { title: "Experience & interface design", heading: <>Complex ideas.<br /><span className="accent-text">Intuitive experiences.</span></>, text: "We turn your vision into thoughtful user journeys and clear interfaces. Every interaction is designed to feel natural, on every screen.", image: team, caption: "02 / Designed around people" },
    { title: "Development & integration", heading: <>Built with care.<br /><span className="accent-text">Ready to connect.</span></>, text: "From web platforms to mobile and desktop apps, we craft dependable software with a connected architecture and the integrations your business needs.", image: studio, caption: "03 / Ideas become applications" },
    { title: "Testing & launch", heading: <>Every detail tested.<br /><span className="accent-text">Every launch considered.</span></>, text: "We put performance, usability, and reliability through their paces. Then we bring your product to life with a carefully planned launch.", image: studio, caption: "04 / Ready for the real world" },
    { title: "Ongoing support & evolution", heading: <>Ongoing <span className="accent-text">Support</span><br />and Evolution</>, text: "Our commitment goes beyond launch. We keep your applications running smoothly, adapt to your users’ needs, and help your software grow alongside your business.", image: studio, caption: "05 / Built for what comes next" },
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
        <main className="site-shell" id="home">
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

            <section id="process" className="process-section content-width" aria-labelledby="process-title">
                <div className="section-heading">
                    <h2 id="process-title">How We <span className="accent-text">Simplify</span> Your<br />Software Journey</h2>
                    <span className="section-tag">FROM THE FIRST IDEA. TO WHAT’S NEXT.</span>
                </div>
                <div className="process-stack">
                    {steps.map((step, index) => (
                        <div className="process-item" key={step.title}>
                            <Button
                                variant="ghost"
                                className="process-toggle"
                                onClick={() => setActiveStep(activeStep === index ? null : index)}
                                aria-expanded={activeStep === index}
                                aria-controls={`step-${index}`}
                            >
                                <span className="process-label"><span>0{index + 1}</span><span>{step.title}</span></span>
                                {activeStep === index ? <Minus size={15} /> : <Plus size={15} />}
                            </Button>
                            {activeStep === index && (
                                <div className="process-panel" id={`step-${index}`}>
                                    <div className="process-copy">
                                        <span className="process-number">{index + 1}</span>
                                        <h3>{step.heading}</h3>
                                        <p>{step.text}</p>
                                    </div>
                                    <div className="process-photo">
                                        <Image
                                            src={step.image}
                                            alt={index < 2 ? "Collaborative software design and planning" : "Connected software applications in a modern studio"}
                                            width={1024}
                                            height={1024}
                                        />
                                        <span className="photo-caption">{step.caption}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section id="why-us" className="benefits-section content-width" aria-labelledby="benefits-title">
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

            <footer className="footer content-width">
                <Brand />
                <Suspense fallback={<span className="footer-note">© ... Invasion-Craft. Crafted for what’s next.</span>}>
                    <span className="footer-note">© {new Date().getFullYear()} Invasion-Craft. Crafted for what’s next.</span>
                </Suspense>
                <Button variant="link" size="sm" onClick={openContact}>
                    Let’s build something <ArrowRight />
                </Button>
            </footer>

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
        </main>
    );
}