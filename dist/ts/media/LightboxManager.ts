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


// Creates and manages a lightbox for viewing images or content in an overlay.

export default class LightboxManager {
    private lightbox: HTMLElement;

    constructor(lightboxId: string) {
        this.lightbox = document.getElementById(lightboxId) as HTMLElement;
        const closeButton = this.lightbox.querySelector('.close') as HTMLElement;
        closeButton.addEventListener('click', () => this.hideLightbox());
    }

    showLightbox(content: string): void {
        const contentContainer = this.lightbox.querySelector('.content') as HTMLElement;
        contentContainer.innerHTML = content;
        this.lightbox.classList.add('active');
    }

    hideLightbox(): void {
        this.lightbox.classList.remove('active');
    }
}

// Usage
const lightboxManager = new LightboxManager('myLightbox');
// lightboxManager.showLightbox('<img src="image.jpg" />');
