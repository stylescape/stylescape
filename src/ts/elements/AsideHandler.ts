import { StateManager } from "../state/StateManager.js"
import { LocalStorageManager } from "./LocalStorageManager.js"

export class AsideHandler {
    private static readonly VISIBLE_CLASS = "active"
    private static readonly VISIBLE_SUFFIX = "_visibility"
    private static readonly VISIBLE_STATE = "show"
    private static readonly HIDDEN_STATE = "hide"

    localStorageManager: LocalStorageManager
    stateManager: StateManager

    menuId: string
    switchId: string

    asideMenu: HTMLElement | null = null
    asideSwitch: HTMLElement | null = null
    asideMenuActive: string = AsideHandler.HIDDEN_STATE

    constructor(menuId: string, switchId: string) {
        this.localStorageManager = LocalStorageManager.getInstance()
        this.stateManager = new StateManager()
        this.menuId = menuId
        this.switchId = switchId

        this.assertMenu()
        this.setupToggleListener()
        this.updateStateMenu()
    }

    private assertMenu(): void {
        this.asideMenu = document.getElementById(this.menuId)
        this.asideSwitch = document.getElementById(this.switchId)
    }

    private setupToggleListener(): void {
        if (this.asideSwitch) {
            this.asideSwitch.addEventListener("click", () => this.toggleMenu())
        }
    }

    toggleMenu(): void {
        this.assertMenu()
        if (this.asideMenu?.classList.contains(AsideHandler.VISIBLE_CLASS)) {
            this.hideMenu()
        } else {
            this.showMenu()
        }
    }

    showMenu(): void {
        this.assertMenu()
        this.localStorageManager.setValue(
            this.menuId + AsideHandler.VISIBLE_SUFFIX,
            AsideHandler.VISIBLE_STATE,
        )
        this.updateStateMenu()
    }

    hideMenu(): void {
        this.assertMenu()
        this.localStorageManager.setValue(
            this.menuId + AsideHandler.VISIBLE_SUFFIX,
            AsideHandler.HIDDEN_STATE,
        )
        this.updateStateMenu()
    }

    updateStateMenu(): void {
        this.assertMenu()
        if (!this.asideMenu) return

        this.asideMenuActive =
            this.localStorageManager.getValue(
                this.menuId + AsideHandler.VISIBLE_SUFFIX,
            ) || this.asideMenuActive

        const isVisible = this.asideMenuActive === AsideHandler.VISIBLE_STATE
        this.asideMenu.classList.toggle(AsideHandler.VISIBLE_CLASS, isVisible)
        this.asideSwitch?.classList.toggle(
            AsideHandler.VISIBLE_CLASS,
            isVisible,
        )
    }
}

// Usage
// const asideHandler = new AsideHandler()
// asideHandler.toggleLeftMenu() // Call to toggle the left menu

// export class AsideHandler {
//     private leftAside: HTMLElement | null
//     private rightAside: HTMLElement | null
//     private leftSwitch: HTMLElement | null
//     private rightSwitch: HTMLElement | null
//     private leftRibbon: HTMLElement | null
//     private rightRibbon: HTMLElement | null

//     constructor() {
//         this.leftAside = document.getElementById("leftAside")
//         this.rightAside = document.getElementById("rightAside")
//         this.leftSwitch = document.getElementById("leftSwitch")
//         this.rightSwitch = document.getElementById("rightSwitch")
//         this.leftRibbon = document.getElementById("leftRibbon")
//         this.rightRibbon = document.getElementById("rightRibbon")

//         this.activateIfNoRibbon()
//         this.setupSwitchListeners()
//     }

//     private activateIfNoRibbon(): void {
//         if (this.leftAside && this.leftSwitch && !this.leftRibbon) {
//             this.leftAside.classList.add("active")
//             this.leftSwitch.classList.add("active")
//         }

//         if (this.rightAside && this.rightSwitch && !this.rightRibbon) {
//             this.rightAside.classList.add("active")
//             this.rightSwitch.classList.add("active")
//         }
//     }

//     private setupSwitchListeners(): void {
//         if (this.leftAside && this.leftSwitch) {
//             this.leftSwitch.addEventListener("click", () => {
//                 this.leftAside!.classList.toggle("active")
//                 this.leftSwitch!.classList.toggle("active")
//             })
//         }

//         if (this.rightAside && this.rightSwitch) {
//             this.rightSwitch.addEventListener("click", () => {
//                 this.rightAside!.classList.toggle("active")
//                 this.rightSwitch!.classList.toggle("active")
//             })
//         }
//     }
// }
