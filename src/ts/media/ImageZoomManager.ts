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


// Handles zoom-in and zoom-out functionalities for images.



export default class ImageZoomManager {
    private image: HTMLImageElement;
    private zoomFactor: number = 1.2;

    constructor(imageId: string) {
        this.image = document.getElementById(imageId) as HTMLImageElement;
    }

    zoomIn(): void {
        this.image.style.transform = `scale(${this.zoomFactor})`;
        this.zoomFactor *= 1.2;
    }

    zoomOut(): void {
        this.zoomFactor /= 1.2;
        this.image.style.transform = `scale(${this.zoomFactor})`;
    }
}

// Usage
const imageZoomManager = new ImageZoomManager('myImage');
// imageZoomManager.zoomIn() or imageZoomManager.zoomOut()
