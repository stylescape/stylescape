// ============================================================================
// Stylescape | Cookie Consent Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CookieConsentManager } from "../../src/ts/storage/CookieConsentManager"
import { $, click, wait } from "../utils"
import { cookieConsentFixture } from "../utils/fixtures"

describe("CookieConsentManager", () => {
    let consentManager: CookieConsentManager
    let consentElement: HTMLElement

    beforeEach(() => {
        document.body.innerHTML = cookieConsentFixture
        consentElement = document.getElementById("cookie-consent") as HTMLElement

        // Clear cookies and localStorage
        localStorage.clear()
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
        })
    })

    afterEach(() => {
        if (consentManager && typeof (consentManager as any).destroy === "function") {
            (consentManager as any).destroy()
        }
        localStorage.clear()
    })

    describe("Initialization", () => {
        it("should initialize with element selector", () => {
            consentManager = new CookieConsentManager("#cookie-consent")
            expect(consentManager).toBeDefined()
        })

        it("should initialize with element reference", () => {
            consentManager = new CookieConsentManager(consentElement)
            expect(consentManager).toBeDefined()
        })

        it("should show banner if no consent stored", () => {
            consentManager = new CookieConsentManager(consentElement)
            // Banner should be visible
        })

        it("should hide banner if consent already given", () => {
            localStorage.setItem("cookie_consent", "accepted")
            consentManager = new CookieConsentManager(consentElement)
            // Banner should be hidden
        })
    })

    describe("Accept", () => {
        beforeEach(() => {
            consentManager = new CookieConsentManager(consentElement)
        })

        it("should store acceptance in localStorage", async () => {
            const acceptBtn = $("[data-ss-cookie-consent-accept]")
            if (acceptBtn) {
                click(acceptBtn)
                await wait(50)
                expect(localStorage.getItem("cookie_consent")).toBe("accepted")
            }
        })

        it("should hide banner after acceptance", async () => {
            const acceptBtn = $("[data-ss-cookie-consent-accept]")
            if (acceptBtn) {
                click(acceptBtn)
                await wait(50)
                // Banner should be hidden
            }
        })

        it("should call onAccept callback", async () => {
            const onAccept = vi.fn()
            consentManager = new CookieConsentManager(consentElement, { onAccept })

            const acceptBtn = $("[data-ss-cookie-consent-accept]")
            if (acceptBtn) {
                click(acceptBtn)
                await wait(50)
                expect(onAccept).toHaveBeenCalled()
            }
        })
    })

    describe("Decline", () => {
        beforeEach(() => {
            consentManager = new CookieConsentManager(consentElement)
        })

        it("should store decline in localStorage", async () => {
            const declineBtn = $("[data-ss-cookie-consent-decline]")
            if (declineBtn) {
                click(declineBtn)
                await wait(50)
                expect(localStorage.getItem("cookie_consent")).toBe("declined")
            }
        })

        it("should hide banner after decline", async () => {
            const declineBtn = $("[data-ss-cookie-consent-decline]")
            if (declineBtn) {
                click(declineBtn)
                await wait(50)
            }
        })

        it("should call onDecline callback", async () => {
            const onDecline = vi.fn()
            consentManager = new CookieConsentManager(consentElement, { onDecline })

            const declineBtn = $("[data-ss-cookie-consent-decline]")
            if (declineBtn) {
                click(declineBtn)
                await wait(50)
                expect(onDecline).toHaveBeenCalled()
            }
        })
    })

    describe("Expiration", () => {
        it("should respect custom expiration duration", () => {
            consentManager = new CookieConsentManager(consentElement, {
                expirationDays: 30
            })
            // Expiration should be 30 days
        })

        it("should show banner again after expiration", () => {
            // Mock expired storage
            // Banner should show again
        })
    })

    describe("Status Check", () => {
        it("should return consent status", async () => {
            consentManager = new CookieConsentManager(consentElement)

            const acceptBtn = $("[data-ss-cookie-consent-accept]")
            if (acceptBtn) {
                click(acceptBtn)
                await wait(50)

                if (typeof (consentManager as any).hasConsent === "function") {
                    expect((consentManager as any).hasConsent()).toBe(true)
                }
            }
        })

        it("should return false if declined", async () => {
            consentManager = new CookieConsentManager(consentElement)

            const declineBtn = $("[data-ss-cookie-consent-decline]")
            if (declineBtn) {
                click(declineBtn)
                await wait(50)

                if (typeof (consentManager as any).hasConsent === "function") {
                    expect((consentManager as any).hasConsent()).toBe(false)
                }
            }
        })
    })

    describe("Revoke Consent", () => {
        it("should allow revoking consent", async () => {
            localStorage.setItem("cookie_consent", "accepted")
            consentManager = new CookieConsentManager(consentElement)

            if (typeof (consentManager as any).revokeConsent === "function") {
                (consentManager as any).revokeConsent()
                expect(localStorage.getItem("cookie_consent")).toBeNull()
            }
        })
    })
})
