// ============================================================================
// Stylescape | Local Storage Manager Tests
// ============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalStorageManager } from "../../src/ts/storage/LocalStorageManager";

describe("LocalStorageManager", () => {
    let storage: LocalStorageManager;

    beforeEach(() => {
        localStorage.clear();
        storage = LocalStorageManager.getInstance();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    describe("Singleton", () => {
        it("returns the same instance on repeated getInstance() calls", () => {
            const a = LocalStorageManager.getInstance();
            const b = LocalStorageManager.getInstance();
            expect(a).toBe(b);
        });

        it("returns a LocalStorageManager instance", () => {
            expect(LocalStorageManager.getInstance()).toBeInstanceOf(
                LocalStorageManager,
            );
        });
    });

    describe("setValue / getValue round-trip", () => {
        it("stores and retrieves a string value verbatim", () => {
            storage.setValue("greeting", "hello");
            expect(storage.getValue("greeting")).toBe("hello");
        });

        it("writes the value into the underlying localStorage", () => {
            storage.setValue("k", "v");
            expect(localStorage.getItem("k")).toBe("v");
        });

        it("overwrites an existing key with a new value", () => {
            storage.setValue("k", "first");
            storage.setValue("k", "second");
            expect(storage.getValue("k")).toBe("second");
        });

        it("coerces a number to its string form (String(value))", () => {
            storage.setValue("num", 123);
            expect(storage.getValue("num")).toBe("123");
        });

        it("coerces a boolean to its string form", () => {
            storage.setValue("flag", true);
            expect(storage.getValue("flag")).toBe("true");
        });

        it("coerces an object via String() rather than JSON", () => {
            storage.setValue("obj", { a: 1 });
            // Documents actual behavior: String({}) === "[object Object]"
            expect(storage.getValue("obj")).toBe("[object Object]");
        });

        it("stores null as the literal string 'null'", () => {
            storage.setValue("nil", null);
            expect(storage.getValue("nil")).toBe("null");
        });
    });

    describe("getValue on missing keys", () => {
        it("returns null for a key that was never set", () => {
            expect(storage.getValue("does-not-exist")).toBeNull();
        });
    });

    describe("removeValue", () => {
        it("removes a stored key so getValue returns null afterwards", () => {
            storage.setValue("temp", "x");
            expect(storage.getValue("temp")).toBe("x");
            storage.removeValue("temp");
            expect(storage.getValue("temp")).toBeNull();
        });

        it("does not throw when removing a non-existent key", () => {
            expect(() => storage.removeValue("ghost")).not.toThrow();
        });
    });

    describe("clearStorage", () => {
        it("removes every stored key", () => {
            storage.setValue("a", "1");
            storage.setValue("b", "2");
            storage.clearStorage();
            expect(storage.getValue("a")).toBeNull();
            expect(storage.getValue("b")).toBeNull();
            expect(localStorage.length).toBe(0);
        });
    });

    describe("Error handling", () => {
        it("logs an error and does not throw when setItem fails (quota)", () => {
            const errorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});
            const setSpy = vi
                .spyOn(Storage.prototype, "setItem")
                .mockImplementation(() => {
                    throw new Error("QuotaExceededError");
                });

            expect(() => storage.setValue("k", "v")).not.toThrow();
            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy.mock.calls[0][0]).toContain("Error saving");

            setSpy.mockRestore();
            errorSpy.mockRestore();
        });

        it("logs an error and returns null when getItem throws", () => {
            const errorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});
            const getSpy = vi
                .spyOn(Storage.prototype, "getItem")
                .mockImplementation(() => {
                    throw new Error("read failure");
                });

            let result: string | null = "sentinel";
            expect(() => {
                result = storage.getValue("k");
            }).not.toThrow();
            expect(result).toBeNull();
            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy.mock.calls[0][0]).toContain("Error reading");

            getSpy.mockRestore();
            errorSpy.mockRestore();
        });

        it("logs an error and does not throw when removeItem fails", () => {
            const errorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});
            const removeSpy = vi
                .spyOn(Storage.prototype, "removeItem")
                .mockImplementation(() => {
                    throw new Error("remove failure");
                });

            expect(() => storage.removeValue("k")).not.toThrow();
            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy.mock.calls[0][0]).toContain("Error removing");

            removeSpy.mockRestore();
            errorSpy.mockRestore();
        });

        it("logs an error and does not throw when clear fails", () => {
            const errorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {});
            const clearSpy = vi
                .spyOn(Storage.prototype, "clear")
                .mockImplementation(() => {
                    throw new Error("clear failure");
                });

            expect(() => storage.clearStorage()).not.toThrow();
            expect(errorSpy).toHaveBeenCalled();
            expect(errorSpy.mock.calls[0][0]).toContain("Error clearing");

            clearSpy.mockRestore();
            errorSpy.mockRestore();
        });
    });
});
