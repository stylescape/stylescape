// Carousel Class
// A carousel allows users to cycle through elements like images or cards, often used in galleries or as a slideshow.

export default class CarouselManager {
    private container: HTMLElement
    private items: NodeListOf<HTMLElement>
    private currentIndex: number = 0

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement
        this.items = this.container.querySelectorAll(".carousel-item")
        this.setupButtons()
    }

    private setupButtons() {
        document
            .getElementById("prevBtn")!
            .addEventListener("click", () => this.movePrev())
        document
            .getElementById("nextBtn")!
            .addEventListener("click", () => this.moveNext())
    }

    private movePrev() {
        if (this.currentIndex > 0) {
            this.items[this.currentIndex].classList.remove("active")
            this.currentIndex--
            this.items[this.currentIndex].classList.add("active")
        }
    }

    private moveNext() {
        if (this.currentIndex < this.items.length - 1) {
            this.items[this.currentIndex].classList.remove("active")
            this.currentIndex++
            this.items[this.currentIndex].classList.add("active")
        }
    }
}

// Example HTML: <div id="carouselContainer"><div class="carousel-item active">Item 1</div><div class="carousel-item">Item 2</div></div>

// Handles a carousel or slider, enabling cycling through items like images or cards.

// export default class CarouselManager {
//     private items: NodeListOf<HTMLElement>
//     private currentIndex: number = 0

//     constructor(carouselSelector: string) {
//         this.items = document.querySelectorAll(`${carouselSelector} .carousel-item`)
//     }

//     next(): void {
//         this.updateIndex(this.currentIndex + 1)
//     }

//     previous(): void {
//         this.updateIndex(this.currentIndex - 1)
//     }

//     private updateIndex(newIndex: number): void {
//         this.currentIndex = (newIndex + this.items.length) % this.items.length
//         this.items.forEach((item, index) => {
//             item.style.display = index === this.currentIndex ? 'block' : 'none'
//         })
//     }
// }

// Usage
// const carouselManager = new CarouselManager('#myCarousel')
// carouselManager.next() or carouselManager.previous()
