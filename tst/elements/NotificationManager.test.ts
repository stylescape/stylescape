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
        const container = document.querySelector(".ss-c-toast-region");
        expect(container).not.toBeNull();
        expect(container?.getAttribute("role")).toBe("region");
        expect(container?.getAttribute("aria-live")).toBe("polite");
        expect(container?.getAttribute("data-position")).toBe("top-right");
    });

    it("success() renders a notification with the message and type class", () => {
        manager = new NotificationManager();
        const id = manager.success("Saved!");
        expect(id).toBeTruthy();
        expect(manager.count).toBe(1);

        const el = document.querySelector(".ss-c-toast--success");
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
        expect(document.querySelector(".ss-c-toast--success")).toBeNull();
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
            ".ss-c-toast__close",
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
            ".ss-c-toast__action",
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
        expect(container?.classList.contains("ss-c-toast-region")).toBe(true);
        expect(container?.getAttribute("data-position")).toBe("bottom-left");
    });

    it("destroy removes the container from the DOM", () => {
        manager = new NotificationManager();
        expect(document.querySelector(".ss-c-toast-region")).not.toBeNull();
        manager.destroy();
        manager = null;
        expect(document.querySelector(".ss-c-toast-region")).toBeNull();
    });

    it("builds the ss-c-toast parts", () => {
        manager = new NotificationManager();
        manager.info("body", {
            title: "Heading",
            duration: 1000,
            showProgress: true,
            actionText: "Undo",
        });
        const toast = document.querySelector(".ss-c-toast") as HTMLElement;
        expect(toast.classList.contains("ss-c-toast--info")).toBe(true);
        expect(toast.querySelector(".ss-c-toast__content")).not.toBeNull();
        expect(
            toast.querySelector(".ss-c-toast__content > .ss-c-toast__title")
                ?.textContent,
        ).toBe("Heading");
        expect(toast.querySelector(".ss-c-toast__message")?.textContent).toBe(
            "body",
        );
        expect(
            toast.querySelector(".ss-c-toast__actions > .ss-c-toast__action"),
        ).not.toBeNull();
        const close = toast.querySelector(".ss-c-toast__close");
        expect(close?.classList.contains("ss-c-close")).toBe(true);
        expect(close?.getAttribute("aria-label")).toBe("Close");
        expect(
            toast.querySelector(
                ".ss-c-toast__progress > .ss-c-toast__progress-bar",
            ),
        ).not.toBeNull();
        expect(document.body.innerHTML).not.toContain("ss-notification");
    });

    it("fades in and out through data-state entering and leaving", () => {
        manager = new NotificationManager();
        const id = manager.info("x", { duration: 0 });
        const toast = document.querySelector(".ss-c-toast") as HTMLElement;
        expect(toast.getAttribute("data-state")).toBe("entering");
        manager.dismiss(id);
        expect(toast.getAttribute("data-state")).toBe("leaving");
    });
});
