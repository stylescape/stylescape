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
