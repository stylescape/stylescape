// ============================================================================
// Soft Scroll
// ============================================================================

/**
 * The SoftScroll class provides a smooth scrolling effect for anchor links.
 * It allows configuring scroll behavior for specific selectors with optional offset adjustments.
 *
 * @example
 * // Usage:
 * SoftScroll.enableForSelector('.scroll-link', 2); // Applies smooth scroll with a 2rem offset.
 */
export class SoftScroll {
    /**
     * Enables smooth scrolling for anchor links matching the specified selector.
     *
     * @param selector - A CSS selector string to target anchor links.
     * @param yOffsetInRem - An optional vertical offset in rem units to adjust the scroll position (default: 0).
     */
    static enableForSelector(selector: string, yOffsetInRem: number = 0): void {
        const links = document.querySelectorAll(selector);

        // Iterate over each link element that matches the selector
        links.forEach(link => {
            // Ensure the element is an HTMLAnchorElement before proceeding
            if (!(link instanceof HTMLAnchorElement)) {
                console.warn(`Element is not an anchor: ${link}`);
                return;
            }

            // Add a click event listener to each anchor link
            link.addEventListener('click', (event: Event) => {
                event.preventDefault();

                const targetId = link.getAttribute('href')?.substring(1); // Get the target element ID from the href attribute
                const targetElement = document.getElementById(targetId); // Find the target element by ID

                // Proceed if the target element exists
                if (targetElement) {
                    const yOffset = yOffsetInRem * parseFloat(getComputedStyle(document.documentElement).fontSize); // Convert rem offset to pixels
                    const topPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - yOffset; // Calculate the scroll position

                    // Smoothly scroll to the calculated position
                    window.scrollTo({ top: topPosition, behavior: 'smooth' });
                } else {
                    console.warn(`Target element not found for ID: ${targetId}`);
                }
            });
        });
    }
}

// Usage example:
// Enables smooth scrolling for all anchor links with the class 'scroll-link' and applies a 2rem offset.
SoftScroll.enableForSelector('.scroll-link', 2);




// export class SoftScroll {
//     static enableForSelector(selector: string, yOffsetInRem: number = 0): void {
//         const links = document.querySelectorAll(selector);

//         links.forEach(link => {
//             if (!(link instanceof HTMLAnchorElement)) {
//                 return;
//             }

//             link.addEventListener('click', (event: Event) => {
//                 event.preventDefault();

//                 const targetId = link.getAttribute('href')?.substring(1);
//                 const targetElement = document.getElementById(targetId);

//                 if (targetElement) {
//                     const yOffset = yOffsetInRem * parseFloat(getComputedStyle(document.documentElement).fontSize);
//                     const topPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - yOffset;
//                     window.scrollTo({ top: topPosition, behavior: 'smooth' });
//                 }
//             });
//         });
//     }
// }
