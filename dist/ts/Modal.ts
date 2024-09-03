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

// Modal Popup Class
// A modal popup class can handle opening and closing of modal dialogs which are often used for user notifications, forms, or other focal interactions within a page.


class Modal {
    private modalElement: HTMLElement;
    private closeButton: HTMLElement;

    constructor(modalId: string, closeBtnId: string) {
        this.modalElement = document.getElementById(modalId) as HTMLElement;
        this.closeButton = document.getElementById(closeBtnId) as HTMLElement;
        this.closeButton.addEventListener('click', this.close);
        document.addEventListener('click', this.outsideClick);
    }

    open = () => {
        this.modalElement.style.display = 'block';
    };

    close = () => {
        this.modalElement.style.display = 'none';
    };

    private outsideClick = (event: MouseEvent) => {
        if (event.target == this.modalElement) {
            this.close();
        }
    };
}

// Example usage:
const modal = new Modal('myModal', 'myCloseBtn');
