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


// ============================================================================
// Preloader
// ============================================================================

export class Preloader {
    // class Preloader {

    private preloaderName: string
    private preloaderElement: HTMLElement | null
    private preloaderTimeout: number

    constructor(preloaderName: string, preloaderTimeout: number) {
        this.preloaderName = preloaderName
        this.preloaderElement = document.querySelector(preloaderName)
        this.preloaderTimeout = preloaderTimeout
        if (!this.preloaderElement) {
            // pass
            // console.warn(`Preloader element not found: ${preloaderName}`)
        } else {
            this.setPreloader()
        }
    }

    setPreloader(): void {
        window.addEventListener('load', this.handleLoadEvent.bind(this))
    }

    private handleLoadEvent(): void {
        if (this.preloaderElement) {
            setTimeout(() => this.hidePreloader(), this.preloaderTimeout)
        }
    }

    private hidePreloader(): void {
        if (this.preloaderElement) {
            this.preloaderElement.classList.add('preloader_hidden')
        }
    }

    // Optional: Method to update the preloader element dynamically
    updatePreloaderElement(selector: string): void {
        this.preloaderName = selector
        this.preloaderElement = document.querySelector(selector)

        if (!this.preloaderElement) {
            console.warn(`Updated preloader element not found: ${selector}`)
        }
    }
}

// export default class Preloader {

//     preloader_name: string;
//     preloader_element: HTMLElement;
//     preloader_timeout: number;

//     constructor(
//         preloader_name: string,
//         // preloader_element: HTMLElement,
//         preloader_timeout: number
//     ) {
//         this.preloader_name = preloader_name;
//         this.preloader_element = document.querySelector(this.preloader_name)!;
//         this.preloader_timeout = preloader_timeout;
//     }

//     // getLoader() {
//     //     this.preloader_element = document.querySelector(".preloader")!
//     // }

//     setPreloader() {
//         window.addEventListener("load", () => {
//             if (typeof(this.preloader_element) != 'undefined' && this.preloader_element != null) {
//                 setTimeout(this.hidePreloader, this.preloader_timeout);
//             }
//         });
//     }

//     hidePreloader() {
//         this.preloader_element.classList.add("preloader_hidden");
//     }
// }

// const preloader = document.querySelector(".preloader")!
// let preloader_time = 500

// window.addEventListener("load", () => {
//     if (typeof(preloader) != 'undefined' && preloader != null) {
//         setTimeout(hideLoader, preloader_time);
//     }
// });

// export function hideLoader(){
//     preloader.classList.add("preloader_hidden");
// }
