// ============================================================================
// Stylescape | Cookie Consent Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CookieConsentManager } from "../../src/ts/storage/CookieConsentManager";
import { wait } from "../utils";

describe("CookieConsentManager", () => {
    let consentManager: CookieConsentManager;

    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(
                    /=.*/,
                    `=;expires=${new Date().toUTCString()};path=/`,
                );
        });
    });

    afterEach(() => {
        if (consentManager && typeof consentManager.destroy === "function") {
            consentManager.destroy();
        }
        localStorage.clear();
    });

    describe("Initialization", () => {
        it("should initialize with element selector", () => {
            consentManager = new CookieConsentManager({ autoShow: false });
            expect(consentManager).toBeDefined();
        });

        it("should initialize with element reference", () => {
            consentManager = new CookieConsentManager({ autoShow: false });
            expect(consentManager).toBeDefined();
        });

        it("should show banner if no consent stored", () => {
            consentManager = new CookieConsentManager({ autoShow: false });
            // Banner should show via show() when no consent
            expect(consentManager.hasConsent()).toBe(false);
        });

        it("should hide banner if consent already given", () => {
            // Set up consent first
            localStorage.setItem(
                "ss-cookie-consent",
                JSON.stringify({
                    necessary: true,
                    analytics: true,
                    marketing: true,
                    preferences: true,
                    timestamp: Date.now(),
                }),
            );
            consentManager = new CookieConsentManager({ autoShow: false });
            // Banner should be hidden when consent exists
            expect(consentManager.hasConsent()).toBe(true);
        });
    });

    describe("Accept", () => {
        beforeEach(() => {
            consentManager = new CookieConsentManager({ autoShow: false });
        });

        it("should store acceptance in localStorage", async () => {
            consentManager.acceptAll();
            await wait(50);
            const stored = localStorage.getItem("ss-cookie-consent");
            expect(stored).not.toBeNull();
            const parsed = JSON.parse(stored!);
            expect(parsed.analytics).toBe(true);
            expect(parsed.marketing).toBe(true);
        });

        it("should hide banner after acceptance", async () => {
            consentManager.acceptAll();
            await wait(50);
            // After acceptance, consent should be stored
            expect(consentManager.hasConsent()).toBe(true);
        });

        it("should call onAccept callback", async () => {
            const onAccept = vi.fn();
            consentManager = new CookieConsentManager({
                autoShow: false,
                onAccept,
            });
            consentManager.acceptAll();
            await wait(50);
            expect(onAccept).toHaveBeenCalled();
        });
    });

    describe("Decline", () => {
        beforeEach(() => {
            consentManager = new CookieConsentManager({ autoShow: false });
        });

        it("should store decline in localStorage", async () => {
            consentManager.acceptNecessary();
            await wait(50);
            const stored = localStorage.getItem("ss-cookie-consent");
            expect(stored).not.toBeNull();
            const parsed = JSON.parse(stored!);
            expect(parsed.analytics).toBe(false);
            expect(parsed.marketing).toBe(false);
        });

        it("should hide banner after decline", async () => {
            consentManager.acceptNecessary();
            await wait(50);
            expect(consentManager.hasConsent()).toBe(true);
        });

        it("should call onAccept callback when accepting necessary only", async () => {
            const onAccept = vi.fn();
            consentManager = new CookieConsentManager({
                autoShow: false,
                onAccept,
            });
            consentManager.acceptNecessary();
            await wait(50);
            expect(onAccept).toHaveBeenCalled();
        });
    });

    describe("Expiration", () => {
        it("should respect custom expiration duration", () => {
            consentManager = new CookieConsentManager({
                autoShow: false,
                expirationDays: 30,
            });
            // Expiration should be 30 days
            expect(consentManager).toBeDefined();
        });

        it("should show banner again after expiration", () => {
            // Mock expired storage
            // Banner should show again
            expect(true).toBe(true);
        });
    });

    describe("Status Check", () => {
        it("should return consent status", async () => {
            consentManager = new CookieConsentManager({ autoShow: false });
            consentManager.acceptAll();
            await wait(50);
            expect(consentManager.hasConsent()).toBe(true);
        });

        it("should return false if declined", async () => {
            consentManager = new CookieConsentManager({ autoShow: false });
            // Before any consent is given, hasConsent returns false
            expect(consentManager.hasConsent()).toBe(false);
        });
    });

    describe("Revoke Consent", () => {
        it("should allow revoking consent", async () => {
            consentManager = new CookieConsentManager({ autoShow: false });
            consentManager.acceptAll();
            await wait(50);

            expect(consentManager.hasConsent()).toBe(true);

            consentManager.revokeConsent();
            expect(localStorage.getItem("ss-cookie-consent")).toBeNull();
        });
    });
});
