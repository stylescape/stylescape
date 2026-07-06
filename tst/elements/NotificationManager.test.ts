// ============================================================================
// Stylescape | Notification Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationManager } from "../../src/ts/elements/NotificationManager";

let manager: NotificationManager | null = null;

describe("NotificationManager", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = "";
    });

    afterEach(() => {
        manager?.destroy();
        manager = null;
        vi.useRealTimers();
    });

    it("creates an accessible container on construction", () => {
        manager = new NotificationManager();
        const container = document.querySelector(".ss-notification-container");
        expect(container).not.toBeNull();
        expect(container?.getAttribute("role")).toBe("region");
        expect(container?.getAttribute("aria-live")).toBe("polite");
        expect(container?.classList.contains(
            "ss-notification-container--top-right",
        )).toBe(true);
    });

    it("success() renders a notification with the message and type class", () => {
        manager = new NotificationManager();
        const id = manager.success("Saved!");
        expect(id).toBeTruthy();
        expect(manager.count).toBe(1);

        const el = document.querySelector(".ss-notification--success");
        expect(el).not.toBeNull();
        expect(el?.textContent).toContain("Saved!");
    });

    it("auto-dismisses after the given duration", () => {
        manager = new NotificationManager();
        manager.success("bye", { duration: 100 });
        expect(manager.count).toBe(1);

        vi.advanceTimersByTime(100); // trigger dismiss
        vi.advanceTimersByTime(300); // animation-out removes element
        expect(manager.count).toBe(0);
        expect(document.querySelector(".ss-notification--success")).toBeNull();
    });

    it("error() does not auto-dismiss by default (duration 0)", () => {
        manager = new NotificationManager();
        manager.error("stay");
        vi.advanceTimersByTime(10000);
        expect(manager.count).toBe(1);
    });

    it("dismiss() removes a notification after the animation and calls onClose", () => {
        manager = new NotificationManager();
        const onClose = vi.fn();
        const id = manager.info("hello", { duration: 0, onClose });

        manager.dismiss(id);
        vi.advanceTimersByTime(300);
        expect(manager.count).toBe(0);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("clicking the close button dismisses the notification", () => {
        manager = new NotificationManager();
        manager.warning("closeme", { duration: 0 });
        const closeBtn = document.querySelector(
            ".ss-notification__close",
        ) as HTMLButtonElement;
        expect(closeBtn).not.toBeNull();

        closeBtn.click();
        vi.advanceTimersByTime(300);
        expect(manager.count).toBe(0);
    });

    it("the action button invokes onAction and dismisses", () => {
        manager = new NotificationManager();
        const onAction = vi.fn();
        manager.info("do it", {
            duration: 0,
            actionText: "Undo",
            onAction,
        });
        const actionBtn = document.querySelector(
            ".ss-notification__action",
        ) as HTMLButtonElement;
        actionBtn.click();

        expect(onAction).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(300);
        expect(manager.count).toBe(0);
    });

    it("enforces maxNotifications", () => {
        manager = new NotificationManager({ maxNotifications: 2 });
        manager.info("a", { duration: 0 });
        manager.info("b", { duration: 0 });
        manager.info("c", { duration: 0 });

        vi.advanceTimersByTime(300);
        expect(manager.count).toBe(2);
    });

    it("dismissAll clears every notification", () => {
        manager = new NotificationManager();
        manager.info("a", { duration: 0 });
        manager.info("b", { duration: 0 });
        expect(manager.count).toBe(2);

        manager.dismissAll();
        vi.advanceTimersByTime(300);
        expect(manager.count).toBe(0);
    });

    it("getInstance returns a shared singleton", () => {
        manager = NotificationManager.getInstance();
        const again = NotificationManager.getInstance();
        expect(again).toBe(manager);
    });

    it("init reads configuration from a data-ss container", () => {
        document.body.innerHTML = `
            <div data-ss="notification-container"
                 data-ss-notification-position="bottom-left"
                 data-ss-notification-max="3"></div>
        `;
        manager = NotificationManager.init();
        const container = document.querySelector(
            '[data-ss="notification-container"]',
        );
        expect(
            container?.classList.contains(
                "ss-notification-container--bottom-left",
            ),
        ).toBe(true);
    });

    it("destroy removes the container from the DOM", () => {
        manager = new NotificationManager();
        expect(document.querySelector(".ss-notification-container")).not.toBeNull();
        manager.destroy();
        manager = null;
        expect(document.querySelector(".ss-notification-container")).toBeNull();
    });
});
