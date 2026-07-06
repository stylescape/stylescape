// ============================================================================
// Stylescape | DialogManager Tests
// ============================================================================
// DialogManager is a thin wrapper around a dialog element: it wires the
// `.dialog-close` button to closeDialog() and toggles an `open` class.
// It is exported as a default export.
// ============================================================================

import { beforeEach, describe, expect, it } from "vitest";
import DialogManager from "../../src/ts/elements/DialogManager";
import { click } from "../utils";

describe("DialogManager", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    function buildDialog(id = "myDialog"): HTMLElement {
        document.body.innerHTML = `
            <div id="${id}">
                <p>Dialog body</p>
                <button class="dialog-close">Close</button>
            </div>
        `;
        return document.getElementById(id) as HTMLElement;
    }

    describe("Construction", () => {
        it("constructs when the dialog and close button exist", () => {
            buildDialog();
            const manager = new DialogManager("myDialog");
            expect(manager).toBeInstanceOf(DialogManager);
        });

        it("throws when the dialog element does not exist", () => {
            expect(() => new DialogManager("does-not-exist")).toThrow();
        });

        it("throws when the dialog has no .dialog-close button", () => {
            document.body.innerHTML = `<div id="myDialog"><p>No close</p></div>`;
            expect(() => new DialogManager("myDialog")).toThrow();
        });
    });

    describe("openDialog / closeDialog", () => {
        it("adds the 'open' class on openDialog()", () => {
            const dialog = buildDialog();
            const manager = new DialogManager("myDialog");

            expect(dialog.classList.contains("open")).toBe(false);
            manager.openDialog();
            expect(dialog.classList.contains("open")).toBe(true);
        });

        it("removes the 'open' class on closeDialog()", () => {
            const dialog = buildDialog();
            const manager = new DialogManager("myDialog");

            manager.openDialog();
            expect(dialog.classList.contains("open")).toBe(true);

            manager.closeDialog();
            expect(dialog.classList.contains("open")).toBe(false);
        });

        it("is idempotent when closing an already-closed dialog", () => {
            const dialog = buildDialog();
            const manager = new DialogManager("myDialog");

            manager.closeDialog();
            expect(dialog.classList.contains("open")).toBe(false);
        });
    });

    describe("Close button wiring", () => {
        it("closes the dialog when the .dialog-close button is clicked", () => {
            const dialog = buildDialog();
            const manager = new DialogManager("myDialog");
            manager.openDialog();
            expect(dialog.classList.contains("open")).toBe(true);

            const closeButton = dialog.querySelector(
                ".dialog-close",
            ) as HTMLElement;
            click(closeButton);

            expect(dialog.classList.contains("open")).toBe(false);
        });
    });
});
