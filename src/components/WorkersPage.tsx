import { useTranslation } from 'react-i18next'
import { openFormModal } from './FormModal'

export function WorkersPage() {
  const { t } = useTranslation()

  // Dynamic profiles data from i18n
  const rawProfiles = t('workersPage.profiles.cards', { returnObjects: true })
  const profilesData = Array.isArray(rawProfiles) ? rawProfiles : []

  // Dynamic expect cards from i18n
  const rawExpect = t('workersPage.expect.cards', { returnObjects: true })
  const expectCards = Array.isArray(rawExpect) ? rawExpect : []

  // Dynamic process steps from i18n
  const rawSteps = t('workersPage.process.steps', { returnObjects: true })
  const processSteps = Array.isArray(rawSteps) ? rawSteps : []

  // Specialty SVG icons mapping
  const profileIcons: Record<string, React.ReactNode> = {
    welders: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    mechanics: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    pipefitters: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h18M12 3v18M7 7l10 10M17 7L7 17" />
      </svg>
    ),
    riggers: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    boilermakers: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M7 12h10M12 7v10" />
      </svg>
    ),
    instrumentists: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    scaffolders: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="1" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  }

  const expectIcons = [
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>,
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>,
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
    </svg>,
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>,
  ]

  return (
    <div className="workers-page" id="trabalhadores">
      {/* ---------------------------------------------------- */}
      {/* A) HERO DA PÁGINA TRABALHADORES                       */}
      {/* ---------------------------------------------------- */}
      <section className="workers-hero">
        <div className="workers-hero-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/hero/hero-poster.png"
            className="workers-hero-video"
          >
            <source src="/assets/hero/luminous-hero-desktop.mp4" type="video/mp4" />
          </video>
          <div className="workers-hero-overlay" />
        </div>

        <div className="site-container workers-hero-content">
          <span className="gold-eyebrow">{t('workersPage.hero.eyebrow')}</span>
          <h1 className="workers-hero-title">
            {t('workersPage.hero.title')}
          </h1>
          <p className="workers-hero-desc">
            {t('workersPage.hero.description')}
          </p>
          <div className="workers-hero-cta-wrap">
            <button
              type="button"
              className="btn btn-gold-hero"
              onClick={() => openFormModal({ mode: 'cv' })}
            >
              {t('workersPage.hero.cta')} <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* B) BLOCO "O QUE PODE ESPERAR DA LUMINOUS"            */}
      {/* ---------------------------------------------------- */}
      <section className="workers-expect section-space">
        <div className="site-container">
          <div className="section-heading text-center">
            <p className="eyebrow">{t('workersPage.expect.eyebrow')}</p>
            <h2>{t('workersPage.expect.title')}</h2>
          </div>

          <div className="expect-grid">
            {Array.isArray(expectCards) &&
              expectCards.map((card, idx) => (
                <div key={card.id || idx} className="expect-card">
                  <div className="expect-icon-wrap">
                    {expectIcons[idx % expectIcons.length]}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* E) CTA FINAL                                         */}
      {/* ---------------------------------------------------- */}
      <section className="workers-final-cta section-space">
        <div className="site-container text-center">
          <h2>{t('workersPage.finalCta.title')}</h2>
          <p className="final-cta-desc">
            {t('workersPage.finalCta.subtitle')}
          </p>
          <div className="final-cta-buttons">
            <button
              type="button"
              className="btn btn-gold-hero"
              onClick={() => openFormModal({ mode: 'cv' })}
            >
              {t('hero.candidateBtn', { defaultValue: 'Enviar Currículo' })} <span className="btn-arrow">→</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openFormModal({ mode: 'contact' })}
            >
              {t('workersPage.finalCta.btnContact')} <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
