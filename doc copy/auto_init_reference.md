# Auto-Init Quick Reference

> Quick reference card for Stylescape's data-attribute based component
> initialization.

---

## Attribute Format

```
data-ss="{component}"                    → Initialize component
data-ss="{component1} {component2}"      → Multiple components
data-ss-{component}-{option}="{value}"   → Component option
data-ss-{component}-config='{json}'      → JSON configuration
data-ss-manual                           → Disable auto-init for element
```

---

## Components

### Tooltip

```html
<span
    data-ss="tooltip"
    data-ss-tooltip-text="Help text"
    data-ss-tooltip-position="top|bottom|left|right"
></span>
```

### Modal

```html
<button data-ss="modal" data-ss-modal-target="#modalId"></button>
```

### Accordion

```html
<div data-ss="accordion" data-ss-accordion-multiple="true|false">
    <div data-ss-accordion-item>
        <button data-ss-accordion-header>Title</button>
        <div data-ss-accordion-content>Content</div>
    </div>
</div>
```

### Tabs

```html
<div data-ss="tabs">
    <div data-ss-tab-list>
        <button data-ss-tab="id1">Tab 1</button>
    </div>
    <div data-ss-tab-panel="id1">Content</div>
</div>
```

### Carousel

```html
<div
    data-ss="carousel"
    data-ss-carousel-autoplay="true"
    data-ss-carousel-interval="5000"
>
    <div data-ss-carousel-slide>Slide</div>
    <button data-ss-carousel-prev>←</button>
    <button data-ss-carousel-next>→</button>
</div>
```

### Theme Toggle

```html
<button id="themeToggle" data-ss="theme-toggle">🌓</button>
```

### Dropdown

```html
<div class="select_dropdown" data-ss="dropdown"></div>
```

---

## JavaScript API

```javascript
// Initialize
Stylescape.init(element?)

// Get instance
Stylescape.getInstance(element, 'componentName')
Stylescape.getAllInstances(element)

// Lifecycle
Stylescape.reinit(element, 'componentName'?)
Stylescape.destroy(element, 'componentName'?)

// Observer
Stylescape.observe(root?)
Stylescape.stopObserving()

// Config
Stylescape.autoInit = true|false
Stylescape.debug = true|false

// Registry
Stylescape.registerComponent(name, { handler, defaults })
Stylescape.hasComponent(name)
Stylescape.getComponentNames()
```

---

## Enable Auto-Init

```html
<!-- Option 1: Script attribute -->
<script src="stylescape.js" data-ss-auto></script>

<!-- Option 2: Global flag -->
<script>
    window.STYLESCAPE_AUTO_INIT = true;
</script>

<!-- Option 3: Manual -->
<script>
    import { autoStart } from "stylescape";
    autoStart();
</script>
```

---

## Register Custom Component

```javascript
Stylescape.registerComponent("my-widget", {
    handler: (el, config) => new MyWidget(el, config),
    defaults: { option: "value" },
});
```

```html
<div data-ss="my-widget" data-ss-my-widget-option="custom"></div>
```
