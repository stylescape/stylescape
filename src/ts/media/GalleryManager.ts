// Manages an image gallery, handling image selection, navigation, and possibly lightbox integration.

// export default class GalleryManager {
//     private images: NodeListOf<HTMLImageElement>
//     private currentIndex: number = 0

//     constructor(gallerySelector: string) {
//         this.images = document.querySelectorAll(`${gallerySelector} img`)
//         this.images.forEach((image, index) => {
//             image.addEventListener('click', () => this.selectImage(index))
//         })
//     }

//     private selectImage(index: number): void {
//         this.currentIndex = index
//         // Additional logic to display selected image, possibly in a lightbox
//     }

//     nextImage(): void {
//         this.selectImage((this.currentIndex + 1) % this.images.length)
//     }

//     prevImage(): void {
//         this.selectImage((this.currentIndex - 1 + this.images.length) % this.images.length)
//     }
// }

// Usage
// const galleryManager = new GalleryManager('#imageGallery')
