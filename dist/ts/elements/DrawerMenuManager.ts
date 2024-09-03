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



//Manages a drawer-style navigation menu, handling its opening and closing.

export default class DrawerMenuManager {
    private drawerMenu: HTMLElement;

    constructor(drawerMenuId: string) {
        this.drawerMenu = document.getElementById(drawerMenuId) as HTMLElement;
    }

    open(): void {
        this.drawerMenu.classList.add('open');
    }

    close(): void {
        this.drawerMenu.classList.remove('open');
    }
}

// Usage
const drawerMenuManager = new DrawerMenuManager('myDrawerMenu');
// Open the menu: drawerMenuManager.open();
