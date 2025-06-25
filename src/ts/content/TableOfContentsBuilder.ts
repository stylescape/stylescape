import { ScrollSpyManager } from "../scroll/ScrollSpyManager.js"

export class TableOfContentsBuilder {
    private rootId: string
    private tocContainerId: string
    private idSet = new Set<string>()
    private linkSectionMap = new Map<HTMLElement, HTMLElement>()
    private scrollSpyManager?: ScrollSpyManager

    constructor(rootId: string, tocContainerId: string) {
        this.rootId = rootId
        this.tocContainerId = tocContainerId
    }

    private generateUniqueId(baseId: string): string {
        let id = baseId
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
        let count = 1
        while (this.idSet.has(id)) {
            id = `${baseId}-${count++}`
        }
        this.idSet.add(id)
        return id
    }

    private createTOCEntry(element: HTMLElement): HTMLLIElement {
        const text = element.getAttribute("data-label") || "Untitled"
        const id = this.generateUniqueId(text)
        element.id = id

        const a = document.createElement("a")
        a.href = `#${id}`
        a.textContent = text

        const li = document.createElement("li")
        li.appendChild(a)

        this.linkSectionMap.set(a, element)
        return li
    }

    private buildTOCTree(element: HTMLElement): HTMLUListElement {
        const ul = document.createElement("ul")

        Array.from(element.children).forEach((child) => {
            if (!(child instanceof HTMLElement)) return

            if (child.hasAttribute("data-label")) {
                const li = this.createTOCEntry(child)
                const nestedUL = this.buildTOCTree(child)
                if (nestedUL.children.length > 0) {
                    li.appendChild(nestedUL)
                }
                ul.appendChild(li)
            } else {
                const nested = this.buildTOCTree(child)
                if (nested.children.length > 0) {
                    ul.append(...Array.from(nested.children))
                }
            }
        })

        return ul
    }

    buildAndAppendTOC(): void {
        const root = document.getElementById(this.rootId)
        const tocContainer = document.getElementById(this.tocContainerId)

        if (!root || !tocContainer) return

        const tocTree = this.buildTOCTree(root)
        tocContainer.innerHTML = ""
        tocContainer.appendChild(tocTree)

        this.scrollSpyManager = new ScrollSpyManager(
            Array.from(this.linkSectionMap.values()),
            `#${this.tocContainerId} a`,
            this.rootId,
        )
    }

    getLinkSectionMap(): Map<HTMLElement, HTMLElement> {
        return this.linkSectionMap
    }
}

// import { ScrollSpyManager } from "../scroll/ScrollSpyManager.js"

// export class TableOfContentsBuilder {
//     private contentElementId: string
//     private tocContainerId: string
//     private linkSectionMap = new Map<HTMLElement, HTMLElement>()
//     private idSet = new Set<string>()
//     private scrollSpyManager?: ScrollSpyManager

//     constructor(contentElementId: string, tocContainerId: string) {
//         this.contentElementId = contentElementId
//         this.tocContainerId = tocContainerId
//     }

//     private generateUniqueId(base: string): string {
//         let id = base
//             .toLowerCase()
//             .replace(/\s+/g, "-")
//             .replace(/[^\w-]/g, "")
//         let uniqueId = id
//         let count = 1
//         while (this.idSet.has(uniqueId)) {
//             uniqueId = `${id}-${count++}`
//         }
//         this.idSet.add(uniqueId)
//         return uniqueId
//     }

//     build(): void {
//         const contentEl = document.getElementById(this.contentElementId)
//         const tocEl = document.getElementById(this.tocContainerId)
//         if (!contentEl || !tocEl) return

//         const sections = Array.from(
//             contentEl.querySelectorAll<HTMLElement>(
//                 "[data-label][data-level]",
//             ),
//         )
//             .map((el) => {
//                 const label = el.dataset.label?.trim() || "Untitled"
//                 const level = parseInt(el.dataset.level || "1", 10)
//                 return { el, label, level }
//             })
//             .filter(({ level }) => !isNaN(level))
//             .sort((a, b) => a.level - b.level)

//         const rootList = document.createElement("ul")
//         const stack: { level: number; list: HTMLUListElement }[] = [
//             { level: 0, list: rootList },
//         ]

//         for (const { el, label, level } of sections) {
//             const id = el.id || this.generateUniqueId(label)
//             el.id = id

//             const link = document.createElement("a")
//             link.href = `#${id}`
//             link.textContent = label

//             const listItem = document.createElement("li")
//             listItem.appendChild(link)

//             // Find correct nesting level
//             while (
//                 stack.length > 1 &&
//                 level <= stack[stack.length - 1].level
//             ) {
//                 stack.pop()
//             }

//             const parentList = stack[stack.length - 1].list
//             parentList.appendChild(listItem)

//             // Prepare for deeper nesting
//             const subList = document.createElement("ul")
//             listItem.appendChild(subList)
//             stack.push({ level, list: subList })

//             this.linkSectionMap.set(link, el)
//         }

//         tocEl.innerHTML = ""
//         tocEl.appendChild(rootList)

//         this.scrollSpyManager = new ScrollSpyManager(
//             Array.from(this.linkSectionMap.values()),
//             `#${this.tocContainerId} a`,
//             this.contentElementId,
//         )
//     }

//     getLinkSectionMap(): Map<HTMLElement, HTMLElement> {
//         return this.linkSectionMap
//     }
// }

// import { ScrollSpyManager } from "../scroll/ScrollSpyManager.js"

// export class TableOfContentsBuilder {
//     private contentElementId: string
//     private tocContainerId: string
//     private idSet = new Set<string>()
//     private linkSectionMap = new Map<HTMLElement, HTMLElement>()
//     private scrollSpyManager?: ScrollSpyManager

//     constructor(contentElementId: string, tocContainerId: string) {
//         this.contentElementId = contentElementId
//         this.tocContainerId = tocContainerId
//     }

//     private generateUniqueId(baseId: string): string {
//         let uniqueId = baseId
//         let count = 1
//         while (this.idSet.has(uniqueId)) {
//             uniqueId = `${baseId}-${count++}`
//         }
//         this.idSet.add(uniqueId)
//         return uniqueId
//     }

//     buildAndAppendTOC(): void {
//         const contentElement = document.getElementById(this.contentElementId)
//         const tocContainer = document.getElementById(this.tocContainerId)

//         if (!contentElement || !tocContainer) return

//         const headers = contentElement.querySelectorAll<HTMLElement>(
//             "h1.main_portal_content_section_header, " +
//                 "h2.main_portal_content_section_header, " +
//                 "h3.main_portal_content_section_header, " +
//                 "h4.main_portal_content_section_header, " +
//                 "h5.main_portal_content_section_header, " +
//                 "h6.main_portal_content_section_header",
//         )

//         const tocRoot = document.createElement("ul")
//         const listStack: HTMLUListElement[] = [tocRoot]
//         let previousLevel = 1

//         headers.forEach((header) => {
//             const text = header.textContent?.trim() ?? "Untitled"
//             const slug = text.toLowerCase().replace(/\s+/g, "-")
//             const uniqueId = this.generateUniqueId(slug)
//             header.id = uniqueId

//             const level = parseInt(header.tagName[1], 10)
//             const li = document.createElement("li")
//             const a = document.createElement("a")
//             a.href = `#${uniqueId}`
//             a.textContent = text
//             li.appendChild(a)

//             // Adjust list depth
//             if (level > previousLevel) {
//                 const newList = document.createElement("ul")
//                 listStack[listStack.length - 1].lastElementChild?.appendChild(
//                     newList,
//                 )
//                 listStack.push(newList)
//             } else if (level < previousLevel) {
//                 for (let i = previousLevel; i > level; i--) {
//                     listStack.pop()
//                 }
//             }

//             listStack[listStack.length - 1].appendChild(li)
//             previousLevel = level
//             this.linkSectionMap.set(a, header)
//         })

//         tocContainer.appendChild(tocRoot)

//         this.scrollSpyManager = new ScrollSpyManager(
//             Array.from(this.linkSectionMap.values()),
//             `#${this.tocContainerId} a`,
//             this.contentElementId,
//         )
//     }

//     getLinkSectionMap(): Map<HTMLElement, HTMLElement> {
//         return this.linkSectionMap
//     }
// }

// // import { ScrollSpyManager } from "../mouse/ScrollSpyManager"

// // export class TableOfContentsBuilder {
// //     private contentElementId: string
// //     private tocContainerId: string
// //     private idSet: Set<string>
// //     private linkSectionMap = new Map<HTMLElement, HTMLElement>()
// //     private scrollSpyManager: ScrollSpyManager

// //     constructor(contentElementId: string, tocContainerId: string) {
// //         this.contentElementId = contentElementId
// //         this.tocContainerId = tocContainerId
// //         this.idSet = new Set()
// //     }

// //     private generateUniqueId(baseId: string): string {
// //         let uniqueId = baseId
// //         let counter = 1

// //         while (this.idSet.has(uniqueId)) {
// //             uniqueId = `${baseId}-${counter}`
// //             counter++
// //         }

// //         this.idSet.add(uniqueId)
// //         return uniqueId
// //     }

// //     // private updateActiveLink = () => {
// //     //     console.log('Updating active');
// //     //     let currentSection: HTMLElement | null = null;
// //     //     let minDistance = Number.MAX_VALUE;

// //     //     this.linkSectionMap.forEach((section, link) => {
// //     //         const rect = section.getBoundingClientRect();
// //     //         const distance = Math.abs(rect.top);

// //     //         if (distance < minDistance) {
// //     //             minDistance = distance;
// //     //             currentSection = section;
// //     //         }
// //     //     });

// //     //     this.linkSectionMap.forEach((section, link) => {
// //     //         link.classList.toggle('active', section === currentSection);
// //     //     });
// //     // };

// //     // private updateActiveTOCItem(): void {
// //     //     // Attach the event listener to the scroll event
// //     //     window.addEventListener('scroll', this.updateActiveLink);

// //     //     // Initialize the active link state
// //     //     this.updateActiveLink();
// //     // }

// //     buildAndAppendTOC(): void {
// //         const contentElement = document.getElementById(this.contentElementId)
// //         if (!contentElement) {
// //             // console.warn(`Content element with ID "${this.contentElementId}" not found.`);
// //             return
// //         }

// //         const tocContainer = document.getElementById(this.tocContainerId)
// //         if (!tocContainer) {
// //             // console.warn(`TOC container element with ID "${this.tocContainerId}" not found.`);
// //             return
// //         }

// //         // Select only headers with the specific class
// //         const headers = contentElement.querySelectorAll(
// //             "h1.main_portal_content_section_header, h2.main_portal_content_section_header, h3.main_portal_content_section_header, h4.main_portal_content_section_header, h5.main_portal_content_section_header, h6.main_portal_content_section_header",
// //         )
// //         const toc = document.createElement("ul")
// //         let currentLevel = 0
// //         let currentList = toc

// //         headers.forEach((header) => {
// //             // Create a unique ID for the header
// //             const textContent =
// //                 header.textContent
// //                     ?.trim()
// //                     .toLowerCase()
// //                     .replace(/\s+/g, "-") || "header"
// //             const uniqueId = this.generateUniqueId(textContent)
// //             header.id = uniqueId

// //             const level = parseInt(header.tagName.substring(1), 10)
// //             let listItem = document.createElement("li")

// //             let anchor = document.createElement("a")
// //             anchor.href = `#${uniqueId}`
// //             anchor.textContent = header.textContent
// //             listItem.appendChild(anchor)

// //             // Hierarchical structuring of the TOC based on header levels
// //             if (level > currentLevel) {
// //                 let newList = document.createElement("ul")
// //                 listItem.appendChild(newList)
// //                 currentList.appendChild(listItem)
// //                 currentList = newList
// //             } else if (level < currentLevel) {
// //                 for (let i = level; i < currentLevel; i++) {
// //                     if (
// //                         currentList.parentElement instanceof HTMLUListElement
// //                     ) {
// //                         currentList = currentList.parentElement
// //                     }
// //                 }
// //                 currentList.appendChild(listItem)
// //             } else {
// //                 currentList.appendChild(listItem)
// //             }

// //             currentLevel = level

// //             if (
// //                 header instanceof HTMLElement &&
// //                 anchor instanceof HTMLElement
// //             ) {
// //                 this.linkSectionMap.set(anchor, header)
// //             }
// //         })

// //         tocContainer.appendChild(toc)
// //         // this.updateActiveTOCItem(); // Call the method to handle active state updates

// //         const header_elements = Array.from(this.linkSectionMap.values())
// //         this.scrollSpyManager = new ScrollSpyManager(
// //             header_elements,
// //             "#toc-container a",
// //             this.contentElementId,
// //         )
// //     }

// //     getLinkSectionMap(): Map<HTMLElement, HTMLElement> {
// //         return this.linkSectionMap
// //     }
// // }

// // Usage:
// // document.addEventListener('DOMContentLoaded', () => {
// //     let tocBuilder = new TableOfContentsBuilder('content', 'toc-container'); // Replace with actual IDs
// //     tocBuilder.buildAndAppendTOC();
// // });
