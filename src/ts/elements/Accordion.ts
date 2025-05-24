// // Accordion Menu Class
// // Accordions are useful for collapsing or expanding content and can be seen frequently in FAQs, nested menus, or form structures.

// class Accordion {
//     constructor(public selector: string) {
//         const items = document.querySelectorAll(`${selector} .accordion-item`)
//         items.forEach((item) => {
//             const button = item.querySelector('.accordion-button')
//             button?.addEventListener('click', () => {
//                 const isOpen = item.classList.contains('open')
//                 item.classList.toggle('open', !isOpen)
//                 ;(item.querySelector('.accordion-content') as HTMLElement).style.display = isOpen
//                     ? 'none'
//                     : 'block'
//             })
//         })
//     }
// }
