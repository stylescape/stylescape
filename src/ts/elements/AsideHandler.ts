export class AsideHandler {
    private middleCenter: HTMLElement | null
    private leftSwitch: HTMLElement | null
    private rightSwitch: HTMLElement | null

    constructor() {
        this.middleCenter = document.getElementById('middleCenter')
        this.leftSwitch = document.getElementById('leftSwitch')
        this.rightSwitch = document.getElementById('rightSwitch')

        this.init()
    }

    private init(): void {
        if (this.middleCenter && this.leftSwitch) {
            this.leftSwitch.addEventListener('click', () => {
                this.middleCenter!.classList.toggle('collapse-left')
                this.leftSwitch!.classList.toggle('active')
            })
        }

        if (this.middleCenter && this.rightSwitch) {
            this.rightSwitch.addEventListener('click', () => {
                this.middleCenter!.classList.toggle('collapse-right')
                this.rightSwitch!.classList.toggle('active')
            })
        }
    }
}
