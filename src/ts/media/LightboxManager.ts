// Creates and manages a lightbox for viewing images or content in an overlay.

// export default class LightboxManager {
//     private lightbox: HTMLElement

//     constructor(lightboxId: string) {
//         this.lightbox = document.getElementById(lightboxId) as HTMLElement
//         const closeButton = this.lightbox.querySelector('.close') as HTMLElement
//         closeButton.addEventListener('click', () => this.hideLightbox())
//     }

//     showLightbox(content: string): void {
//         const contentContainer = this.lightbox.querySelector('.content') as HTMLElement
//         contentContainer.innerHTML = content
//         this.lightbox.classList.add('active')
//     }

//     hideLightbox(): void {
//         this.lightbox.classList.remove('active')
//     }
// }

// Usage
// const lightboxManager = new LightboxManager('myLightbox')
// lightboxManager.showLightbox('<img src="image.jpg" />');
