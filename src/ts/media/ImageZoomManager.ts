// // Handles zoom-in and zoom-out functionalities for images.

// export default class ImageZoomManager {
//     private image: HTMLImageElement
//     private zoomFactor: number = 1.2

//     constructor(imageId: string) {
//         this.image = document.getElementById(imageId) as HTMLImageElement
//     }

//     zoomIn(): void {
//         this.image.style.transform = `scale(${this.zoomFactor})`
//         this.zoomFactor *= 1.2
//     }

//     zoomOut(): void {
//         this.zoomFactor /= 1.2
//         this.image.style.transform = `scale(${this.zoomFactor})`
//     }
// }

// // Usage
// const imageZoomManager = new ImageZoomManager('myImage')
// // imageZoomManager.zoomIn() or imageZoomManager.zoomOut()
