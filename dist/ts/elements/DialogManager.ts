// Handles opening and closing of modal dialog windows, including confirmation and prompt dialogs.

export default class DialogManager {
    private dialog: HTMLElement

    constructor(dialogId: string) {
        this.dialog = document.getElementById(dialogId) as HTMLElement
        const closeButton = this.dialog.querySelector('.dialog-close') as HTMLElement
        closeButton.addEventListener('click', () => this.closeDialog())
    }

    openDialog(): void {
        this.dialog.classList.add('open')
    }

    closeDialog(): void {
        this.dialog.classList.remove('open')
    }
}

// Usage
const dialogManager = new DialogManager('myDialog')
// dialogManager.openDialog();
