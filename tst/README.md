# Stylescape Test Suite

Comprehensive test suite for the Stylescape visual identity framework.

## Overview

The test suite uses **Vitest** with **jsdom** for DOM testing. Tests are
organized by feature area mirroring the `src/ts` structure.

## Directory Structure

```
tst/
├── setup.ts                    # Global test setup and mocks
├── utils/
│   ├── index.ts               # Export utilities
│   ├── dom.ts                 # DOM manipulation helpers
│   └── fixtures.ts            # HTML test fixtures
├── core/
│   ├── autoInit.test.ts       # Auto-initialization tests
│   ├── baseElementManager.test.ts
│   └── helpers/
│       └── config-parser.ts   # Config parsing test helper
├── elements/
│   ├── Modal.test.ts          # Modal component tests
│   ├── Tooltip.test.ts        # Tooltip component tests
│   └── Accordion.test.ts      # Accordion component tests
├── animations/
│   └── Preloader.test.ts      # Preloader component tests
├── buttons/
│   └── ButtonHandler.test.ts  # Button components tests
├── data/
│   └── DataComponents.test.ts # Filter and Rating tests
├── forms/
│   └── FormValidator.test.ts  # Form validation tests
├── scroll/
│   └── ScrollComponents.test.ts
├── storage/
│   └── CookieConsentManager.test.ts
├── utilities/
│   └── ThemeToggler.test.ts
└── integration/
    ├── autoInit.integration.test.ts    # Full init flow tests
    ├── componentInteraction.test.ts    # Component communication
    └── accessibility.test.ts           # A11y compliance tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (no watch)
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Test Utilities

### DOM Helpers (`utils/dom.ts`)

```typescript
// Create elements from HTML
const button = createElement<HTMLButtonElement>(`<button>Click</button>`);

// Create and append to body
const modal = createAndAppend(`<div class="modal">...</div>`);

// Simulate events
click(element);
mouseEnter(element);
mouseLeave(element);
focus(element);
blur(element);
keyDown(element, "Escape");
pressEscape(element);
pressEnter(element);
pressTab(element);

// Input helpers
inputValue(input, "test@example.com");
changeValue(input, "new value");

// Scroll simulation
scrollTo(window, { y: 500 });

// Query helpers
const el = $<HTMLElement>(".selector");
const els = $$<HTMLElement>(".selector");

// Async helpers
await wait(100); // Wait ms
await nextFrame(); // Wait for rAF
```

### Test Fixtures (`utils/fixtures.ts`)

Pre-built HTML fixtures for common components:

- `modalFixture` - Modal with trigger and content
- `tooltipFixture` - Tooltip button
- `accordionFixture` - Multi-item accordion
- `dropdownFixture` - Dropdown menu
- `formValidationFixture` - Form with validators
- `preloaderFixture` - Preloader element
- `cookieConsentFixture` - Cookie banner
- `autoInitFixture` - Multiple components

## Writing Tests

### Basic Component Test

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createAndAppend, click, $ } from "../utils";
import { MyComponent } from "../../src/ts/elements/MyComponent";

describe("MyComponent", () => {
    let component: MyComponent;
    let element: HTMLElement;

    beforeEach(() => {
        element = createAndAppend(`
            <div data-ss="my-component" id="test">
                Content
            </div>
        `);
    });

    afterEach(() => {
        if (component?.destroy) {
            component.destroy();
        }
    });

    it("should initialize", () => {
        component = new MyComponent(element);
        expect(component).toBeDefined();
    });

    it("should handle click", async () => {
        component = new MyComponent(element);
        click(element);
        // Assert expected behavior
    });
});
```

### Testing with Mocks

```typescript
import { vi } from "vitest";

// Mock callback
const onOpen = vi.fn();
component = new MyComponent(element, { onOpen });

// Assert callback called
expect(onOpen).toHaveBeenCalled();
expect(onOpen).toHaveBeenCalledWith(expectedArg);

// Mock timers for animations
vi.useFakeTimers();
component.animate();
vi.advanceTimersByTime(300);
vi.useRealTimers();
```

### Integration Tests

```typescript
describe("Component Integration", () => {
    it("should work with auto-init", async () => {
        document.body.innerHTML = `
            <div data-ss="tooltip" data-ss-tooltip-content="Hello">
                Hover me
            </div>
        `;

        const { init } = await import("../../src/ts/init/autoInit");
        await init();

        // Component should be initialized
    });
});
```

## Coverage

Coverage reports are generated in the `coverage/` directory. The project aims
for:

- **Lines**: 60%
- **Functions**: 60%
- **Branches**: 50%
- **Statements**: 60%

## Mocked APIs

The test setup automatically mocks:

- `ResizeObserver`
- `IntersectionObserver`
- `MutationObserver`
- `matchMedia`
- `requestAnimationFrame` / `cancelAnimationFrame`
- `window.scrollTo`

## Best Practices

1. **Reset DOM** between tests - handled by setup.ts
2. **Clean up instances** in afterEach to prevent memory leaks
3. **Use fixtures** for consistent HTML structure
4. **Test accessibility** - check ARIA attributes and keyboard nav
5. **Mock timers** for animation tests
6. **Test error cases** - invalid inputs, missing elements

## Dependencies

- `vitest` - Test runner
- `jsdom` - DOM environment
- `@vitest/coverage-v8` - Coverage reporting
- `@vitest/ui` - Visual test UI
