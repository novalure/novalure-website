import { motion } from 'framer-motion';
import Reveal from './Reveal';

export default function FeaturedVideoSection() {
  return (
    <section className="overflow-hidden bg-black px-6 pb-20 pt-6 md:pb-32 md:pt-10">
      <Reveal y={60} duration={0.9} className="relative mx-auto aspect-[4/5] max-w-6xl overflow-hidden rounded-3xl sm:aspect-video">
        <video className="absolute inset-0 h-full w-full object-cover" src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4" muted autoPlay loop playsInline preload="auto" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start justify-between gap-5 p-6 md:flex-row md:items-end md:p-10">
          <div className="liquid-glass max-w-md rounded-2xl p-6 md:p-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-white/50">Our Approach</p>
            <p className="text-sm leading-relaxed text-white md:text-base">We believe in the power of curiosity-driven exploration. Every project starts with a question, and every answer opens a new door to innovation.</p>
          </div>
          <motion.a href="#philosophy" className="liquid-glass inline-flex rounded-full px-8 py-3 text-sm font-medium text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Explore more</motion.a>
        </div>
      </Reveal>
    </section>
  );
}
