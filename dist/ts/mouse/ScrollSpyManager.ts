

// Updates navigation based on scroll position, commonly used in single-page websites.
export class ScrollSpyManager {
    private sections: HTMLElement[];
    private navLinks: NodeListOf<HTMLElement>;
    private scrollContainer: HTMLElement | Window;

    constructor(sections: HTMLElement[], navLinksSelector: string, containerId?: string) {
        this.sections = sections;
        this.navLinks = document.querySelectorAll(navLinksSelector);
        this.scrollContainer = containerId ? document.getElementById(containerId) || window : window;

        this.attachScrollListener();
    }
 
    private attachScrollListener(): void {
        // console.log('attachScrollListener');
        const scrollHandler = this.scrollContainer === window ? 
        window.addEventListener('scroll', this.updateActiveLink.bind(this)) : 
        this.scrollContainer.addEventListener('scroll', this.updateActiveLink.bind(this), true);

        this.updateActiveLink(); // Initialize active state
    }

    private updateActiveLink(): void {
        // console.log('updateActiveLink');
        // console.log(this.sections);
        // console.log(this.navLinks);

        let currentSection = '';
        const containerScrollY = this.scrollContainer instanceof Window ? window.scrollY : this.scrollContainer.scrollTop;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (containerScrollY >= sectionTop - sectionHeight / 2) {
                currentSection = section.getAttribute('id')!;
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}
