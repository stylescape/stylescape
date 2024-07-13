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



// Manages an image gallery, handling image selection, navigation, and possibly lightbox integration.

export default class GalleryManager {
    private images: NodeListOf<HTMLImageElement>;
    private currentIndex: number = 0;

    constructor(gallerySelector: string) {
        this.images = document.querySelectorAll(`${gallerySelector} img`);
        this.images.forEach((image, index) => {
            image.addEventListener('click', () => this.selectImage(index));
        });
    }

    private selectImage(index: number): void {
        this.currentIndex = index;
        // Additional logic to display selected image, possibly in a lightbox
    }

    nextImage(): void {
        this.selectImage((this.currentIndex + 1) % this.images.length);
    }

    prevImage(): void {
        this.selectImage((this.currentIndex - 1 + this.images.length) % this.images.length);
    }
}

// Usage
const galleryManager = new GalleryManager('#imageGallery');
