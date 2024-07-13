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


// Accordion Menu Class
// Accordions are useful for collapsing or expanding content and can be seen frequently in FAQs, nested menus, or form structures.


class Accordion {
    constructor(public selector: string) {
        const items = document.querySelectorAll(`${selector} .accordion-item`);
        items.forEach(item => {
            const button = item.querySelector('.accordion-button');
            button?.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                item.classList.toggle('open', !isOpen);
                (item.querySelector('.accordion-content') as HTMLElement).style.display = isOpen ? 'none' : 'block';
            });
        });
    }
}
