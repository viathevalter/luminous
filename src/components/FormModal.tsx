import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

export type FormModalMode = 'workforce' | 'cv' | 'contact'

export interface FormModalEventDetail {
  mode?: FormModalMode
  sector?: string
  role?: string
  initialRole?: string
}

// Global helper to trigger the modal from anywhere in the codebase
export function openFormModal(detail?: FormModalEventDetail) {
  window.dispatchEvent(
    new CustomEvent('open-form-modal', {
      detail: detail || { mode: 'workforce' },
    })
  )
}

const DESTINATION_EMAIL = 'mkt@luminousalley.com'
const WHATSAPP_NUMBER = '351912345678' // Luminous operations contact

const specialtyOptions = [
  'Soldadores (TIG / MIG / MMA)',
  'Tubistas Industriais / Pipefitters',
  'Caldeireiros Industriais',
  'Mecânicos Industriais',
  'Eletricistas Industriais',
  'Instrumentistas & Automação',
  'Montadores de Andaimes / Riggers',
  'Supervisores & Chefes de Equipa',
  'Outra Especialidade Técnica',
]

const languageOptions = ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Outro']

export function FormModal() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<FormModalMode>('workforce')

  // Workforce Form State
  const [wfName, setWfName] = useState('')
  const [wfCompany, setWfCompany] = useState('')
  const [wfEmail, setWfEmail] = useState('')
  const [wfPhone, setWfPhone] = useState('')
  const [wfSector, setWfSector] = useState('')
  const [wfRoles, setWfRoles] = useState<string[]>([])
  const [wfHeadcount, setWfHeadcount] = useState('')
  const [wfLocation, setWfLocation] = useState('')
  const [wfStartDate, setWfStartDate] = useState('')
  const [wfMessage, setWfMessage] = useState('')

  // CV Submission Form State
  const [cvFullName, setCvFullName] = useState('')
  const [cvEmail, setCvEmail] = useState('')
  const [cvPhone, setCvPhone] = useState('')
  const [cvResidenceCountry, setCvResidenceCountry] = useState('Portugal')
  const [cvNationality, setCvNationality] = useState('')
  const [cvEuropeMobility, setCvEuropeMobility] = useState('Sim, total disponibilidade')
  const [cvSpecialties, setCvSpecialties] = useState<string[]>([])
  const [cvYearsExperience, setCvYearsExperience] = useState('1 a 3 anos')
  const [cvOtherSpecialty, setCvOtherSpecialty] = useState('')
  const [cvExperienceSummary, setCvExperienceSummary] = useState('')
  const [cvLanguages, setCvLanguages] = useState<string[]>(['Português'])
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvRgpdConsent, setCvRgpdConsent] = useState(false)
  const [cvDatabaseConsent, setCvDatabaseConsent] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  // Contact Form State
  const [ctName, setCtName] = useState('')
  const [ctCompany, setCtCompany] = useState('')
  const [ctEmail, setCtEmail] = useState('')
  const [ctPhone, setCtPhone] = useState('')
  const [ctSubject, setCtSubject] = useState('')
  const [ctMessage, setCtMessage] = useState('')

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const modalRef = useRef<HTMLDivElement>(null)

  // Listen to open-form-modal events
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<FormModalEventDetail>
      if (customEvent.detail?.mode) {
        setMode(customEvent.detail.mode)
      }
      if (customEvent.detail?.role) {
        setWfRoles((prev) =>
          prev.includes(customEvent.detail!.role!) ? prev : [...prev, customEvent.detail!.role!]
        )
      }
      if (customEvent.detail?.initialRole) {
        const initRole = customEvent.detail.initialRole
        setCvSpecialties((prev) => (prev.includes(initRole) ? prev : [...prev, initRole]))
      }
      if (customEvent.detail?.sector) {
        setWfSector(customEvent.detail.sector)
      }
      setIsSuccess(false)
      setErrorMessage(null)
      setIsOpen(true)
    }

    window.addEventListener('open-form-modal', handleOpen)
    return () => window.removeEventListener('open-form-modal', handleOpen)
  }, [])

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose()
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setIsSuccess(false)
    setErrorMessage(null)
  }

  const toggleWfRole = (roleKey: string) => {
    setWfRoles((prev) =>
      prev.includes(roleKey) ? prev.filter((r) => r !== roleKey) : [...prev, roleKey]
    )
  }

  const toggleCvSpecialty = (title: string) => {
    setCvSpecialties((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    )
  }

  const toggleCvLanguage = (lang: string) => {
    setCvLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('O ficheiro é demasiado grande (máximo 10MB).')
        return
      }
      setCvFile(file)
      setErrorMessage(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('O ficheiro é demasiado grande (máximo 10MB).')
        return
      }
      setCvFile(file)
      setErrorMessage(null)
    }
  }

  // Available Sector & Role Options
  const sectorOptions = [
    { value: 'Oil & Gas', label: t('chat.sectors.oilGas', { defaultValue: 'Petróleo & Gás' }) },
    { value: 'Petrochemical', label: t('chat.sectors.petro', { defaultValue: 'Petroquímica' }) },
    { value: 'Refineries', label: t('chat.sectors.refinery', { defaultValue: 'Refinarias' }) },
    { value: 'Energy', label: t('chat.sectors.energy', { defaultValue: 'Energia' }) },
    { value: 'Shipyards & Marine', label: t('chat.sectors.shipyard', { defaultValue: 'Estaleiros & Naval' }) },
    { value: 'Industrial Construction', label: 'Construção Industrial' },
    { value: 'Other', label: t('chat.sectors.other', { defaultValue: 'Outro Setor' }) },
  ]

  const technicalRoles = [
    { id: 'welders', label: t('chat.roles.welders', { defaultValue: 'Soldadores (TIG / MIG / MMA)' }) },
    { id: 'pipefitters', label: t('chat.roles.pipefitters', { defaultValue: 'Tubistas Industriais' }) },
    { id: 'boilermakers', label: t('chat.roles.boilermakers', { defaultValue: 'Caldeireiros' }) },
    { id: 'mechanics', label: t('chat.roles.mechanics', { defaultValue: 'Mecânicos Industriais' }) },
    { id: 'electricians', label: t('chat.roles.electricians', { defaultValue: 'Eletricistas' }) },
    { id: 'supervisors', label: t('chat.roles.supervisors', { defaultValue: 'Supervisores / Chefes de Equipa' }) },
    { id: 'otherRole', label: t('chat.roles.otherRole', { defaultValue: 'Outros Perfis Técnicos' }) },
  ]

  const handleWorkforceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!wfName.trim() || !wfCompany.trim() || !wfEmail.trim() || !wfPhone.trim() || !wfSector || !wfLocation.trim()) {
      setErrorMessage(t('forms.validation.required'))
      return
    }

    if (wfRoles.length === 0) {
      setErrorMessage(t('forms.validation.selectRole'))
      return
    }

    if (!/\S+@\S+\.\S+/.test(wfEmail)) {
      setErrorMessage(t('forms.validation.invalidEmail'))
      return
    }

    setIsSubmitting(true)

    const payload = {
      _subject: `[Luminous Workforce] Nova Solicitação de Mão de Obra - ${wfCompany} (${wfName})`,
      _template: 'table',
      _captcha: 'false',
      _replyto: wfEmail,
      'Formulário': 'Solicitação de Mão de Obra Industrial',
      'Nome do Responsável': wfName,
      'Empresa': wfCompany,
      'E-mail Corporativo': wfEmail,
      'Telefone / WhatsApp': wfPhone,
      'Setor Industrial': wfSector,
      'Perfis Técnicos Requeridos': wfRoles.map((r) => technicalRoles.find((tr) => tr.id === r)?.label || r).join('; '),
      'Dimensão Estimada da Equipa': wfHeadcount || 'Não especificado',
      'Localização do Projeto': wfLocation,
      'Previsão de Início': wfStartDate || 'A definir',
      'Detalhes / Requisitos Adicionais': wfMessage || 'Sem observações adicionais',
      'Idioma': i18n.language.toUpperCase(),
      'Enviado em': new Date().toLocaleString(),
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSuccess(true)
        resetWfForm()
      } else {
        throw new Error('Falha no envio do formulário')
      }
    } catch {
      const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
        payload._subject
      )}&body=${encodeURIComponent(
        `Nome: ${wfName}\nEmpresa: ${wfCompany}\nEmail: ${wfEmail}\nTelefone: ${wfPhone}\nSetor: ${wfSector}\nPerfis: ${payload['Perfis Técnicos Requeridos']}\nLocalização: ${wfLocation}\nPrazo: ${wfStartDate}\nMensagem:\n${wfMessage}`
      )}`
      window.location.href = mailtoUrl
      setIsSuccess(true)
      resetWfForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!cvFullName.trim() || !cvEmail.trim() || !cvPhone.trim() || !cvResidenceCountry) {
      setErrorMessage(t('forms.validation.required'))
      return
    }

    if (cvSpecialties.length === 0 && !cvOtherSpecialty.trim()) {
      setErrorMessage('Por favor, selecione pelo menos uma especialidade profissional.')
      return
    }

    if (!cvRgpdConsent) {
      setErrorMessage('É necessário aceitar os termos de tratamento de dados pessoais (RGPD).')
      return
    }

    if (!/\S+@\S+\.\S+/.test(cvEmail)) {
      setErrorMessage(t('forms.validation.invalidEmail'))
      return
    }

    setIsSubmitting(true)

    const payload = {
      _subject: `[Luminous Recrutamento] Candidatura - ${cvFullName} (${cvSpecialties.join(', ') || cvOtherSpecialty})`,
      _template: 'table',
      _captcha: 'false',
      _replyto: cvEmail,
      'Formulário': 'Envio de Currículo / Recrutamento',
      'Nome Completo': cvFullName,
      'E-mail': cvEmail,
      'Telefone / WhatsApp': cvPhone,
      'País de Residência': cvResidenceCountry,
      'Nacionalidade': cvNationality || 'Não informada',
      'Mobilidade na Europa': cvEuropeMobility,
      'Especialidades': cvSpecialties.join('; ') + (cvOtherSpecialty ? ` (Outra: ${cvOtherSpecialty})` : ''),
      'Anos de Experiência': cvYearsExperience,
      'Resumo de Experiência': cvExperienceSummary || 'Não preenchido',
      'Idiomas': cvLanguages.join(', '),
      'Anexo de Currículo': cvFile ? cvFile.name : 'Não anexado',
      'Autorização Base de Dados': cvDatabaseConsent ? 'Sim' : 'Não',
      'Idioma': i18n.language.toUpperCase(),
      'Enviado em': new Date().toLocaleString(),
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSuccess(true)
        resetCvForm()
      } else {
        throw new Error('Falha no envio')
      }
    } catch {
      const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
        payload._subject
      )}&body=${encodeURIComponent(
        `Nome: ${cvFullName}\nEmail: ${cvEmail}\nTelefone: ${cvPhone}\nPaís: ${cvResidenceCountry}\nEspecialidades: ${payload['Especialidades']}\nExperiência:\n${cvExperienceSummary}`
      )}`
      window.location.href = mailtoUrl
      setIsSuccess(true)
      resetCvForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!ctName.trim() || !ctEmail.trim() || !ctPhone.trim() || !ctSubject || !ctMessage.trim()) {
      setErrorMessage(t('forms.validation.required'))
      return
    }

    if (!/\S+@\S+\.\S+/.test(ctEmail)) {
      setErrorMessage(t('forms.validation.invalidEmail'))
      return
    }

    setIsSubmitting(true)

    const payload = {
      _subject: `[Luminous Contato] ${ctSubject} - ${ctName} (${ctCompany || 'Geral'})`,
      _template: 'table',
      _captcha: 'false',
      _replyto: ctEmail,
      'Formulário': 'Contacto Geral / Informações',
      'Nome Completo': ctName,
      'Empresa': ctCompany || 'Não informada',
      'E-mail': ctEmail,
      'Telefone / WhatsApp': ctPhone,
      'Assunto': ctSubject,
      'Mensagem': ctMessage,
      'Idioma': i18n.language.toUpperCase(),
      'Enviado em': new Date().toLocaleString(),
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSuccess(true)
        resetCtForm()
      } else {
        throw new Error('Falha no envio')
      }
    } catch {
      const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
        payload._subject
      )}&body=${encodeURIComponent(
        `Nome: ${ctName}\nEmpresa: ${ctCompany}\nEmail: ${ctEmail}\nTelefone: ${ctPhone}\nAssunto: ${ctSubject}\nMensagem:\n${ctMessage}`
      )}`
      window.location.href = mailtoUrl
      setIsSuccess(true)
      resetCtForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetWfForm = () => {
    setWfName('')
    setWfCompany('')
    setWfEmail('')
    setWfPhone('')
    setWfSector('')
    setWfRoles([])
    setWfHeadcount('')
    setWfLocation('')
    setWfStartDate('')
    setWfMessage('')
  }

  const resetCvForm = () => {
    setCvFullName('')
    setCvEmail('')
    setCvPhone('')
    setCvResidenceCountry('Portugal')
    setCvNationality('')
    setCvEuropeMobility('Sim, total disponibilidade')
    setCvSpecialties([])
    setCvYearsExperience('1 a 3 anos')
    setCvOtherSpecialty('')
    setCvExperienceSummary('')
    setCvLanguages(['Português'])
    setCvFile(null)
    setCvRgpdConsent(false)
    setCvDatabaseConsent(true)
  }

  const resetCtForm = () => {
    setCtName('')
    setCtCompany('')
    setCtEmail('')
    setCtPhone('')
    setCtSubject('')
    setCtMessage('')
  }

  if (!isOpen) return null

  return (
    <div
      className="form-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div className="form-modal-container" ref={modalRef}>
        {/* Modal Header */}
        <div className="form-modal-header">
          <div className="form-modal-tabs">
            <button
              type="button"
              className={`form-modal-tab ${mode === 'workforce' ? 'is-active' : ''}`}
              onClick={() => {
                setMode('workforce')
                setErrorMessage(null)
                setIsSuccess(false)
              }}
            >
              <span className="tab-icon">👷</span>
              {t('forms.tabWorkforce')}
            </button>

            <button
              type="button"
              className={`form-modal-tab ${mode === 'cv' ? 'is-active' : ''}`}
              onClick={() => {
                setMode('cv')
                setErrorMessage(null)
                setIsSuccess(false)
              }}
            >
              <span className="tab-icon">📄</span>
              {t('forms.tabCv', { defaultValue: 'Enviar Currículo' })}
            </button>

            <button
              type="button"
              className={`form-modal-tab ${mode === 'contact' ? 'is-active' : ''}`}
              onClick={() => {
                setMode('contact')
                setErrorMessage(null)
                setIsSuccess(false)
              }}
            >
              <span className="tab-icon">✉️</span>
              {t('forms.tabContact')}
            </button>
          </div>

          <button
            type="button"
            className="form-modal-close-btn"
            onClick={handleClose}
            aria-label={t('forms.close')}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="form-modal-body">
          {isSuccess ? (
            <div className="form-success-card">
              <div className="form-success-icon-wrap">
                <svg
                  className="form-success-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h3 id="form-modal-title">
                {mode === 'workforce'
                  ? t('forms.workforce.successTitle')
                  : mode === 'cv'
                  ? t('forms.cvModal.successTitle', { defaultValue: 'Candidatura Enviada com Sucesso!' })
                  : t('forms.contact.successTitle')}
              </h3>

              <p className="form-success-desc">
                {mode === 'workforce'
                  ? t('forms.workforce.successText')
                  : mode === 'cv'
                  ? t('forms.cvModal.successText', { defaultValue: 'Agradecemos o envio do seu currículo. A equipa de recrutamento da LUMINOUS irá analisar o seu perfil.' })
                  : t('forms.contact.successText')}
              </p>

              <div className="form-success-meta">
                <span className="form-dest-label">Destinatário:</span>
                <span className="form-dest-value">{DESTINATION_EMAIL}</span>
              </div>

              <div className="form-success-actions">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Olá Luminous! Acabei de enviar uma ${mode === 'cv' ? 'candidatura' : 'solicitação'} via site.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="form-btn form-btn-whatsapp"
                >
                  <span>💬</span>
                  {mode === 'workforce'
                    ? t('forms.workforce.whatsappAlt')
                    : mode === 'cv'
                    ? t('forms.cvModal.whatsappAlt', { defaultValue: 'Enviar Candidatura no WhatsApp' })
                    : t('forms.contact.whatsappAlt')}
                </a>
                <button type="button" className="form-btn form-btn-secondary" onClick={handleClose}>
                  {t('forms.close')}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Form Info Header */}
              <div className="form-intro-block">
                <h3 id="form-modal-title">
                  {mode === 'workforce'
                    ? t('forms.workforce.title')
                    : mode === 'cv'
                    ? t('forms.cvModal.title', { defaultValue: 'Enviar Currículo' })
                    : t('forms.contact.title')}
                </h3>
                <p>
                  {mode === 'workforce'
                    ? t('forms.workforce.subtitle')
                    : mode === 'cv'
                    ? t('forms.cvModal.subtitle', { defaultValue: 'Registe o seu perfil para ser considerado em processos de seleção para projetos de Oil & Gas em toda a Europa.' })
                    : t('forms.contact.subtitle')}
                </p>
              </div>

              {errorMessage && (
                <div className="form-error-alert" role="alert">
                  <span className="error-icon">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Workforce Mode Form */}
              {mode === 'workforce' && (
                <form className="form-grid-layout" onSubmit={handleWorkforceSubmit} noValidate>
                  {/* Row 1: Name & Company */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-name">{t('forms.workforce.nameLabel')}</label>
                      <input
                        id="wf-name"
                        type="text"
                        required
                        value={wfName}
                        onChange={(e) => setWfName(e.target.value)}
                        placeholder={t('forms.workforce.namePlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-company">{t('forms.workforce.companyLabel')}</label>
                      <input
                        id="wf-company"
                        type="text"
                        required
                        value={wfCompany}
                        onChange={(e) => setWfCompany(e.target.value)}
                        placeholder={t('forms.workforce.companyPlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-email">{t('forms.workforce.emailLabel')}</label>
                      <input
                        id="wf-email"
                        type="email"
                        required
                        value={wfEmail}
                        onChange={(e) => setWfEmail(e.target.value)}
                        placeholder={t('forms.workforce.emailPlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-phone">{t('forms.workforce.phoneLabel')}</label>
                      <input
                        id="wf-phone"
                        type="tel"
                        required
                        value={wfPhone}
                        onChange={(e) => setWfPhone(e.target.value)}
                        placeholder={t('forms.workforce.phonePlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: Industrial Sector & Location */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-sector">{t('forms.workforce.sectorLabel')}</label>
                      <select
                        id="wf-sector"
                        required
                        value={wfSector}
                        onChange={(e) => setWfSector(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('forms.workforce.sectorPlaceholder')}</option>
                        {sectorOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-location">{t('forms.workforce.locationLabel')}</label>
                      <input
                        id="wf-location"
                        type="text"
                        required
                        value={wfLocation}
                        onChange={(e) => setWfLocation(e.target.value)}
                        placeholder={t('forms.workforce.locationPlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 4: Roles Required Multi-select Chips */}
                  <div className="form-field-group">
                    <label>
                      {t('forms.workforce.rolesLabel')}{' '}
                      <span className="field-hint">({t('forms.workforce.rolesHint')})</span>
                    </label>
                    <div className="form-chips-container">
                      {technicalRoles.map((role) => {
                        const isSelected = wfRoles.includes(role.id)
                        return (
                          <button
                            type="button"
                            key={role.id}
                            className={`form-chip ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => toggleWfRole(role.id)}
                          >
                            <span className="chip-check">{isSelected ? '✓' : '+'}</span>
                            <span>{role.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Row 5: Headcount & Start Timeline */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="wf-headcount">{t('forms.workforce.headcountLabel')}</label>
                      <select
                        id="wf-headcount"
                        value={wfHeadcount}
                        onChange={(e) => setWfHeadcount(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('forms.workforce.headcountPlaceholder')}</option>
                        <option value="1-4">{t('forms.workforce.headcountOptions.opt1')}</option>
                        <option value="5-15">{t('forms.workforce.headcountOptions.opt2')}</option>
                        <option value="16-30">{t('forms.workforce.headcountOptions.opt3')}</option>
                        <option value="30+">{t('forms.workforce.headcountOptions.opt4')}</option>
                        <option value="TBD">{t('forms.workforce.headcountOptions.opt5')}</option>
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="wf-start">{t('forms.workforce.startDateLabel')}</label>
                      <select
                        id="wf-start"
                        value={wfStartDate}
                        onChange={(e) => setWfStartDate(e.target.value)}
                        className="form-select"
                      >
                        <option value="">{t('forms.workforce.startDatePlaceholder')}</option>
                        <option value="Immediate">{t('forms.workforce.startDateOptions.immediate')}</option>
                        <option value="1 month">{t('forms.workforce.startDateOptions.month1')}</option>
                        <option value="2-3 months">{t('forms.workforce.startDateOptions.month2_3')}</option>
                        <option value="Tender">{t('forms.workforce.startDateOptions.tender')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 6: Additional Details Message */}
                  <div className="form-field-group">
                    <label htmlFor="wf-message">{t('forms.workforce.messageLabel')}</label>
                    <textarea
                      id="wf-message"
                      rows={3}
                      value={wfMessage}
                      onChange={(e) => setWfMessage(e.target.value)}
                      placeholder={t('forms.workforce.messagePlaceholder')}
                      className="form-textarea"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-btn form-btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="btn-spinner" />
                          <span>{t('forms.workforce.submittingBtn')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('forms.workforce.submitBtn')}</span>
                          <span className="btn-arrow">→</span>
                        </>
                      )}
                    </button>
                    <span className="form-secure-badge">🔒 {DESTINATION_EMAIL}</span>
                  </div>
                </form>
              )}

              {/* Submit CV Mode Form */}
              {mode === 'cv' && (
                <form className="form-grid-layout" onSubmit={handleCvSubmit} noValidate>
                  {/* Row 1: Full Name & Email */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="cv-name">Nome Completo *</label>
                      <input
                        id="cv-name"
                        type="text"
                        required
                        value={cvFullName}
                        onChange={(e) => setCvFullName(e.target.value)}
                        placeholder="Ex: João Miguel Santos"
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="cv-email">E-mail *</label>
                      <input
                        id="cv-email"
                        type="email"
                        required
                        value={cvEmail}
                        onChange={(e) => setCvEmail(e.target.value)}
                        placeholder="seu.email@exemplo.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone & Country of Residence */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="cv-phone">Telefone / WhatsApp (com indicativo) *</label>
                      <input
                        id="cv-phone"
                        type="tel"
                        required
                        value={cvPhone}
                        onChange={(e) => setCvPhone(e.target.value)}
                        placeholder="+351 912 345 678"
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="cv-residence">País de Residência *</label>
                      <select
                        id="cv-residence"
                        required
                        value={cvResidenceCountry}
                        onChange={(e) => setCvResidenceCountry(e.target.value)}
                        className="form-select"
                      >
                        <option value="Portugal">Portugal</option>
                        <option value="Espanha">Espanha</option>
                        <option value="Itália">Itália</option>
                        <option value="França">França</option>
                        <option value="Alemanha">Alemanha</option>
                        <option value="Bélgica">Bélgica</option>
                        <option value="Países Baixos">Países Baixos</option>

                        <option value="Reino Unido">Reino Unido</option>
                        <option value="Outro País Europeu">Outro País Europeu</option>
                        <option value="Fora da Europa">Fora da Europa</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Nationality & Mobility */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="cv-nationality">Nacionalidade</label>
                      <input
                        id="cv-nationality"
                        type="text"
                        value={cvNationality}
                        onChange={(e) => setCvNationality(e.target.value)}
                        placeholder="Ex: Portuguesa, Espanhola, etc."
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="cv-mobility">Disponibilidade para trabalhar na Europa *</label>
                      <select
                        id="cv-mobility"
                        required
                        value={cvEuropeMobility}
                        onChange={(e) => setCvEuropeMobility(e.target.value)}
                        className="form-select"
                      >
                        <option value="Sim, total disponibilidade">Sim, total disponibilidade</option>
                        <option value="Depende do projeto e duração">Depende do projeto e duração</option>
                        <option value="Apenas com deslocação temporária">Apenas deslocação temporária</option>
                        <option value="Não">Não</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Specialties Multi-select Chips */}
                  <div className="form-field-group">
                    <label>
                      Especialidade Profissional * <span className="field-hint">(Selecione uma ou mais)</span>
                    </label>
                    <div className="form-chips-container">
                      {specialtyOptions.map((title) => {
                        const isSelected = cvSpecialties.includes(title)
                        return (
                          <button
                            type="button"
                            key={title}
                            className={`form-chip ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => toggleCvSpecialty(title)}
                          >
                            <span className="chip-check">{isSelected ? '✓' : '+'}</span>
                            <span>{title}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Row 5: Years of Exp & Other Specialty */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="cv-exp">Anos de Experiência no Setor</label>
                      <select
                        id="cv-exp"
                        value={cvYearsExperience}
                        onChange={(e) => setCvYearsExperience(e.target.value)}
                        className="form-select"
                      >
                        <option value="Menos de 1 ano">Menos de 1 ano</option>
                        <option value="1 a 3 anos">1 a 3 anos</option>
                        <option value="3 a 5 anos">3 a 5 anos</option>
                        <option value="5 a 10 anos">5 a 10 anos</option>
                        <option value="Mais de 10 anos">Mais de 10 anos</option>
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="cv-other-spec">Especificar "Outra" Especialidade</label>
                      <input
                        id="cv-other-spec"
                        type="text"
                        value={cvOtherSpecialty}
                        onChange={(e) => setCvOtherSpecialty(e.target.value)}
                        placeholder="Ex: Inspetor NDT, Rigger qualificado, etc."
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 6: Experience Summary */}
                  <div className="form-field-group">
                    <label htmlFor="cv-summary">Resumo da Experiência Profissional e Qualificações</label>
                    <textarea
                      id="cv-summary"
                      rows={3}
                      value={cvExperienceSummary}
                      onChange={(e) => setCvExperienceSummary(e.target.value)}
                      placeholder="Descreva brevemente os seus principais projetos em refinarias, paragens industriais, certificações ativas (VCA, ISO, ASME, TIG, etc.)"
                      className="form-textarea"
                    />
                  </div>

                  {/* Row 7: Languages Spoken */}
                  <div className="form-field-group">
                    <label>Idiomas Falados</label>
                    <div className="form-chips-container">
                      {languageOptions.map((lang) => {
                        const isSelected = cvLanguages.includes(lang)
                        return (
                          <button
                            type="button"
                            key={lang}
                            className={`form-chip ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => toggleCvLanguage(lang)}
                          >
                            <span className="chip-check">{isSelected ? '✓' : '+'}</span>
                            <span>{lang}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Row 8: Drag and Drop Upload CV */}
                  <div className="form-field-group">
                    <label>Upload do Currículo (PDF, DOC ou DOCX até 10MB)</label>
                    <div
                      className={`form-dropzone ${isDragging ? 'is-dragging' : ''} ${cvFile ? 'has-file' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="cv-file-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="dropzone-file-input"
                      />
                      {!cvFile ? (
                        <label htmlFor="cv-file-upload" className="dropzone-label">
                          <span className="dropzone-icon">📁</span>
                          <span className="dropzone-text">Arraste o ficheiro do CV para aqui ou <strong className="gold-link">clique para selecionar</strong></span>
                          <span className="dropzone-hint">Formatos suportados: PDF, DOC, DOCX (Máx 10MB)</span>
                        </label>
                      ) : (
                        <div className="dropzone-file-preview">
                          <span className="file-icon">📄</span>
                          <div className="file-info">
                            <span className="file-name">{cvFile.name}</span>
                            <span className="file-size">({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                          </div>
                          <button
                            type="button"
                            className="file-remove-btn"
                            onClick={() => setCvFile(null)}
                            title="Remover ficheiro"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 9: RGPD Consent Checkbox */}
                  <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        required
                        checked={cvRgpdConsent}
                        onChange={(e) => setCvRgpdConsent(e.target.checked)}
                      />
                      <span>
                        Autorizo o tratamento dos meus dados pessoais nos termos do RGPD para efeitos de recrutamento e seleção *{' '}
                        <button
                          type="button"
                          className="terms-link-btn"
                          onClick={() => setShowPrivacyModal(true)}
                        >
                          (Ver Política de Privacidade)
                        </button>
                      </span>
                    </label>
                  </div>

                  {/* Row 10: Database Authorization Checkbox */}
                  <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={cvDatabaseConsent}
                        onChange={(e) => setCvDatabaseConsent(e.target.checked)}
                      />
                      <span>
                        Autorizo a LUMINOUS a conservar o meu perfil na base de dados para futuras oportunidades em projetos industriais.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-btn form-btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="btn-spinner" />
                          <span>{t('forms.cvModal.submittingBtn', { defaultValue: 'A enviar candidatura...' })}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('forms.cvModal.submitBtn', { defaultValue: 'Enviar Currículo' })}</span>
                          <span className="btn-arrow">→</span>
                        </>
                      )}
                    </button>
                    <span className="form-secure-badge">🔒 {DESTINATION_EMAIL}</span>
                  </div>
                </form>
              )}

              {/* Contact Mode Form */}
              {mode === 'contact' && (
                <form className="form-grid-layout" onSubmit={handleContactSubmit} noValidate>
                  {/* Row 1: Name & Company */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="ct-name">{t('forms.contact.nameLabel')}</label>
                      <input
                        id="ct-name"
                        type="text"
                        required
                        value={ctName}
                        onChange={(e) => setCtName(e.target.value)}
                        placeholder={t('forms.contact.namePlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="ct-company">{t('forms.contact.companyLabel')}</label>
                      <input
                        id="ct-company"
                        type="text"
                        value={ctCompany}
                        onChange={(e) => setCtCompany(e.target.value)}
                        placeholder={t('forms.contact.companyPlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="form-row-2">
                    <div className="form-field-group">
                      <label htmlFor="ct-email">{t('forms.contact.emailLabel')}</label>
                      <input
                        id="ct-email"
                        type="email"
                        required
                        value={ctEmail}
                        onChange={(e) => setCtEmail(e.target.value)}
                        placeholder={t('forms.contact.emailPlaceholder')}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label htmlFor="ct-phone">{t('forms.contact.phoneLabel')}</label>
                      <input
                        id="ct-phone"
                        type="tel"
                        required
                        value={ctPhone}
                        onChange={(e) => setCtPhone(e.target.value)}
                        placeholder={t('forms.contact.phonePlaceholder')}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: Subject */}
                  <div className="form-field-group">
                    <label htmlFor="ct-subject">{t('forms.contact.subjectLabel')}</label>
                    <select
                      id="ct-subject"
                      required
                      value={ctSubject}
                      onChange={(e) => setCtSubject(e.target.value)}
                      className="form-select"
                    >
                      <option value="">{t('forms.contact.subjectPlaceholder')}</option>
                      <option value="Workforce Solutions">{t('forms.contact.subjectOptions.workforce')}</option>
                      <option value="Careers / CV">{t('forms.contact.subjectOptions.careers')}</option>
                      <option value="Partnerships">{t('forms.contact.subjectOptions.partnerships')}</option>
                      <option value="General Info">{t('forms.contact.subjectOptions.info')}</option>
                      <option value="Other">{t('forms.contact.subjectOptions.other')}</option>
                    </select>
                  </div>

                  {/* Row 4: Message */}
                  <div className="form-field-group">
                    <label htmlFor="ct-message">{t('forms.contact.messageLabel')}</label>
                    <textarea
                      id="ct-message"
                      rows={4}
                      required
                      value={ctMessage}
                      onChange={(e) => setCtMessage(e.target.value)}
                      placeholder={t('forms.contact.messagePlaceholder')}
                      className="form-textarea"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-btn form-btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="btn-spinner" />
                          <span>{t('forms.contact.submittingBtn')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('forms.contact.submitBtn')}</span>
                          <span className="btn-arrow">→</span>
                        </>
                      )}
                    </button>
                    <span className="form-secure-badge">🔒 {DESTINATION_EMAIL}</span>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div
          className="privacy-modal-overlay"
          onClick={() => setShowPrivacyModal(false)}
          role="dialog"
        >
          <div className="privacy-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="privacy-modal-header">
              <h3>Política de Privacidade & RGPD</h3>
              <button
                type="button"
                className="form-modal-close-btn"
                onClick={() => setShowPrivacyModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="privacy-modal-body">
              <p>
                Os dados pessoais fornecidos nesta candidatura serão tratados com total confidencialidade pela LUMINOUS para efeitos exclusivos de seleção e recrutamento técnico para projetos industriais de Oil & Gas e paragens de manutenção na Europa.
              </p>
              <p>
                Os seus dados não serão transmitidos a terceiros não autorizados. Poderá a qualquer momento solicitar o acesso, retificação ou eliminação dos seus dados enviando um e-mail para <strong>mkt@luminousalley.com</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
