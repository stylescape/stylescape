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



// Manages accordion-style collapsible elements.




export default class AccordionManager {
    private accordionHeaders: NodeListOf<HTMLElement>;

    constructor(selector: string) {
        this.accordionHeaders = document.querySelectorAll(selector);
        this.accordionHeaders.forEach(header => {
            header.addEventListener('click', this.toggleAccordion.bind(this, header));
        });
    }

    private toggleAccordion(header: HTMLElement): void {
        const content = header.nextElementSibling as HTMLElement;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    }
}

// Usage
const accordionManager = new AccordionManager('.accordion-header');



// class AccordionItemManager {
//     private header: HTMLElement;
//     private content: HTMLElement;

//     constructor(headerId: string, contentId: string) {
//         this.header = document.getElementById(headerId) as HTMLElement;
//         this.content = document.getElementById(contentId) as HTMLElement;
//         this.header.addEventListener('click', this.toggle.bind(this));
//     }

//     private toggle(): void {
//         this.content.style.display = this.content.style.display === 'none' ? 'block' : 'none';
//     }
// }

// // Usage
// const accordionItemManager = new AccordionItemManager('accordionHeader', 'accordionContent');
