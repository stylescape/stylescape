// This class manages tabbed content in a web application. It handles tab switching and content display based on user interaction.
// export default class TabManager {
//     private tabs: NodeListOf<Element>
//     private contents: NodeListOf<Element>

//     constructor(tabsSelector: string, contentsSelector: string) {
//         this.tabs = document.querySelectorAll(tabsSelector)
//         this.contents = document.querySelectorAll(contentsSelector)
//         this.attachEventListeners()
//     }

//     private attachEventListeners(): void {
//         this.tabs.forEach((tab) => {
//             tab.addEventListener('click', () => this.switchTab(tab))
//         })
//     }

//     private switchTab(selectedTab: Element): void {
//         this.tabs.forEach((tab) => {
//             tab.classList.toggle('active', tab === selectedTab)
//         })

//         const targetId = selectedTab.getAttribute('data-target')
//         this.contents.forEach((content) => {
//             content.classList.toggle('active', content.id === targetId)
//         })
//     }
// }

// Usage
// const tabManager = new TabManager('.tab', '.tab-content')

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
