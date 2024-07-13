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


import { ScrollSpyManager } from '../mouse/ScrollSpyManager';


export class TableOfContentsBuilder {
    private contentElementId: string;
    private tocContainerId: string;
    private idSet: Set<string>;
    private linkSectionMap = new Map<HTMLElement, HTMLElement>();
    private scrollSpyManager: ScrollSpyManager;

    constructor(contentElementId: string, tocContainerId: string) {
        this.contentElementId = contentElementId;
        this.tocContainerId = tocContainerId;
        this.idSet = new Set();
    }

    private generateUniqueId(baseId: string): string {
        let uniqueId = baseId;
        let counter = 1;

        while (this.idSet.has(uniqueId)) {
            uniqueId = `${baseId}-${counter}`;
            counter++;
        }

        this.idSet.add(uniqueId);
        return uniqueId;
    }

    // private updateActiveLink = () => {
    //     console.log('Updating active');
    //     let currentSection: HTMLElement | null = null;
    //     let minDistance = Number.MAX_VALUE;
    
    //     this.linkSectionMap.forEach((section, link) => {
    //         const rect = section.getBoundingClientRect();
    //         const distance = Math.abs(rect.top);
    
    //         if (distance < minDistance) {
    //             minDistance = distance;
    //             currentSection = section;
    //         }
    //     });
    
    //     this.linkSectionMap.forEach((section, link) => {
    //         link.classList.toggle('active', section === currentSection);
    //     });
    // };


    // private updateActiveTOCItem(): void {
    //     // Attach the event listener to the scroll event
    //     window.addEventListener('scroll', this.updateActiveLink);
    
    //     // Initialize the active link state
    //     this.updateActiveLink();
    // }

    buildAndAppendTOC(): void {
        const contentElement = document.getElementById(this.contentElementId);
        if (!contentElement) {
            // console.warn(`Content element with ID "${this.contentElementId}" not found.`);
            return;
        }

        const tocContainer = document.getElementById(this.tocContainerId);
        if (!tocContainer) {
            // console.warn(`TOC container element with ID "${this.tocContainerId}" not found.`);
            return;
        }

        // Select only headers with the specific class
        const headers = contentElement.querySelectorAll('h1.main_portal_content_section_header, h2.main_portal_content_section_header, h3.main_portal_content_section_header, h4.main_portal_content_section_header, h5.main_portal_content_section_header, h6.main_portal_content_section_header');
        const toc = document.createElement('ul');
        let currentLevel = 0;
        let currentList = toc;

        headers.forEach(header => {
            // Create a unique ID for the header
            const textContent = header.textContent?.trim().toLowerCase().replace(/\s+/g, '-') || 'header';
            const uniqueId = this.generateUniqueId(textContent);
            header.id = uniqueId;

            const level = parseInt(header.tagName.substring(1), 10);
            let listItem = document.createElement('li');

            let anchor = document.createElement('a');
            anchor.href = `#${uniqueId}`;
            anchor.textContent = header.textContent;
            listItem.appendChild(anchor);

            // Hierarchical structuring of the TOC based on header levels
            if (level > currentLevel) {
                let newList = document.createElement('ul');
                listItem.appendChild(newList);
                currentList.appendChild(listItem);
                currentList = newList;
            } else if (level < currentLevel) {
                for (let i = level; i < currentLevel; i++) {
                    if (currentList.parentElement instanceof HTMLUListElement) {
                        currentList = currentList.parentElement;
                    }
                }
                currentList.appendChild(listItem);
            } else {
                currentList.appendChild(listItem);
            }

            currentLevel = level;

            if (header instanceof HTMLElement && anchor instanceof HTMLElement) {
                this.linkSectionMap.set(anchor, header);
            }
        });

        tocContainer.appendChild(toc);
        // this.updateActiveTOCItem(); // Call the method to handle active state updates

        const header_elements = Array.from(this.linkSectionMap.values());
        this.scrollSpyManager = new ScrollSpyManager(header_elements, '#toc-container a', this.contentElementId);

    }


    getLinkSectionMap(): Map<HTMLElement, HTMLElement> {
        return this.linkSectionMap;
    }
}

// Usage:
// document.addEventListener('DOMContentLoaded', () => {
//     let tocBuilder = new TableOfContentsBuilder('content', 'toc-container'); // Replace with actual IDs
//     tocBuilder.buildAndAppendTOC();
// });

