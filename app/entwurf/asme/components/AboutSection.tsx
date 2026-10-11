import Reveal from './Reveal';

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-black px-6 pb-10 pt-32 md:pb-14 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal y={20} duration={0.6} className="mb-8 text-sm uppercase tracking-widest text-white/40 md:mb-12">About Us</Reveal>
        <Reveal y={40} delay={0.1} className="text-4xl leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
          Pioneering <em className="serif text-white/60">ideas</em> for<br className="hidden md:block" /> minds that <em className="serif text-white/60">create, build, and inspire.</em>
        </Reveal>
      </div>
    </section>
  );
}
