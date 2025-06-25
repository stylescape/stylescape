// type GridLayer = HTMLElement & { dataset: { grid: string } };
// type ToggleButton = HTMLButtonElement & { dataset: { toggle: string } };
// const STORAGE_KEY = 'unitgl:grid:visibility';

// /**
//  * Load visibility map from localStorage.
//  */
// function loadVisibility(): Record<string, boolean> {
//   try {
//     return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
//   } catch {
//     return {};
//   }
// }

// /**
//  * Save updated visibility map to localStorage.
//  */
// function saveVisibility(visibilityMap: Record<string, boolean>): void {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(visibilityMap));
// }

// /**
//  * Update height of all grid overlays to match document scroll height.
//  */
// function updateAllGridHeights(): void {
//   const height = Math.max(
//     document.body.scrollHeight,
//     document.documentElement.scrollHeight
//   );

//   document.querySelectorAll<HTMLElement>('.grid_layer').forEach(layer => {
//     // Avoid recursive layout inflation
//     if (layer.offsetHeight !== height) {
//       layer.style.height = `${height}px`;
//     }
//   });
// }

// /**
//  * Update the indicator badge on a toggle button.
//  */
// function updateStatusIndicator(id: string, isHidden: boolean): void {
//   const badge = document.querySelector<HTMLSpanElement>(`[data-status="${id}"]`);
//   if (badge) {
//     badge.textContent = isHidden ? '✕ Off' : '✓ On';
//   }
// }

// /**
//  * Apply saved visibility state to grid layers and badges.
//  */
// function applyVisibilityState(state: Record<string, boolean>): void {
//   document.querySelectorAll<GridLayer>('.grid_layer').forEach(layer => {
//     const id = layer.dataset.grid;
//     const hidden = !!state[id];
//     layer.classList.toggle('is-hidden', hidden);
//     updateStatusIndicator(id, hidden);
//   });
// }

// /**
//  * Hook up buttons to toggle grid visibility and update state.
//  */
// function setupGridToggles(): void {
//   const visibility = loadVisibility();

//   const buttons = document.querySelectorAll<ToggleButton>('button[data-toggle]');
//   buttons.forEach(button => {
//     const id = button.dataset.toggle;
//     const layer = document.querySelector<GridLayer>(`[data-grid="${id}"]`);
//     if (!layer) return;

//     button.addEventListener('click', () => {
//       const isNowHidden = layer.classList.toggle('is-hidden');
//       visibility[id] = isNowHidden;
//       saveVisibility(visibility);
//       updateStatusIndicator(id, isNowHidden);
//     });
//   });

//   applyVisibilityState(visibility);
// }

// Initialize on DOM ready
// document.addEventListener('DOMContentLoaded', () => {
//   updateAllGridHeights();
//   setupGridToggles();

//   window.addEventListener('resize', updateAllGridHeights);
//   window.addEventListener('scroll', updateAllGridHeights);
// });
