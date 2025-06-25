// Modal Popup Class
// A modal popup class can handle opening and closing of modal dialogs which are often used for user notifications, forms, or other focal interactions within a page.

// class Modal {
//     private modalElement: HTMLElement
//     private closeButton: HTMLElement

//     constructor(modalId: string, closeBtnId: string) {
//         this.modalElement = document.getElementById(modalId) as HTMLElement
//         this.closeButton = document.getElementById(closeBtnId) as HTMLElement
//         this.closeButton.addEventListener('click', this.close)
//         document.addEventListener('click', this.outsideClick)
//     }

//     open = () => {
//         this.modalElement.style.display = 'block'
//     }

//     close = () => {
//         this.modalElement.style.display = 'none'
//     }

//     private outsideClick = (event: MouseEvent) => {
//         if (event.target == this.modalElement) {
//             this.close()
//         }
//     }
// }

// Example usage:
// const modal = new Modal('myModal', 'myCloseBtn')
