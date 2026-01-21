export class DropdownHandler {
    private dropdowns: NodeListOf<HTMLElement>;

    constructor(containerSelector: string = ".select_dropdown") {
        this.dropdowns =
            document.querySelectorAll<HTMLElement>(containerSelector);
        if (this.dropdowns.length === 0) return;

        this.initializeDropdowns();
        this.setupGlobalClickListener();
    }

    private initializeDropdowns() {
        this.dropdowns.forEach((dropdown) => {
            const header = dropdown.querySelector<HTMLElement>(
                ".select_dropdown--header",
            );
            const menu = dropdown.querySelector<HTMLElement>(
                ".select_dropdown--menu.dropdown--collapse",
            );
            const checkboxes = dropdown.querySelectorAll<HTMLInputElement>(
                'input[type="checkbox"]',
            );

            if (!header) return;

            header.addEventListener("click", () => {
                if (menu) {
                    menu.classList.toggle("active");
                }

                const flipper = header.querySelector<HTMLElement>(
                    ".flipper--down, .flipper--up",
                );
                if (flipper) {
                    flipper.classList.toggle("flipper--down");
                    flipper.classList.toggle("flipper--up");
                    // flipper.classList.toggle("active")
                }
            });

            checkboxes.forEach((checkbox) => {
                checkbox.addEventListener("change", () => {
                    this.updateSelectionLabel(dropdown);
                });
            });

            this.updateSelectionLabel(dropdown);
        });
    }

    private updateSelectionLabel(dropdown: HTMLElement) {
        const countSpan =
            dropdown.querySelector<HTMLElement>("#selected-count");
        const checkboxes = dropdown.querySelectorAll<HTMLInputElement>(
            'input[type="checkbox"]',
        );

        if (!countSpan || checkboxes.length === 0) return;

        const selected = Array.from(checkboxes).filter(
            (cb) => cb.checked,
        ).length;
        countSpan.textContent = `Selected: ${selected} option${selected !== 1 ? "s" : ""}`;
    }

    private setupGlobalClickListener() {
        document.addEventListener("click", (e) => {
            this.dropdowns.forEach((dropdown) => {
                const menu = dropdown.querySelector<HTMLElement>(
                    ".dropdown--collapse",
                );
                if (menu && !dropdown.contains(e.target as Node)) {
                    menu.classList.remove("active");
                }
            });
        });
    }
}
