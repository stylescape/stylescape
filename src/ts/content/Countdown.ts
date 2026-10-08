// ============================================================================
// Stylescape | Countdown
// ============================================================================
// Drives `.ss-c-countdown` rolling-digit displays.
//
// Markup contract:
//   <span class="ss-c-countdown" data-countdown-seconds="3600">
//       <span data-unit="hours"></span>:<span data-unit="minutes"></span>:…
//   </span>
// or an absolute target:
//   <span class="ss-c-countdown" data-countdown-to="2027-01-01T00:00:00Z">…
//
// Each `[data-unit]` child gets its `--ss-countdown-value` custom property
// updated once a second; the SCSS module translates the digit column.
// Elements without either data attribute are left untouched (static demos).
//
// Accessibility: the digit columns are visual only, so they are hidden from
// assistive technology and the container becomes a `role="timer"` (unless it
// already has a role) whose `aria-label` carries the readable remaining time.
// `timer` is an off-by-default live region, so the per-second update is not
// announced unless the author opts in with `aria-live`.
// ============================================================================

type CountdownUnit = "days" | "hours" | "minutes" | "seconds";

export class Countdown {
    private static timers = new WeakMap<Element, number>();

    /** Initialize every countdown on the page. */
    public static initAll(selector: string = ".ss-c-countdown"): void {
        document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
            Countdown.init(el);
        });
    }

    /** Initialize a single countdown element. */
    public static init(el: HTMLElement): void {
        const toAttr = el.dataset.countdownTo;
        const secondsAttr = el.dataset.countdownSeconds;
        if (!toAttr && !secondsAttr) return;

        // Clear a previous timer if re-initialized.
        const existing = Countdown.timers.get(el);
        if (existing) window.clearInterval(existing);

        let target: number;
        if (toAttr) {
            target = new Date(toAttr).getTime();
        } else {
            target = Date.now() + Number(secondsAttr) * 1000;
        }

        const tick = (): void => {
            const remaining = Math.max(
                0,
                Math.round((target - Date.now()) / 1000),
            );
            const parts: Record<CountdownUnit, number> = {
                days: Math.floor(remaining / 86400),
                hours: Math.floor((remaining % 86400) / 3600),
                minutes: Math.floor((remaining % 3600) / 60),
                seconds: remaining % 60,
            };
            const spoken: string[] = [];
            el.querySelectorAll<HTMLElement>("[data-unit]").forEach((unit) => {
                const kind = unit.dataset.unit as CountdownUnit;
                const value = parts[kind];
                if (value !== undefined) {
                    // The digit column covers 0–60; clamp days-style overflow.
                    unit.style.setProperty(
                        "--ss-countdown-value",
                        String(Math.min(value, 60)),
                    );
                    spoken.push(
                        `${value} ${value === 1 ? kind.slice(0, -1) : kind}`,
                    );
                }
            });
            if (spoken.length > 0) {
                el.setAttribute("aria-label", spoken.join(", "));
            }
            if (remaining <= 0) {
                const timer = Countdown.timers.get(el);
                if (timer) window.clearInterval(timer);
                el.dispatchEvent(new CustomEvent("ss:countdown:finished"));
            }
        };

        if (!el.hasAttribute("role")) el.setAttribute("role", "timer");
        el.querySelectorAll<HTMLElement>("[data-unit]").forEach((unit) => {
            unit.setAttribute("aria-hidden", "true");
            unit.removeAttribute("aria-label");
        });

        tick();
        const timer = window.setInterval(tick, 1000);
        Countdown.timers.set(el, timer);
    }
}
