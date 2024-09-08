
// Handles infinite scrolling logic, loading more content as the user scrolls down.


// export default class InfiniteScrollManager {
//     private threshold: number;
//     private loadMoreCallback: () => void;

//     constructor(threshold: number = 300, loadMoreCallback: () => void) {
//         this.threshold = threshold;
//         this.loadMoreCallback = loadMoreCallback;
//         window.addEventListener('scroll', this.handleScroll.bind(this));
//     }

//     private handleScroll(): void {
//         const reachedBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - this.threshold;
//         if (reachedBottom) {
//             this.loadMoreCallback();
//         }
//     }
// }

// // Usage
// const infiniteScroll = new InfiniteScrollManager(300, loadMoreContent);
// // loadMoreContent is a function that loads more data

