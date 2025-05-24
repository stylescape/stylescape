// // Manages filtering of items or data in the UI, for example, in a list or table.

// export default class FilterManager {

//     private filterInput: HTMLInputElement;
//     private items: NodeListOf<HTMLElement>;

//     constructor(filterInputId: string, itemsSelector: string) {
//         this.filterInput = document.getElementById(filterInputId) as HTMLInputElement;
//         this.items = document.querySelectorAll(itemsSelector);
//         this.filterInput.addEventListener('input', this.applyFilter.bind(this));
//     }

//     private applyFilter(): void {
//         const filterValue = this.filterInput.value.toLowerCase();
//         this.items.forEach(item => {
//             const text = item.textContent?.toLowerCase() || '';
//             item.style.display = text.includes(filterValue) ? '' : 'none';
//         });
//     }
// }

// // Usage
// const filterManager = new FilterManager('searchInput', '.list-item');
