
export class ScrollElementManager {
    private contentElement: HTMLElement;

    constructor(contentSelector: string) {


        this.contentElement = document.querySelector(contentSelector) as HTMLElement;
        if (!this.contentElement) {
            // pass
            // console.error("ScrollElementManager: Specified element not found.");
            return;
        }
        // console.log("ScrollElementManager")

        this.initialize();
    }

    private initialize(): void {
        window.addEventListener('load', this.loadScrollPosition.bind(this));
        this.contentElement.addEventListener(
            'scroll', this.updateScrollPosition.bind(this)
        );
        // console.log("ScrollElementManager Init")

    }

    // private loadScrollPosition(): void {
    loadScrollPosition(): void {
        const scrollpos = localStorage.getItem('scrollpos');
        // console.log('Restoring scroll position:', scrollpos);
        if (scrollpos && scrollpos != null) {
            this.contentElement.scrollTop = parseInt(scrollpos);
            // console.log('Scroll position set to:', this.contentElement.scrollTop);
        }
    }

    // private loadScrollPosition(): void {
    //     const scrollpos = localStorage.getItem('scrollpos');
    //     if (scrollpos) {
    //         this.contentElement.scrollTop = parseInt(scrollpos);
    //     }
    //     console.log("ScrollElementManager Load")

    // }

    private updateScrollPosition(): void {
        localStorage.setItem(
            'scrollpos', this.contentElement.scrollTop.toString()
        );
        // console.log("ScrollElementManager Update")

    }
}

// Initialize the ScrollManager with the selector of your main content element
// const scrollManager = new ScrollElementManager('#main-content');
