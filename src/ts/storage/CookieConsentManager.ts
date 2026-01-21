// ============================================================================
// Stylescape | Cookie Consent Manager
// ============================================================================
// GDPR-compliant cookie consent management with granular category control.
// Supports data-ss-cookie-consent attributes for declarative configuration.
// ============================================================================

/**
 * Cookie categories for granular consent
 */
export type CookieCategory = "necessary" | "analytics" | "marketing" | "preferences"

/**
 * Consent state for all categories
 */
export interface ConsentState {
    necessary: boolean
    analytics: boolean
    marketing: boolean
    preferences: boolean
    timestamp?: number
}

/**
 * Configuration options for CookieConsentManager
 */
export interface CookieConsentOptions {
    /** Main message text */
    message?: string
    /** Accept all button text */
    acceptAllText?: string
    /** Accept necessary only button text */
    acceptNecessaryText?: string
    /** Settings button text */
    settingsText?: string
    /** CSS class prefix */
    cssClass?: string
    /** Storage key */
    storageKey?: string
    /** Position on screen */
    position?: "top" | "bottom" | "center"
    /** Cookie categories to show */
    categories?: CookieCategory[]
    /** Link to privacy policy */
    privacyPolicyUrl?: string
    /** Days until consent expires */
    expirationDays?: number
    /** Callback when consent is given */
    onAccept?: (consent: ConsentState) => void
    /** Callback when consent changes */
    onChange?: (consent: ConsentState) => void
    /** Auto-show banner if no consent */
    autoShow?: boolean
    /** Show detailed settings panel */
    showSettings?: boolean
}

/**
 * GDPR-compliant cookie consent manager with category support.
 *
 * @example JavaScript
 * ```typescript
 * const consent = new CookieConsentManager({
 *     categories: ["necessary", "analytics", "marketing"],
 *     onAccept: (state) => {
 *         if (state.analytics) initAnalytics()
 *         if (state.marketing) initMarketing()
 *     }
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="cookie-consent"
 *      data-ss-cookie-position="bottom"
 *      data-ss-cookie-privacy-url="/privacy">
 * </div>
 *
 * <!-- Or use in scripts -->
 * <script data-ss-cookie-category="analytics" src="analytics.js"></script>
 * ```
 */
export class CookieConsentManager {
    private options: Required<Omit<CookieConsentOptions, "onAccept" | "onChange">> &
                     Pick<CookieConsentOptions, "onAccept" | "onChange">
    private bannerElement: HTMLElement | null = null
    private settingsPanel: HTMLElement | null = null
    private consentState: ConsentState

    constructor(options: CookieConsentOptions = {}) {
        this.options = {
            message: options.message ?? "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
            acceptAllText: options.acceptAllText ?? "Accept All",
            acceptNecessaryText: options.acceptNecessaryText ?? "Necessary Only",
            settingsText: options.settingsText ?? "Cookie Settings",
            cssClass: options.cssClass ?? "ss-cookie-consent",
            storageKey: options.storageKey ?? "ss-cookie-consent",
            position: options.position ?? "bottom",
            categories: options.categories ?? ["necessary", "analytics", "marketing", "preferences"],
            privacyPolicyUrl: options.privacyPolicyUrl ?? "",
            expirationDays: options.expirationDays ?? 365,
            onAccept: options.onAccept,
            onChange: options.onChange,
            autoShow: options.autoShow ?? true,
            showSettings: options.showSettings ?? true
        }

        // Load existing consent or set defaults
        this.consentState = this.loadConsent() ?? {
            necessary: true,  // Always required
            analytics: false,
            marketing: false,
            preferences: false
        }

        if (this.options.autoShow && !this.hasConsent()) {
            this.show()
        }
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Check if user has given consent
     */
    public hasConsent(): boolean {
        return this.loadConsent() !== null
    }

    /**
     * Get current consent state
     */
    public getConsent(): ConsentState {
        return { ...this.consentState }
    }

    /**
     * Check if a specific category is allowed
     */
    public isAllowed(category: CookieCategory): boolean {
        return this.consentState[category] ?? false
    }

    /**
     * Accept all cookies
     */
    public acceptAll(): void {
        this.consentState = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
            timestamp: Date.now()
        }
        this.saveConsent()
        this.hide()
        this.options.onAccept?.(this.consentState)
        this.activateCategoryScripts()
    }

    /**
     * Accept only necessary cookies
     */
    public acceptNecessary(): void {
        this.consentState = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
            timestamp: Date.now()
        }
        this.saveConsent()
        this.hide()
        this.options.onAccept?.(this.consentState)
    }

    /**
     * Save custom consent selection
     */
    public saveCustomConsent(consent: Partial<ConsentState>): void {
        this.consentState = {
            necessary: true,  // Always required
            analytics: consent.analytics ?? false,
            marketing: consent.marketing ?? false,
            preferences: consent.preferences ?? false,
            timestamp: Date.now()
        }
        this.saveConsent()
        this.hide()
        this.options.onAccept?.(this.consentState)
        this.options.onChange?.(this.consentState)
        this.activateCategoryScripts()
    }

    /**
     * Revoke consent and show banner again
     */
    public revokeConsent(): void {
        localStorage.removeItem(this.options.storageKey)
        this.consentState = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        }
        this.show()
    }

    /**
     * Show the consent banner
     */
    public show(): void {
        if (this.bannerElement) {
            this.bannerElement.style.display = "block"
            return
        }

        this.createBanner()
    }

    /**
     * Hide the consent banner
     */
    public hide(): void {
        if (this.bannerElement) {
            this.bannerElement.style.display = "none"
        }
        this.hideSettings()
    }

    /**
     * Show settings panel
     */
    public showSettings(): void {
        if (!this.settingsPanel) {
            this.createSettingsPanel()
        }
        if (this.settingsPanel) {
            this.settingsPanel.style.display = "block"
        }
    }

    /**
     * Hide settings panel
     */
    public hideSettings(): void {
        if (this.settingsPanel) {
            this.settingsPanel.style.display = "none"
        }
    }

    /**
     * Destroy the manager and remove elements
     */
    public destroy(): void {
        this.bannerElement?.remove()
        this.settingsPanel?.remove()
        this.bannerElement = null
        this.settingsPanel = null
    }

    // ========================================================================
    // Static Factory
    // ========================================================================

    /**
     * Initialize from data-ss="cookie-consent" element
     */
    public static init(): CookieConsentManager | null {
        const element = document.querySelector<HTMLElement>('[data-ss="cookie-consent"]')

        if (!element) {
            return new CookieConsentManager()
        }

        return new CookieConsentManager({
            message: element.dataset.ssCookieMessage,
            position: element.dataset.ssCookiePosition as "top" | "bottom" | "center",
            privacyPolicyUrl: element.dataset.ssCookiePrivacyUrl,
            cssClass: element.dataset.ssCookieClass,
            showSettings: element.dataset.ssCookieShowSettings !== "false"
        })
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private loadConsent(): ConsentState | null {
        try {
            const stored = localStorage.getItem(this.options.storageKey)
            if (!stored) return null

            const consent = JSON.parse(stored) as ConsentState

            // Check expiration
            if (consent.timestamp) {
                const expirationMs = this.options.expirationDays * 24 * 60 * 60 * 1000
                if (Date.now() - consent.timestamp > expirationMs) {
                    localStorage.removeItem(this.options.storageKey)
                    return null
                }
            }

            return consent
        } catch {
            return null
        }
    }

    private saveConsent(): void {
        localStorage.setItem(this.options.storageKey, JSON.stringify(this.consentState))
    }

    private createBanner(): void {
        const banner = document.createElement("div")
        banner.className = `${this.options.cssClass} ${this.options.cssClass}--${this.options.position}`
        banner.setAttribute("role", "dialog")
        banner.setAttribute("aria-label", "Cookie Consent")
        banner.setAttribute("aria-describedby", `${this.options.cssClass}-message`)

        const privacyLink = this.options.privacyPolicyUrl
            ? `<a href="${this.options.privacyPolicyUrl}" class="${this.options.cssClass}__link">Privacy Policy</a>`
            : ""

        banner.innerHTML = `
            <div class="${this.options.cssClass}__content">
                <p id="${this.options.cssClass}-message" class="${this.options.cssClass}__message">
                    ${this.options.message}
                    ${privacyLink}
                </p>
                <div class="${this.options.cssClass}__actions">
                    ${this.options.showSettings
                        ? `<button type="button" class="${this.options.cssClass}__btn ${this.options.cssClass}__btn--settings">
                               ${this.options.settingsText}
                           </button>`
                        : ""}
                    <button type="button" class="${this.options.cssClass}__btn ${this.options.cssClass}__btn--necessary">
                        ${this.options.acceptNecessaryText}
                    </button>
                    <button type="button" class="${this.options.cssClass}__btn ${this.options.cssClass}__btn--accept">
                        ${this.options.acceptAllText}
                    </button>
                </div>
            </div>
        `

        document.body.appendChild(banner)
        this.bannerElement = banner

        // Add event listeners
        banner.querySelector(`.${this.options.cssClass}__btn--accept`)
            ?.addEventListener("click", () => this.acceptAll())
        banner.querySelector(`.${this.options.cssClass}__btn--necessary`)
            ?.addEventListener("click", () => this.acceptNecessary())
        banner.querySelector(`.${this.options.cssClass}__btn--settings`)
            ?.addEventListener("click", () => this.showSettings())
    }

    private createSettingsPanel(): void {
        const panel = document.createElement("div")
        panel.className = `${this.options.cssClass}-settings`
        panel.setAttribute("role", "dialog")
        panel.setAttribute("aria-label", "Cookie Settings")

        const categoryLabels: Record<CookieCategory, { title: string; description: string }> = {
            necessary: {
                title: "Necessary Cookies",
                description: "Required for the website to function properly. Cannot be disabled."
            },
            analytics: {
                title: "Analytics Cookies",
                description: "Help us understand how visitors interact with our website."
            },
            marketing: {
                title: "Marketing Cookies",
                description: "Used to track visitors across websites for advertising purposes."
            },
            preferences: {
                title: "Preference Cookies",
                description: "Allow the website to remember choices you make."
            }
        }

        const categoriesHtml = this.options.categories.map((cat) => {
            const info = categoryLabels[cat]
            const isNecessary = cat === "necessary"
            const isChecked = this.consentState[cat]

            return `
                <div class="${this.options.cssClass}-settings__category">
                    <label class="${this.options.cssClass}-settings__label">
                        <input type="checkbox"
                               name="${cat}"
                               ${isChecked ? "checked" : ""}
                               ${isNecessary ? "disabled" : ""}>
                        <span class="${this.options.cssClass}-settings__title">${info.title}</span>
                    </label>
                    <p class="${this.options.cssClass}-settings__description">${info.description}</p>
                </div>
            `
        }).join("")

        panel.innerHTML = `
            <div class="${this.options.cssClass}-settings__overlay"></div>
            <div class="${this.options.cssClass}-settings__panel">
                <h2 class="${this.options.cssClass}-settings__heading">Cookie Settings</h2>
                <div class="${this.options.cssClass}-settings__categories">
                    ${categoriesHtml}
                </div>
                <div class="${this.options.cssClass}-settings__actions">
                    <button type="button" class="${this.options.cssClass}-settings__btn--cancel">Cancel</button>
                    <button type="button" class="${this.options.cssClass}-settings__btn--save">Save Preferences</button>
                </div>
            </div>
        `

        document.body.appendChild(panel)
        this.settingsPanel = panel

        // Event listeners
        panel.querySelector(`.${this.options.cssClass}-settings__btn--cancel`)
            ?.addEventListener("click", () => this.hideSettings())
        panel.querySelector(`.${this.options.cssClass}-settings__overlay`)
            ?.addEventListener("click", () => this.hideSettings())
        panel.querySelector(`.${this.options.cssClass}-settings__btn--save`)
            ?.addEventListener("click", () => this.saveFromSettings())
    }

    private saveFromSettings(): void {
        if (!this.settingsPanel) return

        const checkboxes = this.settingsPanel.querySelectorAll<HTMLInputElement>("input[type='checkbox']")
        const consent: Partial<ConsentState> = { necessary: true }

        checkboxes.forEach((checkbox) => {
            const category = checkbox.name as CookieCategory
            consent[category] = checkbox.checked
        })

        this.saveCustomConsent(consent)
    }

    private activateCategoryScripts(): void {
        // Activate scripts based on consent
        document.querySelectorAll<HTMLScriptElement>("script[data-ss-cookie-category]").forEach((script) => {
            const category = script.dataset.ssCookieCategory as CookieCategory
            if (this.isAllowed(category) && !script.dataset.ssCookieActivated) {
                const newScript = document.createElement("script")
                newScript.src = script.src
                newScript.dataset.ssCookieActivated = "true"
                document.head.appendChild(newScript)
            }
        })
    }
}

export default CookieConsentManager
