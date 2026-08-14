import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// TODO: replace team placeholder with final Luminous team asset.
export function AboutLuminous() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [imgStage, setImgStage] = useState(0)

  const eyebrow = t('about.eyebrow')
  const title = t('about.title')
  const p1 = t('about.p1')
  const p2 = t('about.p2')
  const p3 = t('about.p3')

  const getAboutSrc = () => {
    if (imgStage === 0) return '/assets/about/luminous-team.webp'
    if (imgStage === 1) return '/assets/about/luminous-team.png'
    return ''
  }

  const handleAboutImgError = () => {
    setImgStage((prev) => prev + 1)
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-fade-in',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="about-section section-space">
      <div className="site-container about-grid">
        {/* Left Column: Editorial Text */}
        <div className="about-text-col about-fade-in">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <div className="about-body">
            <p>{p1}</p>
            <p>{p2}</p>
            <p>{p3}</p>
          </div>
        </div>

        {/* Right Column: Visual Frame for Team Asset */}
        <div className="about-media-col about-fade-in">
          <div className="about-media-frame">
            {imgStage < 2 ? (
              <>
                <img
                  className="about-team-img"
                  src={getAboutSrc()}
                  alt="Luminous industrial team"
                  loading="lazy"
                  onError={handleAboutImgError}
                />
                <div className="about-media-overlay" />
              </>
            ) : (
              // TODO: replace team placeholder with final Luminous team asset.
              <div className="about-placeholder-card">
                <div className="about-placeholder-center">
                  <img
                    src="/assets/logo/luminous-logo.svg"
                    alt="Luminous"
                    className="about-placeholder-logo-img"
                    width="160"
                    height="68"
                  />
                  <span className="about-placeholder-sub">FINAL LUMINOUS TEAM ASSET PENDING</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
