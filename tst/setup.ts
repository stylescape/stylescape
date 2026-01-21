// ============================================================================
// Stylescape | Test Setup
// ============================================================================
// Global test setup file for Vitest with jsdom environment.
// ============================================================================

import { beforeEach, afterEach, vi } from "vitest"

// ============================================================================
// DOM Reset
// ============================================================================

beforeEach(() => {
    // Reset DOM to clean state before each test
    document.head.innerHTML = ""
    document.body.innerHTML = ""

    // Clear any stored instances
    vi.clearAllMocks()
})

afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = ""

    // Reset timers if they were mocked
    vi.useRealTimers()

    // Clear all intervals/timeouts
    vi.clearAllTimers()
})

// ============================================================================
// Global Mocks
// ============================================================================

// Mock ResizeObserver
class ResizeObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock)

// Mock IntersectionObserver
class IntersectionObserverMock {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    root = null
    rootMargin = ""
    thresholds = []
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock)

// Mock MutationObserver
class MutationObserverMock {
    private callback: MutationCallback

    constructor(callback: MutationCallback) {
        this.callback = callback
    }

    observe = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn(() => [])

    // Helper to trigger mutations in tests
    trigger(mutations: Partial<MutationRecord>[]) {
        this.callback(mutations as MutationRecord[], this)
    }
}
vi.stubGlobal("MutationObserver", MutationObserverMock)

// Mock requestAnimationFrame
vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 16)
})

vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    clearTimeout(id)
})

// Mock matchMedia
vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
}))

// Mock scrollTo
vi.stubGlobal("scrollTo", vi.fn())
Object.defineProperty(window, "scrollY", { value: 0, writable: true })
Object.defineProperty(window, "innerHeight", { value: 768, writable: true })
Object.defineProperty(window, "innerWidth", { value: 1024, writable: true })

// ============================================================================
// Custom Matchers (optional extension)
// ============================================================================

// Example of extending expect with custom matchers
// import { expect } from "vitest"
// expect.extend({
//     toHaveAttribute(element: Element, attr: string, value?: string) {
//         const pass = value !== undefined
//             ? element.getAttribute(attr) === value
//             : element.hasAttribute(attr)
//         return {
//             pass,
//             message: () => `expected element ${pass ? 'not ' : ''}to have attribute "${attr}"${value ? ` with value "${value}"` : ''}`
//         }
//     }
// })
