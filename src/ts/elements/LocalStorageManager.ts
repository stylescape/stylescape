// ============================================================================
// Local Storage Manager
// ============================================================================

export class LocalStorageManager {
    private static instance: LocalStorageManager

    /**
     * Static method to get the instance of LocalStorageManager.
     * @returns The singleton instance of LocalStorageManager.
     */
    public static getInstance(): LocalStorageManager {
        if (!LocalStorageManager.instance) {
            LocalStorageManager.instance = new LocalStorageManager()
        }
        return LocalStorageManager.instance
    }

    /**
     * Stores a value in localStorage or fallback storage.
     * @param key The storage key.
     * @param value The value to store.
     */
    setValue(key: string, value: any): void {
        try {
            // const serializedValue = JSON.stringify(value);
            if (localStorage) {
                // localStorage.setItem(key, serializedValue);
                localStorage.setItem(key, value)
            } else {
                // Fallback mechanism here, e.g., cookies
            }
        } catch (error) {
            console.error("Error saving to localStorage:", error)
        }
    }

    /**
     * Retrieves a value from localStorage or fallback storage.
     * @param key The storage key.
     * @returns The retrieved value or null if not found.
     */
    // getValue<T>(key: string): T | null {
    getValue<T>(key: string): string | null {
        try {
            if (localStorage) {
                // const serializedValue = localStorage.getItem(key);
                // return serializedValue ? JSON.parse(serializedValue) : null;
                return localStorage.getItem(key)
            } else {
                // Fallback mechanism here
                return null
            }
        } catch (error) {
            console.error("Error reading from localStorage:", error)
            return null
        }
    }

    /**
     * Removes a value from localStorage.
     * @param key The storage key.
     */
    removeValue(key: string): void {
        try {
            if (localStorage) {
                localStorage.removeItem(key)
            } else {
                // Fallback remove mechanism here
            }
        } catch (error) {
            console.error("Error removing from localStorage:", error)
        }
    }

    /**
     * Clears all values in localStorage.
     */
    clearStorage(): void {
        try {
            if (localStorage) {
                localStorage.clear()
            } else {
                // Fallback clear mechanism here
            }
        } catch (error) {
            console.error("Error clearing localStorage:", error)
        }
    }
}
