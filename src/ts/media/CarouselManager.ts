// Handles a carousel or slider, enabling cycling through items like images or cards.

export default class CarouselManager {
    private items: NodeListOf<HTMLElement>
    private currentIndex: number = 0

    constructor(carouselSelector: string) {
        this.items = document.querySelectorAll(`${carouselSelector} .carousel-item`)
    }

    next(): void {
        this.updateIndex(this.currentIndex + 1)
    }

    previous(): void {
        this.updateIndex(this.currentIndex - 1)
    }

    private updateIndex(newIndex: number): void {
        this.currentIndex = (newIndex + this.items.length) % this.items.length
        this.items.forEach((item, index) => {
            item.style.display = index === this.currentIndex ? 'block' : 'none'
        })
    }
}

// Usage
const carouselManager = new CarouselManager('#myCarousel')
// carouselManager.next() or carouselManager.previous()
