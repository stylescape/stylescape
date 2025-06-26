// Manages an image slider or carousel functionality, handling next and previous actions.

export default class SliderManager {
    private slides: NodeListOf<HTMLElement>
    private currentIndex: number = 0

    constructor(sliderSelector: string) {
        this.slides = document.querySelectorAll(`${sliderSelector} .slide`)
        this.showSlide(this.currentIndex)
    }

    private showSlide(index: number): void {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? "block" : "none"
        })
    }

    nextSlide(): void {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length
        this.showSlide(this.currentIndex)
    }

    prevSlide(): void {
        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length) % this.slides.length
        this.showSlide(this.currentIndex)
    }
}

// Usage
// const slider = new SliderManager('#mySlider')
// slider.nextSlide() or slider.prevSlide() to control
