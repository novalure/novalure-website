import Reveal from './Reveal';

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="overflow-hidden bg-black px-6 py-28 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 text-5xl tracking-tight text-white md:mb-24 md:text-7xl lg:text-8xl">Innovation <em className="serif text-white/40">x</em> Vision.</Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <Reveal x={-40} y={0} className="aspect-[4/3] overflow-hidden rounded-3xl">
            <video className="h-full w-full object-cover" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" muted autoPlay loop playsInline preload="auto" aria-hidden="true" />
          </Reveal>
          <Reveal x={40} y={0} className="flex flex-col justify-center">
            <div className="pb-8 md:pb-10">
              <p className="mb-4 text-xs uppercase tracking-widest text-white/40">Choose your space</p>
              <p className="text-base leading-relaxed text-white/70 md:text-lg">Every meaningful breakthrough begins at the intersection of disciplined strategy and remarkable creative vision. We operate at that crossroads, turning bold thinking into tangible outcomes that move people and reshape industries.</p>
            </div>
            <div className="h-px w-full bg-white/10" />
            <div className="pt-8 md:pt-10">
              <p className="mb-4 text-xs uppercase tracking-widest text-white/40">Shape the future</p>
              <p className="text-base leading-relaxed text-white/70 md:text-lg">We believe that the best work emerges when curiosity meets conviction. Our process is designed to uncover hidden opportunities and translate them into experiences that resonate long after the first impression.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
