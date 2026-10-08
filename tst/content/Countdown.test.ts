// ============================================================================
// Stylescape | Countdown Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Countdown } from "../../src/ts/content/Countdown";

const LIVE = `
<span class="ss-c-countdown" id="cd" data-countdown-seconds="3725">
    <span data-unit="hours"></span>:<span data-unit="minutes"></span>:<span data-unit="seconds"></span>
</span>
`;

describe("Countdown", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
        document.body.innerHTML = LIVE;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const el = () => document.getElementById("cd") as HTMLElement;
    const unit = (name: string) =>
        el().querySelector<HTMLElement>(`[data-unit="${name}"]`)!;

    it("writes the digit values as custom properties", () => {
        Countdown.init(el());
        expect(
            unit("hours").style.getPropertyValue("--ss-countdown-value"),
        ).toBe("1");
        expect(
            unit("minutes").style.getPropertyValue("--ss-countdown-value"),
        ).toBe("2");
        expect(
            unit("seconds").style.getPropertyValue("--ss-countdown-value"),
        ).toBe("5");
    });

    it("gives the container role=timer and a readable label", () => {
        Countdown.init(el());
        expect(el().getAttribute("role")).toBe("timer");
        expect(el().getAttribute("aria-label")).toBe(
            "1 hour, 2 minutes, 5 seconds",
        );
    });

    it("hides the digit columns and never labels a role-less span", () => {
        Countdown.init(el());
        el()
            .querySelectorAll<HTMLElement>("[data-unit]")
            .forEach((u) => {
                expect(u.getAttribute("aria-hidden")).toBe("true");
                expect(u.hasAttribute("aria-label")).toBe(false);
            });
    });

    it("keeps an author-supplied role", () => {
        el().setAttribute("role", "status");
        Countdown.init(el());
        expect(el().getAttribute("role")).toBe("status");
    });

    it("updates the label every second and fires finished at zero", () => {
        document.body.innerHTML = `
            <span class="ss-c-countdown" id="cd" data-countdown-seconds="2">
                <span data-unit="seconds"></span>
            </span>`;
        const finished = vi.fn();
        el().addEventListener("ss:countdown:finished", finished);

        Countdown.init(el());
        expect(el().getAttribute("aria-label")).toBe("2 seconds");

        vi.advanceTimersByTime(1000);
        expect(el().getAttribute("aria-label")).toBe("1 second");

        vi.advanceTimersByTime(1000);
        expect(el().getAttribute("aria-label")).toBe("0 seconds");
        expect(finished).toHaveBeenCalledTimes(1);
    });

    it("leaves static countdowns without data attributes untouched", () => {
        document.body.innerHTML = `<span class="ss-c-countdown" id="cd"><span data-unit="hours"></span></span>`;
        Countdown.initAll();
        expect(el().hasAttribute("role")).toBe(false);
        expect(unit("hours").hasAttribute("aria-hidden")).toBe(false);
    });
});
