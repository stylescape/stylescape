// // Manages the display of tooltips on hover or focus.

// export default class TooltipManager {
//     private triggers: NodeListOf<HTMLElement>

//     constructor() {
//         this.triggers = document.querySelectorAll('.tooltip-trigger')
//         this.triggers.forEach((trigger) => {
//             trigger.addEventListener('mouseover', () => this.showTooltip(trigger))
//             trigger.addEventListener('mouseout', () => this.hideTooltip(trigger))
//         })
//     }

//     private showTooltip(trigger: HTMLElement): void {
//         const tooltip = trigger.querySelector('.tooltip')
//         tooltip?.classList.add('visible')
//     }

//     private hideTooltip(trigger: HTMLElement): void {
//         const tooltip = trigger.querySelector('.tooltip')
//         tooltip?.classList.remove('visible')
//     }
// }

// // Usage
// const tooltipManager = new TooltipManager()

// // class TooltipTriggerManager {
// //     private triggers: NodeListOf<HTMLElement>;

// //     constructor(tooltipTriggerSelector: string) {
// //         this.triggers = document.querySelectorAll(tooltipTriggerSelector);
// //         this.triggers.forEach(trigger => {
// //             trigger.addEventListener('mouseover', this.showTooltip.bind(this, trigger));
// //             trigger.addEventListener('mouseout', this.hideTooltip.bind(this, trigger));
// //             // Add focus and blur event listeners for keyboard accessibility
// //         });
// //     }

// //     private showTooltip(trigger: HTMLElement): void {
// //         const tooltip = document.getElementById(trigger.getAttribute('aria-describedby')!);
// //         tooltip!.style.display = 'block';
// //     }

// //     private hideTooltip(trigger: HTMLElement): void {
// //         const tooltip = document.getElementById(trigger.getAttribute('aria-describedby')!);
// //         tooltip!.style.display =
