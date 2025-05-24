// // Manages collapsible sections in the UI, allowing them to be expanded or collapsed.

// export default class CollapsibleSectionManager {
//     private section: HTMLElement

//     constructor(sectionId: string) {
//         this.section = document.getElementById(sectionId) as HTMLElement
//         this.section.addEventListener('click', this.toggle.bind(this))
//     }

//     private toggle(): void {
//         this.section.classList.toggle('collapsed')
//     }
// }

// // Usage
// const collapsibleSectionManager = new CollapsibleSectionManager('myCollapsibleSection')
