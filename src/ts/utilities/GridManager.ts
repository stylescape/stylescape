type GridLayer = HTMLElement & { dataset: { grid: string } }
type ToggleButton = HTMLButtonElement & { dataset: { toggle: string } }

export class GridManager {
    private readonly STORAGE_KEY = "unitgl:grid:visibility"
    private visibilityMap: Record<string, boolean> = {}

    constructor() {
        // console.log("Initializing GridManager...")

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.init())
        } else {
            this.init()
        }
    }

    private init(): void {
        this.loadVisibility()
        this.applyVisibilityState()
        this.setupToggleButtons()
        this.updateAllGridHeights()
        window.addEventListener("resize", () => this.updateAllGridHeights())
        window.addEventListener("scroll", () => this.updateAllGridHeights())

        // console.log("GridManager initialized")
    }

    private loadVisibility(): void {
        // console.log("Loading grid visibility state from localStorage")
        try {
            this.visibilityMap = JSON.parse(
                localStorage.getItem(this.STORAGE_KEY) || "{}",
            )
            // console.log("Loaded visibility map:", this.visibilityMap)
        } catch {
            this.visibilityMap = {}
        }
    }

    private saveVisibility(): void {
        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(this.visibilityMap),
        )
        // console.log("Saved grid visibility state:", this.visibilityMap)
    }

    private updateAllGridHeights(): void {
        const height = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            document.documentElement.offsetHeight,
            document.body.offsetHeight,
        )

        document
            .querySelectorAll<HTMLElement>(".guide--layer")
            .forEach((layer) => {
                if (layer.offsetHeight !== height) {
                    layer.style.height = `${height}px`
                }
            })
    }

    private applyVisibilityState(): void {
        document
            .querySelectorAll<GridLayer>(".guide--layer")
            .forEach((layer) => {
                const id = layer.dataset.grid
                const isActive = !!this.visibilityMap[id]
                layer.classList.toggle("active", isActive)
            })

        document
            .querySelectorAll<ToggleButton>("button[data-toggle]")
            .forEach((button) => {
                const id = button.dataset.toggle
                const isActive = !!this.visibilityMap[id]
                button.classList.toggle("active", isActive)
            })
    }

    private setupToggleButtons(): void {
        // console.log("Setting up toggle buttons for grid layers")
        document
            .querySelectorAll<ToggleButton>("button[data-toggle]")
            .forEach((button) => {
                const id = button.dataset.toggle
                const layer = document.querySelector<GridLayer>(
                    `[data-grid="${id}"]`,
                )
                if (!layer) return

                // console.log(`Setting up toggle for layer: ${id}`)

                button.addEventListener("click", () => {
                    const isNowActive = layer.classList.toggle("active")
                    button.classList.toggle("active", isNowActive)
                    this.visibilityMap[id] = isNowActive
                    this.saveVisibility()
                })
            })
    }

    private setupEventListeners(): void {
        // console.log("Setting up event listeners for GridManager")
        document.addEventListener("DOMContentLoaded", () => {
            this.updateAllGridHeights()
            this.setupToggleButtons()

            window.addEventListener("resize", () =>
                this.updateAllGridHeights(),
            )
            window.addEventListener("scroll", () =>
                this.updateAllGridHeights(),
            )
        })
    }
}
