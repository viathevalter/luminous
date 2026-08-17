import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

// Configure default WhatsApp number (international format without + or spaces)
// You can change this number anytime to connect your commercial WhatsApp
export const LUMINOUS_WHATSAPP_NUMBER = '351912345678'

interface ChatOption {
  label: string
  value: string
}

interface Message {
  id: string
  sender: 'bot' | 'user'
  text: string
  options?: ChatOption[]
  isHtml?: boolean
  whatsappLink?: string
  whatsappButtonText?: string
}

type FlowType = 'idle' | 'b2b' | 'b2c' | 'contact'

export function ChatWidget() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  
  const [flow, setFlow] = useState<FlowType>('idle')
  const [step, setStep] = useState<string>('welcome')
  const [collectedData, setCollectedData] = useState<{
    sector?: string
    role?: string
    contact?: string
    message?: string
  }>({})

  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll smoothly to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Show teaser bubble after 3 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setShowTeaser(true)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [hasInteracted, isOpen])

  // Helper to construct WhatsApp link
  const createWhatsAppLink = (customText?: string) => {
    const defaultText = t('chat.whatsappDirectMsg', {
      defaultValue: 'Olá! Gostaria de falar com um especialista da Luminous sobre soluções de mão de obra industrial.'
    })
    const textToSend = customText || defaultText
    return `https://wa.me/${LUMINOUS_WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`
  }

  // Helper to add bot message with typing delay
  const pushBotMessage = (
    text: string,
    options?: ChatOption[],
    whatsappAction?: { link: string; label: string },
    delay = 600
  ) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'bot',
          text,
          options,
          whatsappLink: whatsappAction?.link,
          whatsappButtonText: whatsappAction?.label,
        },
      ])
    }, delay)
  }

  // Initial welcome sequence
  const startWelcomeSequence = () => {
    setMessages([])
    setFlow('idle')
    setStep('welcome')
    setCollectedData({})

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const welcome1: Message = {
        id: 'w1',
        sender: 'bot',
        text: t('chat.welcome1'),
      }
      setMessages([welcome1])

      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const welcome2: Message = {
            id: 'w2',
            sender: 'bot',
            text: t('chat.welcome2'),
          }
          const welcomePrompt: Message = {
            id: 'w3',
            sender: 'bot',
            text: t('chat.welcomePrompt'),
            options: [
              { label: t('chat.optWorkforce'), value: 'b2b' },
              { label: t('chat.optCareers'), value: 'b2c' },
              { label: t('chat.optWhatsapp'), value: 'whatsapp' },
              { label: t('chat.optOther'), value: 'contact' },
            ],
          }
          setMessages((prev) => [...prev, welcome2, welcomePrompt])
        }, 600)
      }, 500)
    }, 400)
  }

  // Open chat and trigger welcome if empty
  const handleOpenChat = () => {
    setIsOpen(true)
    setShowTeaser(false)
    setHasInteracted(true)
    if (messages.length === 0) {
      startWelcomeSequence()
    }
    setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
  }

  // Reset when language changes
  useEffect(() => {
    if (isOpen && messages.length > 0 && step === 'welcome') {
      startWelcomeSequence()
    }
  }, [i18n.language])

  // Handle option button click
  const handleOptionClick = (option: ChatOption) => {
    // Add user reply
    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: option.label,
    }
    setMessages((prev) => {
      // Clear options from previous message to keep UI clean
      const cleaned = prev.map((m) => ({ ...m, options: undefined }))
      return [...cleaned, userMsg]
    })

    // Process selection
    if (option.value === 'restart') {
      startWelcomeSequence()
      return
    }

    if (option.value === 'whatsapp') {
      const waLink = createWhatsAppLink()
      window.open(waLink, '_blank', 'noopener,noreferrer')
      pushBotMessage(
        t('chat.whatsappDirectMsg'),
        [{ label: t('chat.restartBtn'), value: 'restart' }],
        { link: waLink, label: t('chat.talkWhatsappBtn') }
      )
      return
    }

    // B2B Flow: Request Workforce
    if (option.value === 'b2b') {
      setFlow('b2b')
      setStep('b2b_sector')
      pushBotMessage(
        t('chat.b2bStepSector'),
        [
          { label: `🛢️ ${t('chat.sectors.oilGas')}`, value: 'sector_oil_gas' },
          { label: `🧪 ${t('chat.sectors.petro')}`, value: 'sector_petro' },
          { label: `🏭 ${t('chat.sectors.refinery')}`, value: 'sector_refinery' },
          { label: `⚡ ${t('chat.sectors.energy')}`, value: 'sector_energy' },
          { label: `🚢 ${t('chat.sectors.shipyard')}`, value: 'sector_shipyard' },
          { label: `⚙️ ${t('chat.sectors.other')}`, value: 'sector_other' },
        ]
      )
      return
    }

    if (flow === 'b2b' && step === 'b2b_sector') {
      setCollectedData((prev) => ({ ...prev, sector: option.label }))
      setStep('b2b_role')
      pushBotMessage(
        t('chat.b2bStepRole'),
        [
          { label: `🔥 ${t('chat.roles.welders')}`, value: 'role_welders' },
          { label: `🔧 ${t('chat.roles.pipefitters')}`, value: 'role_pipefitters' },
          { label: `🔩 ${t('chat.roles.boilermakers')}`, value: 'role_boilermakers' },
          { label: `⚙️ ${t('chat.roles.mechanics')}`, value: 'role_mechanics' },
          { label: `⚡ ${t('chat.roles.electricians')}`, value: 'role_electricians' },
          { label: `👷 ${t('chat.roles.supervisors')}`, value: 'role_supervisors' },
          { label: `🛠️ ${t('chat.roles.otherRole')}`, value: 'role_other' },
        ]
      )
      return
    }

    if (flow === 'b2b' && step === 'b2b_role') {
      setCollectedData((prev) => ({ ...prev, role: option.label }))
      setStep('b2b_contact')
      pushBotMessage(t('chat.b2bStepContact'))
      return
    }

    // B2C Flow: Careers / Candidates
    if (option.value === 'b2c') {
      setFlow('b2c')
      setStep('b2c_role')
      pushBotMessage(
        t('chat.b2cStepRole'),
        [
          { label: `🔥 ${t('chat.roles.welders')}`, value: 'cand_welders' },
          { label: `🔧 ${t('chat.roles.pipefitters')}`, value: 'cand_pipefitters' },
          { label: `🔩 ${t('chat.roles.boilermakers')}`, value: 'cand_boilermakers' },
          { label: `⚙️ ${t('chat.roles.mechanics')}`, value: 'cand_mechanics' },
          { label: `⚡ ${t('chat.roles.electricians')}`, value: 'cand_electricians' },
          { label: `👷 ${t('chat.roles.supervisors')}`, value: 'cand_supervisors' },
          { label: `🛠️ ${t('chat.roles.otherRole')}`, value: 'cand_other' },
        ]
      )
      return
    }

    if (flow === 'b2c' && step === 'b2c_role') {
      setCollectedData((prev) => ({ ...prev, role: option.label }))
      setStep('b2c_contact')
      pushBotMessage(t('chat.b2cStepContact'))
      return
    }

    // Contact / Other Flow
    if (option.value === 'contact') {
      setFlow('contact')
      setStep('contact_msg')
      pushBotMessage(t('chat.contactStepMsg'))
      return
    }
  }

  // Handle user typing submit
  const handleTextSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = inputValue.trim()
    if (!text || isTyping) return

    setInputValue('')
    const userMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
    }

    setMessages((prev) => {
      const cleaned = prev.map((m) => ({ ...m, options: undefined }))
      return [...cleaned, userMsg]
    })

    // Handle states
    if (flow === 'b2b' && step === 'b2b_contact') {
      const updated = { ...collectedData, contact: text }
      setCollectedData(updated)
      setStep('done')

      const waSummary = `*Solicitação de Profissionais — Luminous*\n\n🏢 *Setor:* ${updated.sector || 'Não especificado'}\n👷 *Especialidade:* ${updated.role || 'Diversos'}\n👤 *Contato:* ${text}`
      const waLink = createWhatsAppLink(waSummary)

      pushBotMessage(
        t('chat.b2bSuccess'),
        [{ label: t('chat.restartBtn'), value: 'restart' }],
        { link: waLink, label: t('chat.b2bWhatsappCta') }
      )
      return
    }

    if (flow === 'b2c' && step === 'b2c_contact') {
      const updated = { ...collectedData, contact: text }
      setCollectedData(updated)
      setStep('done')

      const waSummary = `*Candidatura / Banco de Talentos — Luminous*\n\n🛠️ *Especialidade:* ${updated.role || 'Geral'}\n👤 *Candidato / WhatsApp:* ${text}`
      const waLink = createWhatsAppLink(waSummary)

      pushBotMessage(
        t('chat.b2cSuccess'),
        [{ label: t('chat.restartBtn'), value: 'restart' }],
        { link: waLink, label: t('chat.b2cWhatsappCta') }
      )
      return
    }

    if (flow === 'contact' && step === 'contact_msg') {
      setStep('done')
      const waSummary = `*Contacto Geral — Luminous*\n\n📝 *Mensagem:* ${text}`
      const waLink = createWhatsAppLink(waSummary)

      pushBotMessage(
        t('chat.contactSuccess'),
        [{ label: t('chat.restartBtn'), value: 'restart' }],
        { link: waLink, label: t('chat.talkWhatsappBtn') }
      )
      return
    }

    // Default free-text fallback
    const waLink = createWhatsAppLink(`*Mensagem via Chat Luminous:* ${text}`)
    pushBotMessage(
      t('chat.freeTextReply'),
      [
        { label: t('chat.optWorkforce'), value: 'b2b' },
        { label: t('chat.optCareers'), value: 'b2c' },
        { label: t('chat.optWhatsapp'), value: 'whatsapp' },
      ],
      { link: waLink, label: t('chat.talkWhatsappBtn') }
    )
  }

  // Format bold text safely without heavy dependencies
  const renderMessageContent = (rawText: string) => {
    const parts = rawText.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="luminous-chat-widget" aria-label="Luminous Online Chat">
      {/* Teaser Bubble for first-time visitors */}
      {showTeaser && !isOpen && (
        <div className="chat-teaser-bubble">
          <div className="chat-teaser-content" onClick={handleOpenChat}>
            <span className="chat-teaser-avatar">
              <img src="/assets/logo/luminous-logo.svg" alt="Lumi" />
            </span>
            <div className="chat-teaser-text">
              <strong>Lumi</strong>
              <p>{t('chat.tooltip')}</p>
            </div>
          </div>
          <button
            className="chat-teaser-close"
            onClick={(e) => {
              e.stopPropagation()
              setShowTeaser(false)
            }}
            aria-label="Close message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        className={`chat-launcher-btn ${isOpen ? 'active' : ''}`}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
          } else {
            handleOpenChat()
          }
        }}
        aria-label={isOpen ? t('chat.closeChat') : t('chat.openChat')}
        title={isOpen ? t('chat.closeChat') : t('chat.openChat')}
      >
        <div className="chat-launcher-icon-wrap">
          {isOpen ? (
            <svg className="chat-icon-close" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <>
              <svg className="chat-icon-msg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span className="chat-online-badge" />
            </>
          )}
        </div>
      </button>

      {/* Chat Window */}
      <div className={`chat-window-container ${isOpen ? 'is-open' : ''}`}>
        {/* Header */}
        <div className="chat-header-bar">
          <div className="chat-header-agent">
            <div className="chat-header-avatar">
              <img src="/assets/logo/luminous-logo.svg" alt="Lumi" />
              <span className="chat-header-dot" />
            </div>
            <div className="chat-header-details">
              <div className="chat-agent-name">
                {t('chat.botName')}
                <span className="chat-verified-badge" title="Atendente Oficial Luminous">✓</span>
              </div>
              <div className="chat-agent-status">
                <span className="pulse-dot" />
                {t('chat.onlineStatus')}
              </div>
            </div>
          </div>

          <div className="chat-header-actions">
            {/* Direct WhatsApp Action in Header */}
            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="chat-header-wa-btn"
              title="Abrir no WhatsApp"
              aria-label="Abrir no WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.488-.893-.796-1.496-1.78-1.671-2.08-.175-.3-.019-.462.13-.611.136-.134.301-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.583-.492-.504-.675-.513l-.575-.01c-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.899 1.225 3.1c.15.2 2.115 3.23 5.124 4.53 3.01 1.3 3.01.867 3.56.812.55-.054 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.429-.075-.125-.275-.2-.575-.35z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.382A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.136 8.136 0 0 1-4.32-1.233l-.31-.184-2.96.82.804-2.883-.202-.32A8.135 8.135 0 0 1 3.818 12C3.818 7.489 7.489 3.818 12 3.818c4.511 0 8.182 3.67 8.182 8.182 0 4.511-3.67 8.182-8.182 8.182z" />
              </svg>
            </a>

            {/* Close Button */}
            <button
              className="chat-header-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={t('chat.closeChat')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="chat-messages-body">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <div className="chat-bubble-bot-avatar">
                  <img src="/assets/logo/luminous-logo.svg" alt="Lumi" />
                </div>
              )}
              <div className="chat-bubble-content">
                <div className="chat-bubble-text">
                  {renderMessageContent(msg.text)}
                </div>

                {/* WhatsApp Action Button if provided */}
                {msg.whatsappLink && (
                  <div className="chat-whatsapp-action-wrap">
                    <a
                      href={msg.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-whatsapp-action-btn"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                      </svg>
                      <span>{msg.whatsappButtonText || t('chat.talkWhatsappBtn')}</span>
                    </a>
                  </div>
                )}

                {/* Quick Selection Options / Chips */}
                {msg.options && msg.options.length > 0 && (
                  <div className="chat-options-grid">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        className="chat-chip-btn"
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble-row bot">
              <div className="chat-bubble-bot-avatar">
                <img src="/assets/logo/luminous-logo.svg" alt="Lumi" />
              </div>
              <div className="chat-typing-bubble">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <form className="chat-input-form" onSubmit={handleTextSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chat-text-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chat.inputPlaceholder')}
            disabled={isTyping}
          />
          <button
            type="submit"
            className="chat-send-action-btn"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Enviar"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

        {/* Micro branding footer */}
        <div className="chat-sub-footer">
          <span>Luminous International Workforce • 24/7 Operations</span>
        </div>
      </div>
    </div>
  )
}
