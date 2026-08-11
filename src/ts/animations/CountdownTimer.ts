// ============================================================================
// Stylescape | Countdown Timer
// ============================================================================
// Displays a countdown to a target date/time.
// Supports data-ss-countdown attributes for declarative configuration.
// ============================================================================

/**
 * Configuration options for CountdownTimer
 */
export interface CountdownTimerOptions {
    /** Target end time */
    endTime?: Date | string | number;
    /** Format string (default: "HH:MM:SS") */
    format?: "HH:MM:SS" | "DD:HH:MM:SS" | "full" | "compact";
    /** Text to show when countdown ends */
    endText?: string;
    /** Update interval in ms (default: 1000) */
    interval?: number;
    /** Callback when countdown ends */
    onComplete?: () => void;
    /** Callback on each tick */
    onTick?: (remaining: CountdownTime) => void;
    /** Whether to show leading zeros */
    leadingZeros?: boolean;
}

/**
 * Time breakdown for countdown
 */
export interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

/**
 * Countdown timer that updates a display element.
 *
 * @example JavaScript
 * ```typescript
 * const countdown = new CountdownTimer("#countdown", {
 *     endTime: "2026-12-31T00:00:00",
 *     onComplete: () => console.log("Happy New Year!")
 * })
 * ```
 *
 * @example HTML with data-ss
 * ```html
 * <div data-ss="countdown"
 *      data-ss-countdown-end-time="2026-12-31T00:00:00"
 *      data-ss-countdown-format="DD:HH:MM:SS"
 *      data-ss-countdown-end-text="Time's up!">
 * </div>
 * ```
 */
export class CountdownTimer {
    private element: HTMLElement | null;
    private options: Required<CountdownTimerOptions>;
    private intervalId: number | null = null;
    private endTime: number;

    constructor(
        selectorOrElement: string | HTMLElement,
        options: CountdownTimerOptions = {},
    ) {
        this.element =
            typeof selectorOrElement === "string"
                ? document.querySelector<HTMLElement>(selectorOrElement)
                : selectorOrElement;

        this.options = {
            endTime: options.endTime ?? new Date(Date.now() + 3600000), // Default: 1 hour
            format: options.format ?? "HH:MM:SS",
            endText: options.endText ?? "Time's up!",
            interval: options.interval ?? 1000,
            onComplete: options.onComplete ?? (() => {}),
            onTick: options.onTick ?? (() => {}),
            leadingZeros: options.leadingZeros !== false,
        };

        // Parse end time
        if (typeof this.options.endTime === "string") {
            this.endTime = new Date(this.options.endTime).getTime();
        } else if (typeof this.options.endTime === "number") {
            this.endTime = this.options.endTime;
        } else {
            this.endTime = this.options.endTime.getTime();
        }

        if (!this.element) {
            console.warn("[Stylescape] CountdownTimer element not found");
            return;
        }

        this.start();
    }

    // ========================================================================
    // Public Methods
    // ========================================================================

    /**
     * Start the countdown
     */
    public start(): void {
        if (this.intervalId) return;

        this.tick(); // Initial tick
        this.intervalId = window.setInterval(
            () => this.tick(),
            this.options.interval,
        );
    }

    /**
     * Stop the countdown
     */
    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Reset with new end time
     */
    public reset(endTime: Date | string | number): void {
        this.stop();

        if (typeof endTime === "string") {
            this.endTime = new Date(endTime).getTime();
        } else if (typeof endTime === "number") {
            this.endTime = endTime;
        } else {
            this.endTime = endTime.getTime();
        }

        this.start();
    }

    /**
     * Get remaining time breakdown
     */
    public getRemaining(): CountdownTime {
        const total = Math.max(0, this.endTime - Date.now());
        return {
            total,
            days: Math.floor(total / (1000 * 60 * 60 * 24)),
            hours: Math.floor((total / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((total / (1000 * 60)) % 60),
            seconds: Math.floor((total / 1000) % 60),
        };
    }

    /**
     * Destroy the countdown
     */
    public destroy(): void {
        this.stop();
        this.element = null;
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private tick(): void {
        const remaining = this.getRemaining();
        this.options.onTick(remaining);

        if (remaining.total <= 0) {
            this.stop();
            this.updateDisplay(this.options.endText);
            this.options.onComplete();
            return;
        }

        this.updateDisplay(this.formatTime(remaining));
    }

    private formatTime(time: CountdownTime): string {
        const pad = (n: number) =>
            this.options.leadingZeros
                ? n.toString().padStart(2, "0")
                : n.toString();

        switch (this.options.format) {
            case "DD:HH:MM:SS":
                return `${pad(time.days)}:${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;

            case "full":
                return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;

            case "compact":
                if (time.days > 0) return `${time.days}d ${time.hours}h`;
                if (time.hours > 0) return `${time.hours}h ${time.minutes}m`;
                return `${time.minutes}m ${time.seconds}s`;

            case "HH:MM:SS":
            default: {
                const totalHours = time.days * 24 + time.hours;
                return `${pad(totalHours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
            }
        }
    }

    private updateDisplay(text: string): void {
        if (this.element) {
            this.element.textContent = text;
        }
    }
}

export default CountdownTimer;
