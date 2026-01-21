// ============================================================================
// Stylescape | Notification Manager
// ============================================================================
// Toast notifications and alerts with stacking, positioning, and animations.
// Supports data-ss-notification attributes for declarative configuration.
// ============================================================================

/**
 * Notification types
 */
export type NotificationType = "success" | "error" | "warning" | "info"

/**
 * Notification position
 */
export type NotificationPosition =
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center"

/**
 * Single notification options
 */
export interface NotificationOptions {
    /** Notification type */
    type?: NotificationType
    /** Title text */
    title?: string
    /** Message text */
    message: string
    /** Auto-dismiss duration in ms (0 for manual) */
    duration?: number
    /** Allow manual close */
    closable?: boolean
    /** Icon class or SVG */
    icon?: string
    /** Custom CSS class */
    className?: string
    /** Action button text */
    actionText?: string
    /** Action button callback */
    onAction?: () => void
    /** Callback on close */
    onClose?: () => void
    /** Progress bar */
    showProgress?: boolean
}

/**
 * Global notification manager options
 */
export interface NotificationManagerOptions {
    /** Container position */
    position?: NotificationPosition
    /** Max visible notifications */
    maxNotifications?: number
    /** CSS class prefix */
    cssClass?: string
    /** Animation duration */
    animationDuration?: number
    /** Default duration for notifications */
    defaultDuration?: number
    /** Stack order: newest on top */
    newestOnTop?: boolean
    /** Pause on hover */
    pauseOnHover?: boolean
}

interface NotificationInstance {
    id: string
    element: HTMLElement
    options: NotificationOptions
    timeout: ReturnType<typeof setTimeout> | null
    startTime: number
    remainingTime: number
}

/**
 * Toast notification manager with stacking and animations.
 *
 * @example JavaScript
 * ```typescript
 * const notifications = new NotificationManager({
 *     position: "top-right",
 *     maxNotifications: 5
 * })
 *
 * notifications.success("File saved successfully!")
 * notifications.error("An error occurred", { duration: 5000 })
 * notifications.info("New update available", {
 *     actionText: "Update Now",
 *     onAction: () => window.location.reload()
 * })
 * ```
 *
 * @example HTML with data-ss (container)
 * ```html
 * <div data-ss="notification-container"
 *      data-ss-notification-position="top-right"
 *      data-ss-notification-max="5">
 * </div>
 * ```
 */
export class NotificationManager {
    private static instance: NotificationManager | null = null
    private container: HTMLElement | null = null
    private notifications: Map<string, NotificationInstance> = new Map()
    private options: Required<NotificationManagerOptions>

    constructor(options: NotificationManagerOptions = {}) {
        this.options = {
            position: options.position ?? "top-right",
            maxNotifications: options.maxNotifications ?? 5,
            cssClass: options.cssClass ?? "ss-notification",
            animationDuration: options.animationDuration ?? 300,
            defaultDuration: options.defaultDuration ?? 4000,
            newestOnTop: options.newestOnTop ?? true,
            pauseOnHover: options.pauseOnHover ?? true
        }

        this.createContainer()

        // Singleton pattern for global access
        if (!NotificationManager.instance) {
            NotificationManager.instance = this
        }
    }

    // ========================================================================
    // Public Methods - Shortcuts
    // ========================================================================

    /**
     * Show success notification
     */
    public success(message: string, options?: Partial<NotificationOptions>): string {
        return this.show({ ...options, message, type: "success" })
    }

    /**
     * Show error notification
     */
    public error(message: string, options?: Partial<NotificationOptions>): string {
        return this.show({ ...options, message, type: "error", duration: options?.duration ?? 0 })
    }

    /**
     * Show warning notification
     */
    public warning(message: string, options?: Partial<NotificationOptions>): string {
        return this.show({ ...options, message, type: "warning" })
    }

    /**
     * Show info notification
     */
    public info(message: string, options?: Partial<NotificationOptions>): string {
        return this.show({ ...options, message, type: "info" })
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Show a notification
     */
    public show(options: NotificationOptions): string {
        // Remove oldest if at max
        if (this.notifications.size >= this.options.maxNotifications) {
            const oldest = this.options.newestOnTop
                ? Array.from(this.notifications.keys()).pop()
                : Array.from(this.notifications.keys()).shift()
            if (oldest) this.dismiss(oldest)
        }

        const id = `notification-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const element = this.createNotification(id, options)
        const duration = options.duration ?? this.options.defaultDuration

        const instance: NotificationInstance = {
            id,
            element,
            options,
            timeout: null,
            startTime: Date.now(),
            remainingTime: duration
        }

        this.notifications.set(id, instance)

        // Add to container
        if (this.options.newestOnTop) {
            this.container?.prepend(element)
        } else {
            this.container?.appendChild(element)
        }

        // Trigger animation
        requestAnimationFrame(() => {
            element.classList.add(`${this.options.cssClass}--visible`)
        })

        // Auto-dismiss
        if (duration > 0) {
            instance.timeout = setTimeout(() => this.dismiss(id), duration)
        }

        return id
    }

    /**
     * Dismiss a notification by ID
     */
    public dismiss(id: string): void {
        const instance = this.notifications.get(id)
        if (!instance) return

        // Clear timeout
        if (instance.timeout) {
            clearTimeout(instance.timeout)
        }

        // Animate out
        instance.element.classList.remove(`${this.options.cssClass}--visible`)
        instance.element.classList.add(`${this.options.cssClass}--removing`)

        setTimeout(() => {
            instance.element.remove()
            this.notifications.delete(id)
            instance.options.onClose?.()
        }, this.options.animationDuration)
    }

    /**
     * Dismiss all notifications
     */
    public dismissAll(): void {
        this.notifications.forEach((_, id) => this.dismiss(id))
    }

    /**
     * Get notification count
     */
    public get count(): number {
        return this.notifications.size
    }

    /**
     * Destroy the manager
     */
    public destroy(): void {
        this.dismissAll()
        this.container?.remove()
        this.container = null
        if (NotificationManager.instance === this) {
            NotificationManager.instance = null
        }
    }

    // ========================================================================
    // Static Methods
    // ========================================================================

    /**
     * Get the global instance
     */
    public static getInstance(): NotificationManager {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager()
        }
        return NotificationManager.instance
    }

    /**
     * Initialize from data-ss="notification-container"
     */
    public static init(): NotificationManager {
        const container = document.querySelector<HTMLElement>('[data-ss="notification-container"]')

        return new NotificationManager({
            position: container?.dataset.ssNotificationPosition as NotificationPosition,
            maxNotifications: container?.dataset.ssNotificationMax
                ? parseInt(container.dataset.ssNotificationMax, 10)
                : undefined
        })
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private createContainer(): void {
        // Check for existing container
        this.container = document.querySelector<HTMLElement>(
            `[data-ss="notification-container"], .${this.options.cssClass}-container`
        )

        if (!this.container) {
            this.container = document.createElement("div")
            this.container.className = `${this.options.cssClass}-container`
            document.body.appendChild(this.container)
        }

        this.container.classList.add(`${this.options.cssClass}-container--${this.options.position}`)
        this.container.setAttribute("role", "region")
        this.container.setAttribute("aria-label", "Notifications")
        this.container.setAttribute("aria-live", "polite")
    }

    private createNotification(id: string, options: NotificationOptions): HTMLElement {
        const el = document.createElement("div")
        el.className = `${this.options.cssClass} ${this.options.cssClass}--${options.type || "info"}`
        if (options.className) {
            el.classList.add(options.className)
        }
        el.setAttribute("role", "alert")
        el.setAttribute("aria-live", "assertive")
        el.setAttribute("data-notification-id", id)

        // Icon
        const iconHtml = options.icon
            ? `<span class="${this.options.cssClass}__icon">${options.icon}</span>`
            : this.getDefaultIcon(options.type || "info")

        // Title
        const titleHtml = options.title
            ? `<div class="${this.options.cssClass}__title">${options.title}</div>`
            : ""

        // Action button
        const actionHtml = options.actionText
            ? `<button type="button" class="${this.options.cssClass}__action">${options.actionText}</button>`
            : ""

        // Close button
        const closeHtml = (options.closable !== false)
            ? `<button type="button" class="${this.options.cssClass}__close" aria-label="Close">&times;</button>`
            : ""

        // Progress bar
        const progressHtml = options.showProgress && (options.duration ?? this.options.defaultDuration) > 0
            ? `<div class="${this.options.cssClass}__progress"><div class="${this.options.cssClass}__progress-bar"></div></div>`
            : ""

        el.innerHTML = `
            ${iconHtml}
            <div class="${this.options.cssClass}__content">
                ${titleHtml}
                <div class="${this.options.cssClass}__message">${options.message}</div>
                ${actionHtml}
            </div>
            ${closeHtml}
            ${progressHtml}
        `

        // Event listeners
        const closeBtn = el.querySelector(`.${this.options.cssClass}__close`)
        closeBtn?.addEventListener("click", () => this.dismiss(id))

        const actionBtn = el.querySelector(`.${this.options.cssClass}__action`)
        actionBtn?.addEventListener("click", () => {
            options.onAction?.()
            this.dismiss(id)
        })

        // Pause on hover
        if (this.options.pauseOnHover) {
            el.addEventListener("mouseenter", () => this.pauseTimeout(id))
            el.addEventListener("mouseleave", () => this.resumeTimeout(id))
        }

        // Progress bar animation
        if (options.showProgress) {
            const duration = options.duration ?? this.options.defaultDuration
            const progressBar = el.querySelector<HTMLElement>(`.${this.options.cssClass}__progress-bar`)
            if (progressBar && duration > 0) {
                progressBar.style.transition = `width ${duration}ms linear`
                requestAnimationFrame(() => {
                    progressBar.style.width = "0%"
                })
            }
        }

        return el
    }

    private getDefaultIcon(type: NotificationType): string {
        const icons: Record<NotificationType, string> = {
            success: `<span class="${this.options.cssClass}__icon">✓</span>`,
            error: `<span class="${this.options.cssClass}__icon">✕</span>`,
            warning: `<span class="${this.options.cssClass}__icon">⚠</span>`,
            info: `<span class="${this.options.cssClass}__icon">ℹ</span>`
        }
        return icons[type]
    }

    private pauseTimeout(id: string): void {
        const instance = this.notifications.get(id)
        if (!instance || !instance.timeout) return

        clearTimeout(instance.timeout)
        instance.remainingTime -= Date.now() - instance.startTime

        // Pause progress bar
        const progressBar = instance.element.querySelector<HTMLElement>(
            `.${this.options.cssClass}__progress-bar`
        )
        if (progressBar) {
            const computed = getComputedStyle(progressBar)
            progressBar.style.width = computed.width
            progressBar.style.transition = "none"
        }
    }

    private resumeTimeout(id: string): void {
        const instance = this.notifications.get(id)
        if (!instance || instance.remainingTime <= 0) return

        instance.startTime = Date.now()
        instance.timeout = setTimeout(() => this.dismiss(id), instance.remainingTime)

        // Resume progress bar
        const progressBar = instance.element.querySelector<HTMLElement>(
            `.${this.options.cssClass}__progress-bar`
        )
        if (progressBar) {
            progressBar.style.transition = `width ${instance.remainingTime}ms linear`
            requestAnimationFrame(() => {
                progressBar.style.width = "0%"
            })
        }
    }
}

export default NotificationManager
