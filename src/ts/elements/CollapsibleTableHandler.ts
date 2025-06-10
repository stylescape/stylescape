export class CollapsibleTableHandler {
    constructor(containerSelector: string = ".collapsible_table") {
        const tables =
            document.querySelectorAll<HTMLElement>(containerSelector)

        tables.forEach((table) => {
            const header = table.querySelector<HTMLElement>(
                ".collapsible_table--header",
            )
            const content = table.querySelector<HTMLElement>(
                ".collapsible_table--content",
            )
            const flipper = table.querySelector<HTMLElement>(
                ".flipper--down, .flipper--up",
            )

            if (!header || !content) return

            header.addEventListener("click", () => {
                content.classList.toggle("expanded")

                if (flipper) {
                    // flipper.classList.toggle("active")
                    flipper.classList.toggle("flipper--up")
                    flipper.classList.toggle("flipper--down")
                }
            })
        })
    }
}
