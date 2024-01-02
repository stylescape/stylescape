// ============================================================================
// States
// ============================================================================


export function toggleState(x: HTMLElement) {
  let state = "active";
  if (x.classList.contains(state)) {
      x.classList.remove(state);
  } else {
      x.classList.add(state);
  }
}


export {};
