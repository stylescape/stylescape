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



//Manages the lazy loading of images or other resources.



export default class LazyLoadManager {
    private items: NodeListOf<HTMLElement>;

    constructor(itemsSelector: string) {
        this.items = document.querySelectorAll(itemsSelector);
        this.observeItems();
    }

    private observeItems(): void {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Replace placeholder with actual content (e.g., image src)
                    const item = entry.target as HTMLImageElement;
                    item.src = item.dataset.src!;
                    observer.unobserve(item);
                }
            });
        });

        this.items.forEach(item => observer.observe(item));
    }
}

// Usage
const lazyLoadManager = new LazyLoadManager('.lazy-load-item');
