"use client";

import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, MeshTransmissionMaterial, OrbitControls, RoundedBox } from "@react-three/drei";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import {
  Bath,
  BadgeCheck,
  Hammer,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { Group, Mesh } from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (name: string) => `${basePath}/assets/${name}`;

const services = [
  { icon: Bath, title: "Bathroom renovations", body: "Rip-out, fitting, tiling, baths, showers, toilets, sinks, basins and finish work." },
  { icon: Wrench, title: "Plumbing repairs", body: "Leaks, waste pipes, resealing, taps, fixtures and practical problem-solving around the home." },
  { icon: Hammer, title: "Start-to-finish work", body: "Neil lists bathrooms from start to finish, including electrics and plastering where needed." },
  { icon: ShowerHead, title: "Fixtures and installs", body: "Showers, baths, kitchen and basin taps, outside taps, radiators, washing machines and dishwashers." },
];

const gallery = [
  ["finished-bathroom.jpg", "Finished bathroom renovation in Leeds"],
  ["van.jpg", "N.A.W. Bathrooms branded van"],
  ["work-person-1.jpg", "Bathroom work underway"],
  ["stripout-work.jpg", "Strip-out and preparation work"],
  ["work-person-2.jpg", "Plumbing work in progress"],
];

function FacebookIcon({ size = 21 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 8.3V6.9c0-.7.2-1.1 1.2-1.1h1.7V3.1c-.8-.1-1.6-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v1.1H7.7v3h2.7V21H14v-9.7h2.6l.4-3H14Z" />
    </svg>
  );
}

function BathroomScene() {
  const rig = useRef<Group>(null);
  const tap = useRef<Mesh>(null);
  const water = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rig.current) rig.current.rotation.y = Math.sin(t * 0.35) * 0.12;
    if (tap.current) tap.current.rotation.z = Math.sin(t * 0.8) * 0.08;
    if (water.current) water.current.scale.y = 1 + Math.sin(t * 1.8) * 0.18;
    state.camera.position.x = Math.sin(t * 0.2) * 0.22;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <spotLight position={[2.5, 4.5, 3]} angle={0.38} penumbra={0.8} intensity={6} color="#f2c46d" />
      <pointLight position={[-3, 1.8, 2]} intensity={3} color="#9ee8ff" />
      <Environment preset="apartment" />
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={rig} position={[0, -0.3, 0]}>
          <RoundedBox args={[4.4, 0.28, 2.4]} radius={0.16} position={[0, -0.72, 0]}>
            <meshStandardMaterial color="#f4eee3" metalness={0.04} roughness={0.5} />
          </RoundedBox>
          <RoundedBox args={[3.2, 0.58, 1.5]} radius={0.22} position={[0, -0.38, 0]}>
            <meshStandardMaterial color="#f9f4eb" metalness={0.08} roughness={0.34} />
          </RoundedBox>
          <RoundedBox args={[2.4, 0.26, 0.16]} radius={0.08} position={[0, 0.18, -0.68]} ref={tap}>
            <meshStandardMaterial color="#c8a35d" metalness={0.75} roughness={0.22} />
          </RoundedBox>
          <mesh ref={water} rotation={[0, 0, 0]} position={[0, -0.08, -0.34]}>
            <cylinderGeometry args={[0.025, 0.025, 1.2, 28]} />
            <MeshTransmissionMaterial color="#a9e9ff" thickness={0.4} transmission={0.8} roughness={0.1} transparent opacity={0.65} />
          </mesh>
        </group>
      </Float>
      <ContactShadows position={[0, -1.08, 0]} opacity={0.45} scale={7} blur={2.8} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.25} />
    </>
  );
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "260px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.3,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, suffix, value]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function Page() {
  const main = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".service-rise", {
        y: 42,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".services-grid", start: "top 76%" },
      });
      gsap.to(".gallery-track", {
        xPercent: -16,
        ease: "none",
        scrollTrigger: { trigger: ".gallery-stage", start: "top 78%", end: "bottom top", scrub: 0.65 },
      });
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={main} className="min-h-screen overflow-hidden bg-[#080909] text-white">
      <motion.div style={{ y: glowY }} className="pointer-events-none fixed left-1/2 top-0 z-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080909]/76 px-4 py-3 backdrop-blur-2xl sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <Image src={asset("logo.jpg")} alt="N.A.W. Plumbing logo" width={46} height={46} className="h-11 w-11 rounded-xl object-cover" />
            <span>
              <strong className="block text-sm leading-none sm:text-base">N.A.W. Bathrooms</strong>
              <small className="mt-1 block text-xs text-white/56">Leeds bathroom renovations</small>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-white/62 lg:flex">
            {["Services", "Proof", "Gallery", "Location", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-red-300">{item}</a>
            ))}
          </nav>
          <a href="tel:07714444475">
            <Button asChild variant="brass" className="min-h-11 rounded-xl px-4 shadow-[0_0_28px_rgba(185,25,36,0.3)]">
              <span><Phone size={18} /><span className="hidden sm:inline">07714 444475</span></span>
            </Button>
          </a>
        </div>
      </header>

      <section id="top" className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-24 pt-28 sm:px-8 lg:grid-cols-[.92fr_1.08fr]">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
          <p className="mb-5 w-fit rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-red-200">Leeds bathroom renovations</p>
          <h1 className="max-w-3xl text-[clamp(3.2rem,8vw,7.2rem)] font-black leading-[.86] tracking-normal">Bathroom work that feels safe to start.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/66 sm:text-xl">
            Start-to-finish bathroom renovation, plumbing and tiling from a Leeds tradesman with a clear quote path.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:01132606275"><Button asChild variant="brass" className="min-h-12 rounded-xl"><span><Phone size={18} />Call 0113 2606275</span></Button></a>
            <a href="mailto:NAW.Bathrooms@btinternet.com"><Button asChild variant="secondary" className="min-h-12 rounded-xl border-white/16 bg-white/6 text-white hover:bg-white/12"><span><Mail size={18} />Email quote request</span></Button></a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 max-sm:grid-cols-1">
            <Card className="border-white/10 bg-white/[.055]"><CardContent className="p-5"><strong className="block text-3xl text-red-200"><Counter value={20} suffix="+" /></strong><span className="text-sm text-white/58">years renovating bathrooms</span></CardContent></Card>
            <Card className="border-white/10 bg-white/[.055]"><CardContent className="p-5"><strong className="block text-3xl text-red-200">LS15</strong><span className="text-sm text-white/58">Leeds base from Nextdoor</span></CardContent></Card>
            <Card className="border-white/10 bg-white/[.055]"><CardContent className="p-5"><strong className="block text-3xl text-red-200">Free</strong><span className="text-sm text-white/58">no-obligation quotes</span></CardContent></Card>
          </div>
        </motion.div>
        <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl"><Image src={asset("van.jpg")} alt="N.A.W. Bathrooms van" width={900} height={700} className="h-64 w-full object-cover" priority /></div>
            <div className="scene-vignette h-80 overflow-hidden rounded-3xl border border-white/10 bg-white/6">
              <Canvas camera={{ position: [0, 1.1, 5], fov: 42 }}><BathroomScene /></Canvas>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl">
            <Image src={asset("finished-bathroom.jpg")} alt="Finished bathroom renovation" width={900} height={1200} className="h-full min-h-[38rem] w-full object-cover" priority />
          </div>
        </div>
      </section>

      <section id="services" className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-red-200">Services</p>
          <h2 className="text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-none">Bathroom renovation services in one place.</h2>
        </div>
        <div className="services-grid grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} className="service-rise border-white/10 bg-white/[.055] text-white">
              <CardContent className="p-7">
                <service.icon className="mb-7 text-red-200" size={34} />
                <h3 className="text-2xl font-black">{service.title}</h3>
                <p className="mt-3 leading-7 text-white/62">{service.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="proof" className="relative z-10 bg-[#111614] px-4 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-red-200">Trust path</p>
            <h2 className="text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-none">Clear reasons to call Neil first.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [BadgeCheck, "20+ years", "Bathroom renovation experience for Leeds homeowners, from planning through to finish."],
              [ShieldCheck, "Real job photos", "Finished bathroom and work-underway photos show the kind of practical work N.A.W. handles."],
              [Send, "Free quote path", "Call, email or Facebook message with the job details and photos to request a no-obligation quote."],
            ].map(([Icon, title, body]) => (
              <Card key={String(title)} className="border-white/10 bg-white/[.055] text-white">
                <CardContent className="p-6">
                  <Icon className="mb-5 text-red-200" size={30} />
                  <h3 className="text-xl font-black">{title as string}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{body as string}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-stage relative z-10 mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-8">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-red-200">Project photos</p>
            <h2 className="max-w-3xl text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-none">Finished bathroom, branded van and work in progress.</h2>
          </div>
        </div>
        <div className="gallery-track flex w-[122%] gap-4 max-md:w-full max-md:flex-col">
          {gallery.map(([file, alt], i) => (
            <div key={file} className={`overflow-hidden rounded-3xl border border-white/10 bg-white/6 ${i === 0 ? "w-[34%]" : "w-[22%]"} max-md:w-full`}>
              <Image src={asset(file)} alt={alt} width={900} height={1100} className="h-[28rem] w-full object-cover max-md:h-auto" />
            </div>
          ))}
        </div>
      </section>

      <section id="location" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-24 sm:px-8 lg:grid-cols-[.82fr_1fr]">
        <div className="rounded-3xl bg-[#385947] p-8 text-white lg:p-12">
          <p className="mb-3 text-xs font-black uppercase tracking-[.18em] text-amber-200">Leeds local service</p>
          <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-black leading-none">N.A.W. Bathrooms near Penda’s Way, Leeds</h2>
          <p className="mt-6 leading-8 text-white/72">Based around LS15, N.A.W. handles bathroom renovation, plumbing and tiling work across Leeds.</p>
          <div className="mt-7 grid gap-3 text-sm font-black">
            <a href="tel:01132606275">0113 2606275</a>
            <a href="tel:07714444475">07714 444475</a>
            <a href="mailto:NAW.Bathrooms@btinternet.com">NAW.Bathrooms@btinternet.com</a>
          </div>
          <a className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-black text-[#111614]" href="https://www.google.com/maps/search/?api=1&query=N.A.W.%20Bathrooms%20Penda%27s%20Way%20Leeds%20LS15%208HX"><MapPin size={18} />Open Google Maps</a>
        </div>
        <div className="relative min-h-[28rem] overflow-hidden rounded-3xl border border-white/10 bg-[#e7e2d8] shadow-2xl">
          <iframe title="Map for N.A.W. Bathrooms in Leeds" referrerPolicy="no-referrer-when-downgrade" width="600" height="450" src="https://maps.google.com/maps?q=N.A.W.%20Bathrooms%20Penda%27s%20Way%20Leeds%20LS15%208HX&z=14&output=embed" className="absolute inset-0 h-full w-full border-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(0,0,0,.08))]" />
        </div>
      </section>

      <footer id="contact" className="relative z-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 bg-black px-4 py-8 sm:px-8">
        <div>
          <strong>N.A.W. Bathrooms</strong>
          <p className="mt-1 text-sm text-white/58">Bathroom renovations, plumbing and tiling in Leeds.</p>
        </div>
        <div className="flex gap-3">
          {[
            [Phone, "tel:07714444475", "Call"],
            [Mail, "mailto:NAW.Bathrooms@btinternet.com", "Email"],
            [FacebookIcon, "https://www.facebook.com/people/NAW-Bathrooms/100054213141467/", "Facebook"],
            [MapPin, "https://www.google.com/maps/search/?api=1&query=N.A.W.%20Bathrooms%20Penda%27s%20Way%20Leeds%20LS15%208HX", "Google Maps"],
          ].map(([Icon, href, label]) => (
            <a key={label as string} href={href as string} aria-label={label as string} className="grid h-11 w-11 place-items-center rounded-full bg-white text-black">
              <Icon size={21} />
            </a>
          ))}
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Plumber",
        name: "N.A.W. Bathrooms",
        alternateName: "N.A.W. Plumbing & Tiling specialising in Bathroom Renovations",
        url: "https://deanooooooooo.github.io/naw-bathrooms-premium-site/",
        image: "https://deanooooooooo.github.io/naw-bathrooms-premium-site/assets/van.jpg",
        telephone: ["0113 2606275", "07714444475"],
        email: "NAW.Bathrooms@btinternet.com",
        address: { "@type": "PostalAddress", streetAddress: "Penda's Way", addressLocality: "Leeds", postalCode: "LS15 8HX", addressCountry: "GB" },
        geo: { "@type": "GeoCoordinates", latitude: 53.811255, longitude: -1.43877 },
        areaServed: "Leeds",
        sameAs: ["https://www.facebook.com/people/NAW-Bathrooms/100054213141467/", "https://nextdoor.co.uk/pages/naw-plumbing-tiling-specialising-in-bathroom-renovations-leeds-gb-eng/"],
      }) }} />
    </main>
  );
}
