export class AsideHandler {
    private leftAside: HTMLElement | null
    private rightAside: HTMLElement | null
    private leftSwitch: HTMLElement | null
    private rightSwitch: HTMLElement | null
    private leftRibbon: HTMLElement | null
    private rightRibbon: HTMLElement | null

    constructor() {
        this.leftAside = document.getElementById("leftAside")
        this.rightAside = document.getElementById("rightAside")
        this.leftSwitch = document.getElementById("leftSwitch")
        this.rightSwitch = document.getElementById("rightSwitch")
        this.leftRibbon = document.getElementById("leftRibbon")
        this.rightRibbon = document.getElementById("rightRibbon")

        this.activateIfNoRibbon()
        this.setupSwitchListeners()
    }

    private activateIfNoRibbon(): void {
        if (this.leftAside && this.leftSwitch && !this.leftRibbon) {
            this.leftAside.classList.add("active")
            this.leftSwitch.classList.add("active")
        }

        if (this.rightAside && this.rightSwitch && !this.rightRibbon) {
            this.rightAside.classList.add("active")
            this.rightSwitch.classList.add("active")
        }
    }

    private setupSwitchListeners(): void {
        if (this.leftAside && this.leftSwitch) {
            this.leftSwitch.addEventListener("click", () => {
                this.leftAside!.classList.toggle("active")
                this.leftSwitch!.classList.toggle("active")
            })
        }

        if (this.rightAside && this.rightSwitch) {
            this.rightSwitch.addEventListener("click", () => {
                this.rightAside!.classList.toggle("active")
                this.rightSwitch!.classList.toggle("active")
            })
        }
    }
}
