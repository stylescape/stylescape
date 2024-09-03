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


// Manages a responsive navigation menu, toggling between expanded and collapsed states based on screen size.

export default class ResponsiveMenuManager {
    private menu: HTMLElement;
    private toggleButton: HTMLElement;

    constructor(menuId: string, toggleButtonId: string) {
        this.menu = document.getElementById(menuId) as HTMLElement;
        this.toggleButton = document.getElementById(toggleButtonId) as HTMLElement;

        this.toggleButton.addEventListener('click', this.toggleMenu.bind(this));
        window.addEventListener('resize', this.checkWindowSize.bind(this));
    }

    private toggleMenu(): void {
        this.menu.classList.toggle('expanded');
    }

    private checkWindowSize(): void {
        if (window.innerWidth > 768) {
            this.menu.classList.remove('expanded');
        }
    }
}

// Usage
const responsiveMenuManager = new ResponsiveMenuManager('navMenu', 'menuToggleButton');
