export class ExclusiveDetails {
    private detailsElements: NodeListOf<HTMLDetailsElement>;

    constructor(selector: string) {
      this.detailsElements = document.querySelectorAll(selector);

      // Bind event listeners
      this.bindEvents();
    }

    private bindEvents(): void {
      // Handle click on each details element
      this.detailsElements.forEach((details) => {
        details.addEventListener('click', (e) => this.handleDetailsClick(e, details));
      });

      // Handle click outside details elements
      document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    private handleDetailsClick(event: MouseEvent, details: HTMLDetailsElement): void {
      event.stopPropagation(); // Prevent event from bubbling to document

      // Close other details elements
      this.detailsElements.forEach((otherDetails) => {
        if (otherDetails !== details) {
          otherDetails.removeAttribute('open');
        }
      });
    }

    private handleClickOutside(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      const isClickInside = Array.from(this.detailsElements).some((details) =>
        details.contains(target)
      );

      // If click is outside all details elements, close them
      if (!isClickInside) {
        this.closeAll();
      }
    }

    private closeAll(): void {
      this.detailsElements.forEach((details) => {
        details.removeAttribute('open');
      });
    }
  }

  // Usage
