import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HeroScroll() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const introRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Pinned GSAP ScrollTrigger Storytelling across all screen sizes
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Video currentTime scrub on desktop if video exists
        if (video && window.innerWidth >= 769) {
          const syncVideo = () => {
            const duration = Number.isFinite(video.duration) ? video.duration : 0
            if (!duration) return
            ScrollTrigger.create({
              trigger: section,
              start: 'top top',
              end: '+=2400',
              scrub: 0.35,
              onUpdate: (self) => {
                video.currentTime = self.progress * duration
              },
            })
          }
          if (video.readyState >= 1) syncVideo()
          else video.addEventListener('loadedmetadata', syncVideo, { once: true })
        }

        const isMobile = window.innerWidth < 769
        const endDistance = isMobile ? '+=1200' : '+=2400'

        // Single Master Timeline pinned for Hero scroll storytelling
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: endDistance,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Background subtle poster scale
        tl.to('.hero-media', { scale: 1.08, duration: 1 }, 0)

        // Estado 0: Intro Copy & Scroll Cue (0.00 to 0.15) -> fade out cleanly
        tl.to(introRef.current, { opacity: 0, autoAlpha: 0, y: -35, duration: 0.12 }, 0.04)
        tl.to('.scroll-cue', { opacity: 0, autoAlpha: 0, duration: 0.08 }, 0.02)

        // Estado 1: Beat 1 (THE RIGHT PEOPLE) (0.18 to 0.36)
        tl.fromTo('.hero-beat--1', { opacity: 0, autoAlpha: 0, y: 35 }, { opacity: 1, autoAlpha: 1, y: 0, duration: 0.06 }, 0.18)
        tl.to('.hero-beat--1', { opacity: 0, autoAlpha: 0, y: -25, duration: 0.06 }, 0.32)

        // Estado 2: Beat 2 (THE RIGHT SKILLS) (0.38 to 0.56)
        tl.fromTo('.hero-beat--2', { opacity: 0, autoAlpha: 0, y: 35 }, { opacity: 1, autoAlpha: 1, y: 0, duration: 0.06 }, 0.38)
        tl.to('.hero-beat--2', { opacity: 0, autoAlpha: 0, y: -25, duration: 0.06 }, 0.52)

        // Estado 3: Beat 3 (THE RIGHT EXPERIENCE) (0.58 to 0.76)
        tl.fromTo('.hero-beat--3', { opacity: 0, autoAlpha: 0, y: 35 }, { opacity: 1, autoAlpha: 1, y: 0, duration: 0.06 }, 0.58)
        tl.to('.hero-beat--3', { opacity: 0, autoAlpha: 0, y: -25, duration: 0.06 }, 0.72)

        // Estado 4: Beat 4 Final Message + Subtitle (0.78 to 1.00) - stays visible until section unpins
        tl.fromTo('.hero-beat--4', { opacity: 0, autoAlpha: 0, y: 35 }, { opacity: 1, autoAlpha: 1, y: 0, duration: 0.08 }, 0.78)
      })

      return () => mm.revert()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="top" className="hero-scroll">
      <div className="hero-sticky">
        <video
          ref={videoRef}
          className="hero-media"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero/hero-poster.png"
          aria-hidden="true"
        >
          <source src="/assets/hero/luminous-hero-desktop.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />

        {/* Estado 0: Intro Main Copy */}
        <div ref={introRef} className="hero-copy site-container">
          <p className="eyebrow">{t('hero.eyebrow')}</p>
          <h1>{t('hero.title')}</h1>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              {t('hero.primary')} <span className="btn-arrow">→</span>
            </a>
            <a className="btn btn-secondary" href="#industries">
              {t('hero.secondary')} <span className="btn-arrow">→</span>
            </a>
          </div>
          <p className="location-line">{t('hero.location')}</p>
        </div>

        {/* Estados 1 to 4: Animated Scroll Beats */}
        <div className="hero-beats site-container" aria-hidden="true">
          <p className="hero-beat hero-beat--1">{t('hero.beat1')}</p>
          <p className="hero-beat hero-beat--2">{t('hero.beat2')}</p>
          <p className="hero-beat hero-beat--3">{t('hero.beat3')}</p>
          <div className="hero-beat hero-beat--4">
            <p className="hero-beat-title">{t('hero.beat4')}</p>
            <p className="hero-beat-sub">{t('hero.subBeat4')}</p>
          </div>
        </div>

        <div className="scroll-cue">
          <span className="scroll-cue-text">{t('hero.scroll')}</span>
          <span className="scroll-cue-arrow">↓</span>
        </div>
      </div>
    </section>
  )
}
