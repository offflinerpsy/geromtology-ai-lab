"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export default function Motion() {
  const pathname=usePathname();
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector<HTMLElement>(".site-header");
    const items = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
    let frame = 0;
    const draw = () => {
      frame = 0;
      header?.classList.toggle("scrolled", window.scrollY > 40);
      items.forEach(el => {
        if (media.matches || window.innerWidth < 768) { el.style.transform = ""; return; }
        const box = el.getBoundingClientRect();
        if (box.bottom < -200 || box.top > window.innerHeight + 200) return;
        const progress = Math.max(-100, Math.min(100, (window.innerHeight / 2 - box.top - box.height / 2) * Number(el.dataset.parallax)));
        el.style.transform = `translate3d(0,${progress}px,0) scale(1.07)`;
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), {threshold: 0.01, rootMargin: "80px 0px"});
    if(!media.matches) document.querySelectorAll<HTMLElement>(".reveal").forEach(el => {
      if(el.getBoundingClientRect().top > window.innerHeight) el.classList.add("will-reveal");
      observer.observe(el);
    });
    const menu = document.querySelector<HTMLDetailsElement>(".mobile-nav");
    const closeMenu = (event: Event) => { if((event.target as HTMLElement).closest("a") && menu) menu.open = false; };
    const escapeMenu = (event: KeyboardEvent) => { if(event.key === "Escape" && menu?.open) { menu.open = false; menu.querySelector("summary")?.focus(); } };
    const motionChanged = () => {
      if(media.matches) document.querySelectorAll(".will-reveal").forEach(el=>el.classList.add("is-visible"));
      onScroll();
    };
    menu?.addEventListener("click", closeMenu);
    document.addEventListener("keydown", escapeMenu);
    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("resize", onScroll, {passive: true});
    media.addEventListener("change", motionChanged);
    draw();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll",onScroll); window.removeEventListener("resize",onScroll); media.removeEventListener("change", motionChanged); menu?.removeEventListener("click",closeMenu); document.removeEventListener("keydown",escapeMenu); };
  }, [pathname]);
  return null;
}
