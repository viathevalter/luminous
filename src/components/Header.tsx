import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { openFormModal } from './FormModal'

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
        <a className="brand" href="#top" aria-label="Luminous home">
          <img
            src="/assets/logo/luminous-logo.svg"
            alt="Luminous"
            className="brand-logo"
            width="155"
            height="66"
          />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#top">{t('nav.home')}</a>
          <a href="#industries">{t('nav.industries')}</a>
          <a href="#workforce">{t('nav.workforce')}</a>
          <a href="#about">{t('nav.about')}</a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              openFormModal({ mode: 'contact' })
            }}
          >
            {t('nav.contact')}
          </a>
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
