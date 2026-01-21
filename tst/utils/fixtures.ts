// ============================================================================
// Stylescape | Test Fixtures
// ============================================================================
// HTML templates and fixtures for testing components.
// ============================================================================

/**
 * Modal component HTML fixture
 */
export const modalFixture = `
<button id="modal-trigger" data-ss-modal-trigger="#test-modal">Open Modal</button>
<div id="test-modal" 
     data-ss="modal" 
     data-ss-modal-close-backdrop="true"
     role="dialog"
     aria-modal="true"
     hidden>
    <div class="modal-backdrop"></div>
    <div class="modal-content" data-ss-modal-content>
        <button class="modal-close" data-ss-modal-close aria-label="Close">&times;</button>
        <h2 id="modal-title">Test Modal</h2>
        <p>Modal content here</p>
    </div>
</div>
`

/**
 * Tooltip component HTML fixture
 */
export const tooltipFixture = `
<button id="tooltip-trigger"
        data-ss="tooltip"
        data-ss-tooltip-content="Test tooltip content"
        data-ss-tooltip-position="top">
    Hover me
</button>
`

/**
 * Accordion component HTML fixture
 */
export const accordionFixture = `
<div data-ss="accordion" id="test-accordion">
    <div class="accordion-item">
        <button class="accordion-header" data-ss-accordion-trigger aria-expanded="false">
            Section 1
        </button>
        <div class="accordion-panel" data-ss-accordion-panel hidden>
            <p>Content for section 1</p>
        </div>
    </div>
    <div class="accordion-item">
        <button class="accordion-header" data-ss-accordion-trigger aria-expanded="false">
            Section 2
        </button>
        <div class="accordion-panel" data-ss-accordion-panel hidden>
            <p>Content for section 2</p>
        </div>
    </div>
    <div class="accordion-item">
        <button class="accordion-header" data-ss-accordion-trigger aria-expanded="false">
            Section 3
        </button>
        <div class="accordion-panel" data-ss-accordion-panel hidden>
            <p>Content for section 3</p>
        </div>
    </div>
</div>
`

/**
 * Dropdown component HTML fixture
 */
export const dropdownFixture = `
<div class="select_dropdown" data-ss="dropdown">
    <button class="dropdown-trigger" aria-expanded="false" aria-haspopup="listbox">
        Select an option
    </button>
    <ul class="dropdown-menu" role="listbox" hidden>
        <li role="option" data-value="1">Option 1</li>
        <li role="option" data-value="2">Option 2</li>
        <li role="option" data-value="3">Option 3</li>
    </ul>
</div>
`

/**
 * Toggle switch component HTML fixture
 */
export const toggleFixture = `
<label class="toggle-switch">
    <input type="checkbox" 
           id="test-toggle"
           data-ss="toggle-switch"
           data-ss-toggle-switch-label-on="ON"
           data-ss-toggle-switch-label-off="OFF">
    <span class="toggle-slider"></span>
</label>
`

/**
 * Notification component HTML fixture
 */
export const notificationFixture = `
<div id="notification-container" data-ss="notification">
    <div class="notification notification--success" role="alert">
        <span class="notification-message">Success message</span>
        <button class="notification-close" aria-label="Close">&times;</button>
    </div>
</div>
`

/**
 * Tabs component HTML fixture
 */
export const tabsFixture = `
<div data-ss="tabs" id="test-tabs">
    <div class="tabs-list" role="tablist">
        <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">Tab 1</button>
        <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2">Tab 2</button>
        <button role="tab" id="tab-3" aria-selected="false" aria-controls="panel-3">Tab 3</button>
    </div>
    <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">Panel 1 content</div>
    <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>Panel 2 content</div>
    <div role="tabpanel" id="panel-3" aria-labelledby="tab-3" hidden>Panel 3 content</div>
</div>
`

/**
 * Form validation fixture
 */
export const formValidationFixture = `
<form id="test-form" data-ss="form-validator" novalidate>
    <div class="form-field">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required data-ss-validate="email">
        <span class="error-message" data-ss-error-for="email"></span>
    </div>
    <div class="form-field">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="8" data-ss-validate="password">
        <span class="error-message" data-ss-error-for="password"></span>
    </div>
    <div class="form-field">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" name="confirm-password" data-ss-validate="match" data-ss-match="password">
        <span class="error-message" data-ss-error-for="confirm-password"></span>
    </div>
    <button type="submit">Submit</button>
</form>
`

/**
 * Preloader component HTML fixture
 */
export const preloaderFixture = `
<div class="preloader" 
     id="test-preloader"
     data-ss="preloader"
     data-ss-preloader-timeout="500"
     data-ss-preloader-min-display="200">
    <div class="preloader__spinner"></div>
</div>
`

/**
 * Theme toggler fixture
 */
export const themeTogglerFixture = `
<button id="theme-toggle"
        data-ss="theme-toggle"
        aria-label="Toggle dark mode">
    <span class="theme-icon theme-icon--light">☀️</span>
    <span class="theme-icon theme-icon--dark">🌙</span>
</button>
`

/**
 * Cookie consent fixture
 */
export const cookieConsentFixture = `
<div id="cookie-consent"
     data-ss="cookie-consent"
     data-ss-cookie-consent-key="cookie_consent"
     data-ss-cookie-consent-duration="365"
     hidden>
    <div class="cookie-consent-content">
        <p>We use cookies to improve your experience.</p>
        <button data-ss-cookie-consent-accept>Accept</button>
        <button data-ss-cookie-consent-decline>Decline</button>
    </div>
</div>
`

/**
 * Collapsible section fixture
 */
export const collapsibleFixture = `
<div data-ss="collapsible-section" id="test-collapsible">
    <button class="collapsible-trigger" 
            data-ss-collapsible-trigger
            aria-expanded="false"
            aria-controls="collapsible-content">
        Toggle Content
    </button>
    <div id="collapsible-content" 
         class="collapsible-content"
         data-ss-collapsible-content
         hidden>
        <p>Collapsible content here</p>
    </div>
</div>
`

/**
 * Progress bar fixture
 */
export const progressBarFixture = `
<div class="progress-bar"
     data-ss="progress-bar"
     data-ss-progress-bar-value="50"
     data-ss-progress-bar-max="100"
     role="progressbar"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100">
    <div class="progress-bar__fill"></div>
    <span class="progress-bar__label">50%</span>
</div>
`

/**
 * Image compare slider fixture
 */
export const imageCompareFixture = `
<div class="image-compare"
     data-ss="image-compare"
     data-ss-image-compare-initial="50">
    <img src="before.jpg" alt="Before" class="image-compare__before">
    <img src="after.jpg" alt="After" class="image-compare__after">
    <div class="image-compare__slider"></div>
</div>
`

/**
 * Auto-init test fixture with multiple components
 */
export const autoInitFixture = `
<div id="app">
    <button data-ss="tooltip" data-ss-tooltip-content="Help text">Help</button>
    
    <button data-ss-modal-trigger="#modal1">Open Modal</button>
    <div id="modal1" data-ss="modal" hidden>
        <div data-ss-modal-content>Modal content</div>
    </div>
    
    <div data-ss="accordion">
        <button data-ss-accordion-trigger>Toggle</button>
        <div data-ss-accordion-panel hidden>Content</div>
    </div>
</div>
`
