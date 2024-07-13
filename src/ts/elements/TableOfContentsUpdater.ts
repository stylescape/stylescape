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


import { TableOfContentsBuilder } from './TableOfContentsBuilder';



export function updateActiveTOCItem(linkSectionMap: Map<HTMLElement, HTMLElement>) {
    const updateActiveLink = () => {

        console.log('Updating active');
        let currentSection: HTMLElement | null = null;
        let minDistance = Number.MAX_VALUE;

        linkSectionMap.forEach((section, link) => {
            // Calculate position relative to the viewport
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top + window.pageYOffset - document.documentElement.clientTop);

            if (distance < minDistance) {
                minDistance = distance;
                currentSection = section;
            }
        });

        linkSectionMap.forEach((section, link) => {
            link.classList.toggle('active', section === currentSection);
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initialize active state
}



// function updateActiveTOCItem(tocBuilder: TableOfContentsBuilder) {
//     const linkSectionMap = tocBuilder.getLinkSectionMap();

//     const findCurrentSection = () => {
//         let currentSection: HTMLElement | null = null;
//         let currentSectionDistance = Number.MAX_VALUE;

//         linkSectionMap.forEach((section) => {
//             const sectionTop = section.getBoundingClientRect().top;

//             if (sectionTop >= -window.innerHeight / 2 && sectionTop < currentSectionDistance) {
//                 currentSectionDistance = sectionTop;
//                 currentSection = section;
//             }
//         });

//         return currentSection;
//     };

//     const updateActiveLink = () => {
//         const currentSection = findCurrentSection();

//         linkSectionMap.forEach((section, link) => {
//             if (section === currentSection) {
//                 link.classList.add('active');
//             } else {
//                 link.classList.remove('active');
//             }
//         });
//     };

//     window.addEventListener('scroll', updateActiveLink);
//     updateActiveLink(); // Initialize active state
// }
