// ============================================================================
// Stylescape | Countdown Timer Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CountdownTimer } from "../../src/ts/animations/CountdownTimer";

const BASE = new Date("2026-01-01T00:00:00.000Z").getTime();
const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("CountdownTimer", () => {
    let timer: CountdownTimer | undefined;
    let el: HTMLElement;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(BASE);
        el = document.createElement("div");
        el.id = "cd";
        document.body.appendChild(el);
    });

    afterEach(() => {
        if (timer) {
            timer.destroy();
            timer = undefined;
        }
        vi.useRealTimers();
    });

    // ------------------------------------------------------------------
    // Construction
    // ------------------------------------------------------------------
    describe("Construction", () => {
        it("resolves a CSS selector and renders an initial display", () => {
            timer = new CountdownTimer("#cd", { endTime: BASE + 5 * SEC });
            expect(el.textContent).toBe("00:00:05");
        });

        it("accepts an HTMLElement reference", () => {
            timer = new CountdownTimer(el, { endTime: BASE + 5 * SEC });
            expect(el.textContent).toBe("00:00:05");
        });

        it("warns and does not start when the element is missing", () => {
            const warn = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});
            timer = new CountdownTimer("#missing", {
                endTime: BASE + 5 * SEC,
            });
            expect(warn).toHaveBeenCalledWith(
                "[Stylescape] CountdownTimer element not found",
            );
            // Nothing was rendered anywhere.
            expect(el.textContent).toBe("");
            warn.mockRestore();
        });

        it("parses a string endTime", () => {
            timer = new CountdownTimer(el, {
                endTime: "2026-01-01T00:00:05.000Z",
            });
            expect(el.textContent).toBe("00:00:05");
        });

        it("parses a numeric endTime", () => {
            timer = new CountdownTimer(el, { endTime: BASE + 5 * SEC });
            expect(el.textContent).toBe("00:00:05");
        });

        it("parses a Date endTime", () => {
            timer = new CountdownTimer(el, {
                endTime: new Date(BASE + 90 * SEC),
            });
            expect(el.textContent).toBe("00:01:30");
        });
    });

    // ------------------------------------------------------------------
    // Ticking
    // ------------------------------------------------------------------
    describe("Ticking", () => {
        it("updates the display on each interval", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + 5 * SEC,
                interval: SEC,
            });
            expect(el.textContent).toBe("00:00:05");
            vi.advanceTimersByTime(SEC);
            expect(el.textContent).toBe("00:00:04");
            vi.advanceTimersByTime(2 * SEC);
            expect(el.textContent).toBe("00:00:02");
        });

        it("invokes onTick with the remaining breakdown", () => {
            const onTick = vi.fn();
            timer = new CountdownTimer(el, {
                endTime: BASE + 5 * SEC,
                interval: SEC,
                onTick,
            });
            // Initial tick fired during start().
            expect(onTick).toHaveBeenCalledTimes(1);
            expect(onTick).toHaveBeenLastCalledWith(
                expect.objectContaining({ total: 5 * SEC, seconds: 5 }),
            );
            vi.advanceTimersByTime(SEC);
            expect(onTick).toHaveBeenCalledTimes(2);
            expect(onTick).toHaveBeenLastCalledWith(
                expect.objectContaining({ total: 4 * SEC, seconds: 4 }),
            );
        });

        it("does not create a second interval when start() is called twice", () => {
            const onTick = vi.fn();
            timer = new CountdownTimer(el, {
                endTime: BASE + 60 * SEC,
                interval: SEC,
                onTick,
            });
            expect(onTick).toHaveBeenCalledTimes(1);
            timer.start(); // should be a no-op
            vi.advanceTimersByTime(SEC);
            expect(onTick).toHaveBeenCalledTimes(2); // not 3
        });
    });

    // ------------------------------------------------------------------
    // Completion
    // ------------------------------------------------------------------
    describe("Completion", () => {
        it("stops, shows endText and fires onComplete when time runs out", () => {
            const onComplete = vi.fn();
            timer = new CountdownTimer(el, {
                endTime: BASE + SEC,
                interval: SEC,
                endText: "Done!",
                onComplete,
            });
            expect(el.textContent).toBe("00:00:01");
            expect(onComplete).not.toHaveBeenCalled();

            vi.advanceTimersByTime(SEC);
            expect(el.textContent).toBe("Done!");
            expect(onComplete).toHaveBeenCalledTimes(1);

            // Interval was cleared: further time does not re-trigger.
            vi.advanceTimersByTime(5 * SEC);
            expect(onComplete).toHaveBeenCalledTimes(1);
        });
    });

    // ------------------------------------------------------------------
    // stop / reset / destroy
    // ------------------------------------------------------------------
    describe("stop / reset / destroy", () => {
        it("stop() halts further updates", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + 10 * SEC,
                interval: SEC,
            });
            expect(el.textContent).toBe("00:00:10");
            timer.stop();
            vi.advanceTimersByTime(5 * SEC);
            expect(el.textContent).toBe("00:00:10");
        });

        it("reset() applies a new end time and resumes ticking", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + 2 * SEC,
                interval: SEC,
            });
            timer.reset(BASE + 30 * SEC);
            expect(el.textContent).toBe("00:00:30");
            vi.advanceTimersByTime(SEC);
            expect(el.textContent).toBe("00:00:29");
        });

        it("destroy() stops the timer and detaches the element", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + 10 * SEC,
                interval: SEC,
            });
            timer.destroy();
            const before = el.textContent;
            vi.advanceTimersByTime(5 * SEC);
            expect(el.textContent).toBe(before);
            timer = undefined;
        });
    });

    // ------------------------------------------------------------------
    // getRemaining
    // ------------------------------------------------------------------
    describe("getRemaining", () => {
        it("breaks the remaining time into days/hours/minutes/seconds", () => {
            const total = DAY + 2 * HOUR + 3 * MIN + 4 * SEC;
            timer = new CountdownTimer(el, { endTime: BASE + total });
            expect(timer.getRemaining()).toEqual({
                total,
                days: 1,
                hours: 2,
                minutes: 3,
                seconds: 4,
            });
        });

        it("never reports a negative total", () => {
            timer = new CountdownTimer(el, { endTime: BASE - 5 * SEC });
            expect(timer.getRemaining().total).toBe(0);
        });
    });

    // ------------------------------------------------------------------
    // Formatting
    // ------------------------------------------------------------------
    describe("Formatting", () => {
        const total = 2 * DAY + 5 * HOUR + 30 * MIN + 15 * SEC;

        it("format DD:HH:MM:SS", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + total,
                format: "DD:HH:MM:SS",
            });
            expect(el.textContent).toBe("02:05:30:15");
        });

        it("format full", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + total,
                format: "full",
            });
            expect(el.textContent).toBe("2d 5h 30m 15s");
        });

        it("format compact with days", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + total,
                format: "compact",
            });
            expect(el.textContent).toBe("2d 5h");
        });

        it("format compact with hours (no days)", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + 5 * HOUR + 30 * MIN,
                format: "compact",
            });
            expect(el.textContent).toBe("5h 30m");
        });

        it("format compact with minutes (no hours)", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + 30 * MIN + 15 * SEC,
                format: "compact",
            });
            expect(el.textContent).toBe("30m 15s");
        });

        it("rolls days into hours for HH:MM:SS", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + DAY + 2 * HOUR,
                format: "HH:MM:SS",
            });
            expect(el.textContent).toBe("26:00:00");
        });

        it("omits leading zeros when leadingZeros is false", () => {
            timer = new CountdownTimer(el, {
                endTime: BASE + 5 * SEC,
                leadingZeros: false,
            });
            expect(el.textContent).toBe("0:0:5");
        });
    });
});
