// ============================================================================
// Stylescape | Elements Module Index
// ============================================================================
// Re-exports all element components for convenient importing.
// ============================================================================

/**
 * @module elements
 * @description
 * This module exports all UI element components from the Stylescape library.
 * Components include modals, tooltips, accordions, dropdowns, tabs, and more.
 *
 * @example
 * ```typescript
 * import { Modal, Tooltip, AccordionManager } from "stylescape/elements"
 *
 * const modal = new Modal("#myModal")
 * const tooltip = new Tooltip("#helpIcon")
 * const accordion = new AccordionManager(".faq")
 * ```
 */

// export { ExclusiveDetails } from "./ExclusiveDetails";

// export { AsideHandler } from "./AsideHandler";

// Drilldown Menu
export { DrilldownMenuManager } from "./DrilldownMenuManager";
export type { DrilldownMenuOptions } from "./DrilldownMenuManager";

// Responsive Table
export { ResponsiveTableManager } from "./ResponsiveTableManager";
export type { ResponsiveTableOptions } from "./ResponsiveTableManager";
