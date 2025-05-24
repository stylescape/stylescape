// // Manages a responsive navigation menu, toggling between expanded and collapsed states based on screen size.

// export default class ResponsiveMenuManager {
//     private menu: HTMLElement
//     private toggleButton: HTMLElement

//     constructor(menuId: string, toggleButtonId: string) {
//         this.menu = document.getElementById(menuId) as HTMLElement
//         this.toggleButton = document.getElementById(toggleButtonId) as HTMLElement

//         this.toggleButton.addEventListener('click', this.toggleMenu.bind(this))
//         window.addEventListener('resize', this.checkWindowSize.bind(this))
//     }

//     private toggleMenu(): void {
//         this.menu.classList.toggle('expanded')
//     }

//     private checkWindowSize(): void {
//         if (window.innerWidth > 768) {
//             this.menu.classList.remove('expanded')
//         }
//     }
// }

// // Usage
// const responsiveMenuManager = new ResponsiveMenuManager('navMenu', 'menuToggleButton')
