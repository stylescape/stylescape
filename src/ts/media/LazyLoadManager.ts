// //Manages the lazy loading of images or other resources.

// export default class LazyLoadManager {
//     private items: NodeListOf<HTMLElement>

//     constructor(itemsSelector: string) {
//         this.items = document.querySelectorAll(itemsSelector)
//         this.observeItems()
//     }

//     private observeItems(): void {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach((entry) => {
//                 if (entry.isIntersecting) {
//                     // Replace placeholder with actual content (e.g., image src)
//                     const item = entry.target as HTMLImageElement
//                     item.src = item.dataset.src!
//                     observer.unobserve(item)
//                 }
//             })
//         })

//         this.items.forEach((item) => observer.observe(item))
//     }
// }

// // Usage
// const lazyLoadManager = new LazyLoadManager('.lazy-load-item')
