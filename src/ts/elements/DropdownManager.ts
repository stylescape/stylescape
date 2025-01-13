// Controls the behavior of dropdown menus, handling show and hide actions.

export default class DropdownManager {
    private dropdowns: NodeListOf<HTMLElement>

    constructor() {
        this.dropdowns = document.querySelectorAll('.dropdown')
        document.addEventListener('click', this.handleClickOutside.bind(this))
    }

    toggleDropdown(dropdownId: string): void {
        const dropdown = document.getElementById(dropdownId)
        dropdown?.classList.toggle('active')
    }

    private handleClickOutside(event: MouseEvent): void {
        this.dropdowns.forEach((dropdown) => {
            if (!dropdown.contains(event.target as Node)) {
                dropdown.classList.remove('active')
            }
        })
    }
}

// Usage
const dropdownManager = new DropdownManager()
// Call dropdownManager.toggleDropdown('dropdownId') to toggle
