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


export class ButtonHandler {
    constructor() {
        // Attaching event listeners to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
    }

    private handleButtonClick(event: Event): void {
        // Retrieving the ID of the clicked button
        const button = event.target as HTMLButtonElement;
        const buttonId = button.id;

        console.log(`Button clicked: ${buttonId}`);
        // Add your function logic here, using buttonId if needed
    }
}

// Initialize the ButtonHandler class
const buttonHandler = new ButtonHandler();
