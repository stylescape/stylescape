// This class manages the opening and closing of modal windows.

// class ModalManager {
//     private modal: HTMLElement | null;
//     private closeButton: HTMLElement | null;

//     constructor(modalId: string) {
//         this.modal = document.getElementById(modalId);
//         this.closeButton = this.modal?.querySelector('.modal-close');

//         this.closeButton?.addEventListener('click', () => this.closeModal());
//     }

//     openModal(): void {
//         this.modal?.classList.add('open');
//     }

//     closeModal(): void {
//         this.modal?.classList.remove('open');
//     }
// }

// // Usage
// const modalManager = new ModalManager('myModal');
// // To open modal: modalManager.openModal();
