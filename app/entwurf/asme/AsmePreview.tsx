"use client";

import { ArrowRight, Globe, Instagram, Twitter } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import AboutSection from './components/AboutSection';
import FeaturedVideoSection from './components/FeaturedVideoSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';

const heroVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const restartRef = useRef<number | null>(null);
  const fadingRef = useRef(false);
  const initializedRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);

  const fadeTo = useCallback((target: number, duration = 500) => {
    const video = videoRef.current;
    if (!video) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const startOpacity = Number.parseFloat(video.style.opacity || '0');
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      video.style.opacity = String(startOpacity + (target - startOpacity) * progress);
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
      else frameRef.current = null;
    };
    frameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 2 && !initializedRef.current) {
      initializedRef.current = true;
      void video.play().then(() => fadeTo(1)).catch(() => { initializedRef.current = false; });
    }
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (restartRef.current !== null) clearTimeout(restartRef.current);
    };
  }, [fadeTo]);

  const onCanPlay = () => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    void videoRef.current?.play().then(() => fadeTo(1)).catch(() => { initializedRef.current = false; });
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || fadingRef.current || !Number.isFinite(video.duration)) return;
    if (video.duration - video.currentTime <= 0.55) {
      fadingRef.current = true;
      fadeTo(0);
    }
  };

  const onEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = '0';
    restartRef.current = window.setTimeout(() => {
      video.currentTime = 0;
      void video.play().then(() => {
        fadingRef.current = false;
        fadeTo(1);
      }).catch(() => { fadingRef.current = false; });
    }, 100);
  };

  const onSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover object-bottom" style={{ opacity: 0 }} src={heroVideo} muted autoPlay playsInline preload="auto" onCanPlay={onCanPlay} onTimeUpdate={onTimeUpdate} onEnded={onEnded} aria-hidden="true" />
      <nav className="relative z-20 px-6 py-6" aria-label="Main navigation">
        <div className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3">
          <div className="flex items-center gap-2">
            <Globe size={24} className="text-white" aria-hidden="true" />
            <a href="#top" className="text-lg font-semibold text-white">Asme</a>
            <div className="ml-8 hidden items-center gap-8 md:flex">
              <a href="#services" className="text-sm font-medium text-white/80 hover:text-white">Features</a>
              <a href="#newsletter" className="text-sm font-medium text-white/80 hover:text-white">Pricing</a>
              <a href="#about" className="text-sm font-medium text-white/80 hover:text-white">About</a>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#newsletter" className="text-sm font-medium text-white">Sign Up</a>
            <a href="#newsletter" className="liquid-glass rounded-full px-6 py-2 text-sm font-medium text-white">Login</a>
          </div>
        </div>
      </nav>
      <div className="relative z-10 flex flex-1 -translate-y-[10%] flex-col items-center justify-center px-6 py-12 text-center md:-translate-y-[20%]">
        <h1 className="serif mb-8 whitespace-nowrap text-[clamp(3.1rem,9vw,8rem)] leading-none tracking-tight text-white">Know it then <em className="italic">all</em>.</h1>
        <form id="newsletter" onSubmit={onSubscribe} className="liquid-glass flex w-full max-w-xl items-center gap-3 rounded-full py-2 pl-6 pr-2">
          <input type="email" required aria-label="Email address" placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/40" onChange={() => setSubmitted(false)} />
          <button type="submit" className="rounded-full bg-white p-3 text-black transition-transform hover:scale-105" aria-label="Subscribe"><ArrowRight size={20} /></button>
        </form>
        <p className="mt-5 max-w-lg px-4 text-sm leading-relaxed text-white">Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.</p>
        {submitted && <p role="status" className="mt-3 text-sm text-white/70">Thanks for your interest. This is a design preview.</p>}
        <a href="#about" className="liquid-glass mt-8 rounded-full px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5">Manifesto</a>
      </div>
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        {[Instagram, Twitter, Globe].map((Icon, index) => (
          <a key={index} href={index === 2 ? '#about' : '#top'} aria-label={['Instagram', 'Twitter', 'Website'][index]} className="liquid-glass rounded-full p-4 text-white/80 transition-all hover:bg-white/5 hover:text-white"><Icon size={20} /></a>
        ))}
      </div>
    </section>
  );
}

export default function Index() {
  return <main className="asme-preview bg-black"><Hero /><AboutSection /><FeaturedVideoSection /><PhilosophySection /><ServicesSection /></main>;
}
