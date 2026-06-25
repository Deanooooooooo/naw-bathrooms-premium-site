"use client";

import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import {
  Bath,
  Check,
  ChevronDown,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShowerHead,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (name: string) => `${basePath}/assets/${name}`;

const services = [
  {
    icon: Bath,
    title: "Full bathroom renovation",
    body: "Rip-out, fitting, tiling and finish work for a bathroom that is planned from the messy first day through to the final clean edge.",
    detail: ["Strip-out and prep", "Baths, toilets, basins", "Tiling and finishing"],
  },
  {
    icon: ShowerHead,
    title: "Showers, baths and fixtures",
    body: "Practical installs and replacements for showers, baths, taps, radiators and everyday plumbing fixtures.",
    detail: ["Showers and screens", "Kitchen and basin taps", "Radiators and outside taps"],
  },
  {
    icon: Wrench,
    title: "Leaks and plumbing repairs",
    body: "Leaks, resealing, waste pipes and the awkward jobs that need a local tradesman who can diagnose the problem properly.",
    detail: ["Waste pipes and leaks", "Resealing", "Washing machines and dishwashers"],
  },
];

const quoteOptions = [
  "Full renovation",
  "Shower or bath install",
  "Tiling or flooring",
  "Leak or repair",
  "Radiator or taps",
  "Free quote visit",
];

const photos = [
  { file: "finished-bathroom.jpg", label: "Finished bathroom", type: "finish" },
  { file: "stripout-work.jpg", label: "Rip-out and prep", type: "work" },
  { file: "work-person-1.jpg", label: "Plumbing work", type: "work" },
  { file: "work-person-2.jpg", label: "On-site fitting", type: "work" },
  { file: "van.jpg", label: "Local van", type: "trust" },
];

function BathroomScene() {
  const rig = useRef<Group>(null);
  const tap = useRef<Mesh>(null);
  const water = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rig.current) rig.current.rotation.y = Math.sin(t * 0.42) * 0.18;
    if (tap.current) tap.current.rotation.z = Math.sin(t * 0.7) * 0.08;
    if (water.current) water.current.scale.y = 1 + Math.sin(t * 2.2) * 0.2;
    state.camera.position.x = Math.sin(t * 0.22) * 0.25;
    state.camera.lookAt(0, -0.05, 0);
  });

  return (
    <>
      <ambientLight intensity={0.95} />
      <spotLight position={[2.6, 4.2, 3]} angle={0.42} penumbra={0.8} intensity={6.6} color="#f3c46f" />
      <pointLight position={[-2.8, 2, 2.6]} intensity={3.6} color="#8fd8ff" />
      <Environment preset="apartment" />
      <Float speed={1.15} rotationIntensity={0.13} floatIntensity={0.28}>
        <group ref={rig} position={[0, -0.28, 0]}>
          <RoundedBox args={[4.6, 0.26, 2.5]} radius={0.15} position={[0, -0.74, 0]}>
            <meshStandardMaterial color="#f7efe1" metalness={0.04} roughness={0.52} />
          </RoundedBox>
          <RoundedBox args={[3.2, 0.58, 1.45]} radius={0.22} position={[0, -0.4, 0]}>
            <meshStandardMaterial color="#fffaf0" metalness={0.08} roughness={0.32} />
          </RoundedBox>
          <RoundedBox args={[2.4, 0.26, 0.16]} radius={0.08} position={[0, 0.2, -0.68]} ref={tap}>
            <meshStandardMaterial color="#c88f36" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          <mesh ref={water} position={[0, -0.08, -0.34]}>
            <cylinderGeometry args={[0.026, 0.026, 1.18, 28]} />
            <MeshTransmissionMaterial color="#a9e9ff" thickness={0.4} transmission={0.84} roughness={0.08} transparent opacity={0.68} />
          </mesh>
        </group>
      </Float>
      <ContactShadows position={[0, -1.08, 0]} opacity={0.42} scale={7} blur={2.8} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.32} />
    </>
  );
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "220px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.15,
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
  const [activeService, setActiveService] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["Full renovation", "Free quote visit"]);
  const [beforeAmount, setBeforeAmount] = useState(48);
  const [photoFilter, setPhotoFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState(0);
  const { scrollYProgress } = useScroll();
  const rail = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const filteredPhotos = useMemo(
    () => photos.filter((photo) => photoFilter === "all" || photo.type === photoFilter),
    [photoFilter],
  );

  const quoteSummary = selectedOptions.length
    ? selectedOptions.join(", ")
    : "Tell Neil what needs doing";

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
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
      gsap.from(".lift-card", {
        y: 44,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".service-shell", start: "top 74%" },
      });
      gsap.from(".media-card", {
        y: 36,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: ".media-grid", start: "top 76%" },
      });
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={main} className="min-h-screen overflow-hidden bg-[#f7f3ea] text-[#17211c]">
      <motion.div style={{ scaleX: rail }} className="fixed left-0 top-0 z-[70] h-1 w-full origin-left bg-[#c2332d]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f7f3ea]/88 px-4 py-3 backdrop-blur-2xl sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <Image src={asset("logo.jpg")} alt="N.A.W. Plumbing logo" width={48} height={48} className="h-11 w-11 rounded-lg border border-black/10 object-cover" />
            <span>
              <strong className="block text-sm leading-none sm:text-base">N.A.W. Bathrooms</strong>
              <small className="mt-1 block text-xs text-black/56">Leeds bathroom renovations</small>
            </span>
          </a>
          <nav className="hidden items-center gap-5 text-sm font-bold text-black/62 lg:flex">
            {["Services", "Planner", "Proof", "Gallery", "Location"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-[#c2332d]">{item}</a>
            ))}
          </nav>
          <a href="tel:07714444475">
            <Button asChild variant="brass" className="min-h-11 rounded-lg px-4 shadow-[0_14px_34px_rgba(194,51,45,0.22)]">
              <span><Phone size={18} /><span className="hidden sm:inline">07714 444475</span></span>
            </Button>
          </a>
        </div>
      </header>

      <section id="top" className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-28 sm:px-8 lg:grid-cols-[.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-5 w-fit rounded-full border border-[#c2332d]/25 bg-white px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-[#a72f2a] shadow-sm">Leeds bathroom renovations</p>
          <h1 className="max-w-3xl text-[clamp(3.1rem,7.5vw,6.7rem)] font-black leading-[.9] tracking-normal">
            Bathrooms planned, stripped and finished properly.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-black/66 sm:text-xl">
            Start-to-finish bathroom renovation, plumbing and tiling from N.A.W. Bathrooms, with a direct phone/email quote path and local Leeds proof.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:01132606275"><Button asChild variant="brass" className="min-h-12 rounded-lg"><span><Phone size={18} />Call 0113 2606275</span></Button></a>
            <a href="#planner"><Button asChild variant="secondary" className="min-h-12 rounded-lg border-black/15 bg-white text-[#17211c] hover:bg-[#fff8ed]"><span><Ruler size={18} />Plan the job</span></Button></a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 max-sm:grid-cols-1">
            <Card className="border-black/10 bg-white shadow-premium"><CardContent className="p-5"><strong className="block text-3xl text-[#c2332d]"><Counter value={20} suffix="+" /></strong><span className="text-sm text-black/58">years renovating bathrooms</span></CardContent></Card>
            <Card className="border-black/10 bg-white shadow-premium"><CardContent className="p-5"><strong className="block text-3xl text-[#365f35]">LS15</strong><span className="text-sm text-black/58">Leeds base from Nextdoor</span></CardContent></Card>
            <Card className="border-black/10 bg-white shadow-premium"><CardContent className="p-5"><strong className="block text-3xl text-[#2f637a]">Free</strong><span className="text-sm text-black/58">no-obligation quote route</span></CardContent></Card>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[.92fr_1.08fr]">
          <div className="grid gap-4">
            <motion.div whileHover={{ y: -6 }} className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-premium">
              <Image src={asset("van.jpg")} alt="N.A.W. Bathrooms van" width={900} height={700} className="h-64 w-full object-cover" priority />
            </motion.div>
            <div className="scene-vignette h-80 overflow-hidden rounded-2xl border border-black/10 bg-[#17211c] shadow-premium">
              <Canvas camera={{ position: [0, 1.1, 5], fov: 42 }}><BathroomScene /></Canvas>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.015 }} className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-premium">
            <Image src={asset("finished-bathroom.jpg")} alt="Finished bathroom renovation" width={900} height={1200} className="h-full min-h-[38rem] w-full object-cover" priority />
          </motion.div>
        </div>
      </section>

      <section id="services" className="service-shell relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[.75fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#a72f2a]">Services</p>
            <h2 className="text-[clamp(2.35rem,5vw,4.6rem)] font-black leading-none">Tap a service to see the job path.</h2>
          </div>
          <p className="max-w-xl self-end text-lg leading-8 text-black/62">
            The premium version should help a homeowner understand the work before they call. These controls make the page feel built, not pasted together.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[.86fr_1.14fr]">
          <div className="grid gap-3">
            {services.map((service, index) => (
              <button
                key={service.title}
                onClick={() => setActiveService(index)}
                className={`lift-card flex min-h-24 items-center gap-4 rounded-2xl border p-5 text-left transition ${
                  activeService === index ? "border-[#c2332d] bg-white shadow-premium" : "border-black/10 bg-white/65 hover:bg-white"
                }`}
              >
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${activeService === index ? "bg-[#c2332d] text-white" : "bg-[#17211c] text-white"}`}>
                  <service.icon size={24} />
                </span>
                <span>
                  <strong className="block text-xl">{service.title}</strong>
                  <small className="mt-1 block text-sm leading-6 text-black/56">{service.body}</small>
                </span>
              </button>
            ))}
          </div>
          <Card className="lift-card overflow-hidden border-black/10 bg-[#17211c] text-white shadow-premium">
            <CardContent className="grid gap-6 p-0 md:grid-cols-[.95fr_1.05fr]">
              <div className="p-7 lg:p-9">
                <Sparkles className="mb-6 text-[#f3c46f]" size={34} />
                <h3 className="text-3xl font-black">{services[activeService].title}</h3>
                <p className="mt-4 leading-8 text-white/68">{services[activeService].body}</p>
                <div className="mt-7 grid gap-3">
                  {services[activeService].detail.map((item) => (
                    <span key={item} className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3 text-sm font-bold">
                      <Check className="text-[#f3c46f]" size={18} /> {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="min-h-[24rem] overflow-hidden">
                <Image src={asset(activeService === 0 ? "finished-bathroom.jpg" : activeService === 1 ? "work-person-1.jpg" : "work-person-2.jpg")} alt={services[activeService].title} width={900} height={900} className="h-full w-full object-cover" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="planner" className="relative z-10 bg-[#e8eadb] px-4 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#a72f2a]">Interactive quote planner</p>
            <h2 className="text-[clamp(2.35rem,5vw,4.6rem)] font-black leading-none">Build the call brief before you ring.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-black/62">
              Select the parts of the job, then call or email with the exact brief. It is simple, useful interaction tied to conversion.
            </p>
          </div>
          <Card className="border-black/10 bg-white shadow-premium">
            <CardContent className="p-6 lg:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {quoteOptions.map((option) => {
                  const checked = selectedOptions.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => setSelectedOptions((current) => checked ? current.filter((item) => item !== option) : [...current, option])}
                      className={`min-h-14 rounded-xl border px-4 text-left font-bold transition ${checked ? "border-[#365f35] bg-[#365f35] text-white" : "border-black/10 bg-[#f7f3ea] hover:bg-white"}`}
                    >
                      <span className="flex items-center gap-3"><Check size={18} className={checked ? "opacity-100" : "opacity-20"} />{option}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-2xl bg-[#17211c] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[.16em] text-[#f3c46f]">Your quote brief</p>
                <p className="mt-3 text-xl font-black">{quoteSummary}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={`mailto:NAW.Bathrooms@btinternet.com?subject=N.A.W.%20Bathrooms%20quote%20request&body=Hi%20Neil%2C%0A%0AI%27m%20asking%20about%3A%20${encodeURIComponent(quoteSummary)}%0A%0AMy%20address%2Farea%3A%0APhotos%20attached%3A%0A`}>
                    <Button asChild variant="brass" className="min-h-11 rounded-lg"><span><Mail size={18} />Email this brief</span></Button>
                  </a>
                  <a href="tel:07714444475">
                    <Button asChild variant="secondary" className="min-h-11 rounded-lg border-white/20 bg-white/10 text-white hover:bg-white/16"><span><Phone size={18} />Call Neil</span></Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="proof" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#a72f2a]">Before and after</p>
            <h2 className="text-[clamp(2.35rem,5vw,4.6rem)] font-black leading-none">Drag from strip-out to finished bathroom.</h2>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-premium">
            <div className="relative h-[30rem] overflow-hidden rounded-xl bg-black">
              <Image src={asset("finished-bathroom.jpg")} alt="Finished bathroom renovation" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${beforeAmount}%` }}>
                <Image src={asset("stripout-work.jpg")} alt="Bathroom strip-out work" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
              </div>
              <div className="absolute inset-y-0 w-1 bg-white shadow-2xl" style={{ left: `${beforeAmount}%` }} />
              <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-2 text-xs font-black uppercase tracking-[.12em] text-white">Work stage</span>
              <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[.12em] text-[#17211c]">Finished</span>
            </div>
            <input
              aria-label="Compare work stage and finished bathroom"
              className="mt-5 w-full accent-[#c2332d]"
              min={12}
              max={88}
              type="range"
              value={beforeAmount}
              onChange={(event) => setBeforeAmount(Number(event.target.value))}
            />
          </div>
        </div>
      </section>

      <section id="gallery" className="relative z-10 bg-[#17211c] px-4 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#f3c46f]">Project media</p>
              <h2 className="max-w-3xl text-[clamp(2.35rem,5vw,4.6rem)] font-black leading-none">Filter the real job and trust photos.</h2>
            </div>
            <div className="flex flex-wrap gap-2 rounded-xl bg-white/8 p-2">
              {["all", "finish", "work", "trust"].map((filter) => (
                <button key={filter} onClick={() => setPhotoFilter(filter)} className={`rounded-lg px-4 py-2 text-sm font-black capitalize transition ${photoFilter === filter ? "bg-white text-[#17211c]" : "text-white/70 hover:bg-white/10"}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="media-grid grid auto-rows-[16rem] grid-cols-1 gap-4 md:grid-cols-4">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                layout
                key={photo.file}
                whileHover={{ y: -5 }}
                className={`media-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/8 ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <Image src={asset(photo.file)} alt={photo.label} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 to-transparent p-4">
                  <span className="text-sm font-black">{photo.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#a72f2a]">Call questions</p>
            <h2 className="text-[clamp(2.35rem,5vw,4.6rem)] font-black leading-none">Open the answers homeowners need first.</h2>
          </div>
          <div className="grid gap-3">
            {[
              ["Can N.A.W. handle the full bathroom job?", "The public profile lists bathroom renovations from start to finish, plus plumbing, tiling, electrics and plastering where needed."],
              ["What should I send for a quote?", "Send the room, the job type, rough location, any photos, and whether you need a full renovation, fixture install or repair."],
              ["Where is N.A.W. based?", "N.A.W. is shown around Penda's Way / LS15 in Leeds, with phone, mobile, email, Facebook and Nextdoor contact routes."],
            ].map(([question, answer], index) => (
              <Card key={question} className="border-black/10 bg-white shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                  <span className="text-lg font-black">{question}</span>
                  <ChevronDown className={`shrink-0 transition ${openFaq === index ? "rotate-180" : ""}`} size={20} />
                </button>
                {openFaq === index && <CardContent className="px-5 pb-5 pt-0 leading-7 text-black/62">{answer}</CardContent>}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="relative z-10 mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-8 lg:grid-cols-[.82fr_1fr]">
        <div className="rounded-2xl bg-[#365f35] p-8 text-white shadow-premium lg:p-12">
          <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#f3c46f]">Leeds local service</p>
          <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-black leading-none">N.A.W. Bathrooms near Penda’s Way, Leeds</h2>
          <p className="mt-6 leading-8 text-white/74">Based around LS15, N.A.W. handles bathroom renovation, plumbing and tiling work across Leeds.</p>
          <div className="mt-7 grid gap-3 text-sm font-black">
            <a href="tel:01132606275">0113 2606275</a>
            <a href="tel:07714444475">07714 444475</a>
            <a href="mailto:NAW.Bathrooms@btinternet.com">NAW.Bathrooms@btinternet.com</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-5 font-black text-[#17211c]" href="https://www.google.com/maps/search/?api=1&query=N.A.W.%20Bathrooms%20Penda%27s%20Way%20Leeds%20LS15%208HX"><MapPin size={18} />Open Google Maps</a>
            <a className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/25 px-5 font-black text-white" href="https://www.facebook.com/people/NAW-Bathrooms/100054213141467/"><Facebook size={18} />Facebook</a>
          </div>
        </div>
        <div className="relative min-h-[30rem] overflow-hidden rounded-2xl border border-black/10 bg-[#e7e2d8] shadow-premium">
          <iframe title="Map for N.A.W. Bathrooms in Leeds" referrerPolicy="no-referrer-when-downgrade" width="600" height="450" src="https://maps.google.com/maps?q=N.A.W.%20Bathrooms%20Penda%27s%20Way%20Leeds%20LS15%208HX&z=14&output=embed" className="absolute inset-0 h-full w-full border-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(0,0,0,.08))]" />
        </div>
      </section>

      <footer id="contact" className="relative z-10 border-t border-black/10 bg-[#f7f3ea] px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div>
            <strong>N.A.W. Bathrooms</strong>
            <p className="mt-1 text-sm text-black/58">Bathroom renovations, plumbing and tiling in Leeds.</p>
          </div>
          <div className="flex gap-3">
            {[
              [Phone, "tel:07714444475", "Call"],
              [Mail, "mailto:NAW.Bathrooms@btinternet.com", "Email"],
              [Facebook, "https://www.facebook.com/people/NAW-Bathrooms/100054213141467/", "Facebook"],
              [MapPin, "https://www.google.com/maps/search/?api=1&query=N.A.W.%20Bathrooms%20Penda%27s%20Way%20Leeds%20LS15%208HX", "Google Maps"],
            ].map(([Icon, href, label]) => (
              <a key={label as string} href={href as string} aria-label={label as string} className="grid h-11 w-11 place-items-center rounded-full bg-[#17211c] text-white transition hover:bg-[#c2332d]">
                <Icon size={21} />
              </a>
            ))}
          </div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Plumber",
        name: "N.A.W. Bathrooms",
        alternateName: "N.A.W. Plumbing & Tiling specialising in Bathroom Renovations",
        url: "https://deanooooooooo.github.io/naw-bathrooms-premium-site/",
        image: "https://deanooooooooo.github.io/naw-bathrooms-premium-site/assets/finished-bathroom.jpg",
        telephone: ["0113 2606275", "07714 444475"],
        email: "NAW.Bathrooms@btinternet.com",
        address: { "@type": "PostalAddress", streetAddress: "Penda's Way", addressLocality: "Leeds", postalCode: "LS15 8HX", addressCountry: "GB" },
        geo: { "@type": "GeoCoordinates", latitude: 53.811255, longitude: -1.43877 },
        areaServed: "Leeds",
        sameAs: ["https://www.facebook.com/people/NAW-Bathrooms/100054213141467/", "https://nextdoor.co.uk/pages/naw-plumbing-tiling-specialising-in-bathroom-renovations-leeds-gb-eng/"],
      }) }} />
    </main>
  );
}
