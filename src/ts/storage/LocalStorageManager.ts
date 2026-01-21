// ============================================================================
// Stylescape | Local Storage Manager
// ============================================================================
// Singleton wrapper for localStorage with error handling and fallback support.
// Provides a consistent API for persistent client-side storage.
// ============================================================================

/**
 * Configuration options for LocalStorageManager
 */
export interface LocalStorageOptions {
    /** Prefix for all storage keys */
    prefix?: string;
    /** Whether to serialize values as JSON */
    useJSON?: boolean;
    /** Fallback storage mechanism (e.g., in-memory Map) */
    fallback?: Map<string, string>;
}

/**
 * Singleton class for managing localStorage operations.
 * Provides error handling and consistent API for storage operations.
 *
 * @example
 * ```typescript
 * const storage = LocalStorageManager.getInstance()
 *
 * // Store a value
 * storage.setValue("user-preference", "dark")
 *
 * // Retrieve a value
 * const pref = storage.getValue("user-preference")
 *
 * // Remove a value
 * storage.removeValue("user-preference")
 *
 * // Clear all storage
 * storage.clearStorage()
 * ```
 */
export class LocalStorageManager {
    /** Singleton instance */
    private static instance: LocalStorageManager;

    /**
     * Get the singleton instance of LocalStorageManager.
     * Creates the instance if it doesn't exist.
     *
     * @returns The singleton LocalStorageManager instance
     */
    public static getInstance(): LocalStorageManager {
        if (!LocalStorageManager.instance) {
            LocalStorageManager.instance = new LocalStorageManager();
        }
        return LocalStorageManager.instance;
    }

    /**
     * Stores a value in localStorage or fallback storage.
     * @param key The storage key.
     * @param value The value to store.
     */
    setValue(key: string, value: unknown): void {
        try {
            // const serializedValue = JSON.stringify(value);
            if (localStorage) {
                // localStorage.setItem(key, serializedValue);
                localStorage.setItem(key, String(value));
            } else {
                // Fallback mechanism here, e.g., cookies
            }
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }

    /**
     * Retrieves a value from localStorage or fallback storage.
     * @param key The storage key.
     * @returns The retrieved value or null if not found.
     */
    // getValue<T>(key: string): T | null {
    getValue<_T>(key: string): string | null {
        try {
            if (localStorage) {
                // const serializedValue = localStorage.getItem(key);
                // return serializedValue ? JSON.parse(serializedValue) : null;
                return localStorage.getItem(key);
            } else {
                // Fallback mechanism here
                return null;
            }
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return null;
        }
    }

    /**
     * Removes a value from localStorage.
     * @param key The storage key.
     */
    removeValue(key: string): void {
        try {
            if (localStorage) {
                localStorage.removeItem(key);
            } else {
                // Fallback remove mechanism here
            }
        } catch (error) {
            console.error("Error removing from localStorage:", error);
        }
    }

    /**
     * Clears all values in localStorage.
     */
    clearStorage(): void {
        try {
            if (localStorage) {
                localStorage.clear();
            } else {
                // Fallback clear mechanism here
            }
        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }
    }
}
