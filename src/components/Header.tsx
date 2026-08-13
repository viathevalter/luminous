import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const langs = ['en', 'pt', 'es', 'it'] as const

export function Header() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="site-container header-inner">
        {/* TODO: replace temporary wordmark with final Luminous logo. */}
        <a className="brand" href="#top" aria-label="Luminous home">
          <span className="brand-wordmark">LUMINOUS</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#top">{t('nav.home')}</a>
          <a href="#industries">{t('nav.industries')}</a>
          <a href="#workforce">{t('nav.workforce')}</a>
          <a href="#about">{t('nav.about')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </nav>
        <div className="language-switcher" aria-label="Language selector">
          {langs.map((lang) => (
            <button
              className={i18n.language === lang ? 'active' : ''}
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
