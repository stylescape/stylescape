# Auto-Initialization System

Stylescape includes a powerful auto-initialization system that automatically
initializes JavaScript components based on `data-ss-*` attributes. This
provides a **plug-and-play** experience similar to Bootstrap, where components
work without writing any JavaScript code.

---

## Quick Start

### Basic Usage

Simply add the `data-ss` attribute to any element to initialize a component:

```html
<!-- Tooltip -->
<button data-ss="tooltip" data-ss-tooltip-text="Hello World!">Hover me</button>

<!-- Modal trigger -->
<button data-ss="modal" data-ss-modal-target="#myModal">Open Modal</button>

<!-- Multiple components on one element -->
<button
    data-ss="tooltip modal"
    data-ss-tooltip-text="Opens a modal"
    data-ss-modal-target="#myModal"
>
    Hover or Click
</button>
```

### Enable Auto-Init

**Option 1: Script attribute (recommended)**

```html
<script src="stylescape.js" data-ss-auto></script>
```

**Option 2: Global flag**

```html
<script>
    window.STYLESCAPE_AUTO_INIT = true;
</script>
<script src="stylescape.js"></script>
```

**Option 3: Manual initialization**

```javascript
import { autoStart } from "stylescape";
autoStart();
```

---

## Attribute Convention

All Stylescape data attributes follow a consistent naming pattern:

| Pattern                        | Purpose                | Example                                   |
| ------------------------------ | ---------------------- | ----------------------------------------- |
| `data-ss="component"`          | Initialize a component | `data-ss="tooltip"`                       |
| `data-ss="a b"`                | Multiple components    | `data-ss="tooltip modal"`                 |
| `data-ss-{component}-{option}` | Component option       | `data-ss-tooltip-position="top"`          |
| `data-ss-{component}-config`   | JSON configuration     | `data-ss-tooltip-config='{"delay": 200}'` |
| `data-ss-manual`               | Opt-out of auto-init   | `data-ss="tooltip" data-ss-manual`        |

### Examples

```html
<!-- Simple tooltip -->
<span data-ss="tooltip" data-ss-tooltip-text="Help text"> Info </span>

<!-- Tooltip with options -->
<button
    data-ss="tooltip"
    data-ss-tooltip-text="Click to submit"
    data-ss-tooltip-position="bottom"
>
    Submit
</button>

<!-- Using JSON config -->
<div
    data-ss="carousel"
    data-ss-carousel-config='{"autoplay": true, "interval": 3000}'
>
    ...
</div>

<!-- Manual initialization (opt-out) -->
<div data-ss="accordion" data-ss-manual>
    <!-- Will NOT auto-initialize -->
</div>
```

---

## Available Components

### Element Handlers

| Component           | Description                | Key Options          |
| ------------------- | -------------------------- | -------------------- |
| `aside`             | Sidebar/drawer toggle      | `menuId`, `switchId` |
| `dropdown`          | Dropdown menus             | `selector`           |
| `collapsible-table` | Collapsible table rows     | -                    |
| `details`           | Details/summary manager    | -                    |
| `exclusive-details` | One-open-at-a-time details | `selector`           |
| `password-toggle`   | Show/hide password field   | -                    |

### Interactive Components

| Component   | Description            | Key Options            |
| ----------- | ---------------------- | ---------------------- |
| `tooltip`   | Tooltip on hover/focus | `text`, `position`     |
| `modal`     | Modal dialog trigger   | `target`               |
| `accordion` | Collapsible sections   | `multiple`             |
| `tabs`      | Tab navigation         | -                      |
| `carousel`  | Image/content carousel | `autoplay`, `interval` |

### Media & Utilities

| Component       | Description               | Key Options |
| --------------- | ------------------------- | ----------- |
| `image-compare` | Before/after image slider | -           |
| `theme-toggle`  | Dark/light mode switch    | `toggleId`  |

---

## Component Reference

### Tooltip

Displays a tooltip on hover or focus.

```html
<button
    data-ss="tooltip"
    data-ss-tooltip-text="Tooltip text"
    data-ss-tooltip-position="top"
>
    Hover me
</button>
```

**Options:**

| Option     | Type   | Default | Description                                |
| ---------- | ------ | ------- | ------------------------------------------ |
| `text`     | string | `""`    | Tooltip content                            |
| `position` | string | `"top"` | Position: `top`, `bottom`, `left`, `right` |

---

### Modal

Opens a modal dialog when triggered.

```html
<button data-ss="modal" data-ss-modal-target="#myModal">Open Modal</button>

<div id="myModal" class="modal">
    <div class="modal__content">
        <button data-ss-modal-close>×</button>
        <p>Modal content here</p>
    </div>
</div>
```

**Options:**

| Option   | Type   | Default | Description                    |
| -------- | ------ | ------- | ------------------------------ |
| `target` | string | -       | CSS selector for modal element |

---

### Accordion

Collapsible content sections.

```html
<div data-ss="accordion" data-ss-accordion-multiple="false">
    <div data-ss-accordion-item>
        <button data-ss-accordion-header>Section 1</button>
        <div data-ss-accordion-content>Content 1</div>
    </div>
    <div data-ss-accordion-item>
        <button data-ss-accordion-header>Section 2</button>
        <div data-ss-accordion-content>Content 2</div>
    </div>
</div>
```

**Options:**

| Option     | Type    | Default | Description                  |
| ---------- | ------- | ------- | ---------------------------- |
| `multiple` | boolean | `false` | Allow multiple sections open |

---

### Tabs

Tab-based content navigation.

```html
<div data-ss="tabs">
    <div data-ss-tab-list>
        <button data-ss-tab="tab1">Tab 1</button>
        <button data-ss-tab="tab2">Tab 2</button>
    </div>
    <div data-ss-tab-panel="tab1">Content 1</div>
    <div data-ss-tab-panel="tab2">Content 2</div>
</div>
```

---

### Carousel

Image or content carousel/slider.

```html
<div
    data-ss="carousel"
    data-ss-carousel-autoplay="true"
    data-ss-carousel-interval="5000"
>
    <div data-ss-carousel-slide>Slide 1</div>
    <div data-ss-carousel-slide>Slide 2</div>
    <div data-ss-carousel-slide>Slide 3</div>
    <button data-ss-carousel-prev>Previous</button>
    <button data-ss-carousel-next>Next</button>
</div>
```

**Options:**

| Option     | Type    | Default | Description              |
| ---------- | ------- | ------- | ------------------------ |
| `autoplay` | boolean | `true`  | Auto-advance slides      |
| `interval` | number  | `5000`  | Time between slides (ms) |

---

## JavaScript API

### Global Object

The `Stylescape` object is available globally:

```javascript
// Initialize all components in an element
Stylescape.init(document.querySelector("#my-container"));

// Get a component instance
const tooltip = Stylescape.getInstance(element, "tooltip");
tooltip.show();

// Get all instances on an element
const instances = Stylescape.getAllInstances(element);

// Reinitialize a component
Stylescape.reinit(element, "tooltip");

// Destroy a component
Stylescape.destroy(element, "tooltip");

// Start/stop observing for dynamic content
Stylescape.observe(document.body);
Stylescape.stopObserving();
```

### Configuration

```javascript
// Disable auto-initialization
Stylescape.autoInit = false;

// Enable debug logging
Stylescape.debug = true;

// Check registered components
console.log(Stylescape.getComponentNames());
```

### Module Imports

```javascript
import {
    init,
    getInstance,
    reinit,
    destroy,
    registerComponent,
} from "stylescape";

// Initialize manually
init();

// Get instance
const modal = getInstance(element, "modal");
modal.open();
```

---

## Registering Custom Components

You can register your own components to use with the auto-init system:

```javascript
import { registerComponent } from "stylescape";

// Register a custom component
registerComponent("custom-slider", {
    handler: (element, config) => {
        // Initialize your component
        return new MyCustomSlider(element, {
            min: config.min || 0,
            max: config.max || 100,
            step: config.step || 1,
        });
    },
    defaults: {
        min: 0,
        max: 100,
        step: 1,
    },
});
```

Then use it in HTML:

```html
<div
    data-ss="custom-slider"
    data-ss-custom-slider-min="0"
    data-ss-custom-slider-max="50"
></div>
```

---

## Dynamic Content

The auto-init system automatically observes the DOM for dynamically added
content using `MutationObserver`. New elements with `data-ss` attributes will
be initialized automatically.

```javascript
// Dynamic content is automatically detected
document.body.innerHTML += `
    <button data-ss="tooltip" data-ss-tooltip-text="I'm new!">
        New Button
    </button>
`;
// ↑ Tooltip is automatically initialized
```

### Manual Control

```javascript
// Stop observing
Stylescape.stopObserving();

// Add content manually
container.innerHTML = '<div data-ss="accordion">...</div>';

// Initialize manually
Stylescape.init(container);

// Resume observing
Stylescape.observe();
```

---

## Multiple Components Per Element

One of Stylescape's powerful features is the ability to attach multiple
components to a single element:

```html
<!-- Button with tooltip AND modal trigger -->
<button
    data-ss="tooltip modal"
    data-ss-tooltip-text="Click to open settings"
    data-ss-tooltip-position="top"
    data-ss-modal-target="#settingsModal"
>
    ⚙ Settings
</button>
```

Access individual instances:

```javascript
const button = document.querySelector("button");

// Get tooltip instance
const tooltip = Stylescape.getInstance(button, "tooltip");
tooltip.hide();

// Get modal instance
const modal = Stylescape.getInstance(button, "modal");
modal.open();

// Get all instances
const all = Stylescape.getAllInstances(button);
// Map { 'tooltip' => {...}, 'modal' => {...} }
```

---

## Best Practices

### 1. Use Semantic HTML

```html
<!-- Good: Semantic element with component -->
<button data-ss="tooltip" data-ss-tooltip-text="Submit form">Submit</button>

<!-- Avoid: Non-semantic element -->
<span data-ss="tooltip" data-ss-tooltip-text="Submit form"> Submit </span>
```

### 2. Provide Accessibility Attributes

```html
<button
    data-ss="modal"
    data-ss-modal-target="#dialog"
    aria-haspopup="dialog"
    aria-expanded="false"
>
    Open Dialog
</button>
```

### 3. Use JSON Config for Complex Options

```html
<!-- For simple options, use individual attributes -->
<div
    data-ss="carousel"
    data-ss-carousel-autoplay="true"
    data-ss-carousel-interval="3000"
></div>

<!-- For many options, use JSON -->
<div
    data-ss="carousel"
    data-ss-carousel-config='{
         "autoplay": true,
         "interval": 3000,
         "pauseOnHover": true,
         "showIndicators": true
     }'
></div>
```

### 4. Clean Up When Removing Elements

```javascript
// Always destroy before removing if not using MutationObserver
Stylescape.destroy(element);
element.remove();
```

---

## Troubleshooting

### Component Not Initializing

1. Ensure auto-init is enabled
2. Check the component name is correct (lowercase)
3. Look for console errors
4. Enable debug mode: `Stylescape.debug = true`

### Multiple Instances Issue

```javascript
// Check if already initialized
if (!Stylescape.getInstance(element, "tooltip")) {
    Stylescape.init(element);
}
```

### Dynamic Content Not Working

```javascript
// Ensure observer is running
Stylescape.observe(document.body);
```

---

## Browser Support

The auto-init system uses modern JavaScript features:

- `MutationObserver` - IE11+
- `WeakMap` - IE11+
- ES6 Classes - Modern browsers

For legacy browser support, include appropriate polyfills.
