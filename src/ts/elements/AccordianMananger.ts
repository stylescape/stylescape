// Manages accordion-style collapsible elements.

// export default class AccordionManager {
//     private accordionHeaders: NodeListOf<HTMLElement>

//     constructor(selector: string) {
//         this.accordionHeaders = document.querySelectorAll(selector)
//         this.accordionHeaders.forEach((header) => {
//             header.addEventListener('click', this.toggleAccordion.bind(this, header))
//         })
//     }

//     private toggleAccordion(header: HTMLElement): void {
//         const content = header.nextElementSibling as HTMLElement
//         content.style.display = content.style.display === 'block' ? 'none' : 'block'
//     }
// }

// Usage
// const accordionManager = new AccordionManager('.accordion-header')

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
