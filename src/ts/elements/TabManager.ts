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



// This class manages tabbed content in a web application. It handles tab switching and content display based on user interaction.
export default class TabManager {
    private tabs: NodeListOf<Element>;
    private contents: NodeListOf<Element>;

    constructor(tabsSelector: string, contentsSelector: string) {
        this.tabs = document.querySelectorAll(tabsSelector);
        this.contents = document.querySelectorAll(contentsSelector);
        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    }

    private switchTab(selectedTab: Element): void {
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab === selectedTab);
        });

        const targetId = selectedTab.getAttribute('data-target');
        this.contents.forEach(content => {
            content.classList.toggle('active', content.id === targetId);
        });
    }
}

// Usage
const tabManager = new TabManager('.tab', '.tab-content');



// class TabControlManager {
//     private tabs: NodeListOf<HTMLElement>;
//     private tabPanels: NodeListOf<HTMLElement>;

//     constructor(tabSelector: string, tabPanelSelector: string) {
//         this.tabs = document.querySelectorAll(tabSelector);
//         this.tabPanels = document.querySelectorAll(tabPanelSelector);

//         this.tabs.forEach(tab => {
//             tab.addEventListener('click', () => this.selectTab(tab));
//         });
//     }

//     private selectTab(selectedTab: HTMLElement): void {
//         this.tabs.forEach(tab => tab.classList.remove('active'));
//         selectedTab.classList.add('active');

//         this.tabPanels.forEach(panel => {
//             panel.classList.toggle('active', panel.id === selectedTab.getAttribute('data-target'));
//         });
//     }
// }

// // Usage
// const tabControlManager = new TabControlManager('.tab', '.tab-panel');
