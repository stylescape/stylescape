// Copyright 2024 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



// Manages the display of tooltips on hover or focus.

export default class TooltipManager {
    private triggers: NodeListOf<HTMLElement>;

    constructor() {
        this.triggers = document.querySelectorAll('.tooltip-trigger');
        this.triggers.forEach(trigger => {
            trigger.addEventListener('mouseover', () => this.showTooltip(trigger));
            trigger.addEventListener('mouseout', () => this.hideTooltip(trigger));
        });
    }

    private showTooltip(trigger: HTMLElement): void {
        const tooltip = trigger.querySelector('.tooltip');
        tooltip?.classList.add('visible');
    }

    private hideTooltip(trigger: HTMLElement): void {
        const tooltip = trigger.querySelector('.tooltip');
        tooltip?.classList.remove('visible');
    }
}

// Usage
const tooltipManager = new TooltipManager();



// class TooltipTriggerManager {
//     private triggers: NodeListOf<HTMLElement>;

//     constructor(tooltipTriggerSelector: string) {
//         this.triggers = document.querySelectorAll(tooltipTriggerSelector);
//         this.triggers.forEach(trigger => {
//             trigger.addEventListener('mouseover', this.showTooltip.bind(this, trigger));
//             trigger.addEventListener('mouseout', this.hideTooltip.bind(this, trigger));
//             // Add focus and blur event listeners for keyboard accessibility
//         });
//     }

//     private showTooltip(trigger: HTMLElement): void {
//         const tooltip = document.getElementById(trigger.getAttribute('aria-describedby')!);
//         tooltip!.style.display = 'block';
//     }

//     private hideTooltip(trigger: HTMLElement): void {
//         const tooltip = document.getElementById(trigger.getAttribute('aria-describedby')!);
//         tooltip!.style.display =
