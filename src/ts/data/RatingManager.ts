// Manages a star rating UI, allowing users to set and view ratings.

// export default class RatingManager {
//     private stars: NodeListOf<HTMLElement>;
//     private ratingValue: number = 0;

//     constructor(starsSelector: string) {
//         this.stars = document.querySelectorAll(starsSelector);
//         this.stars.forEach((star, index) => {
//             star.addEventListener('click', () => this.setRating(index + 1));
//         });
//     }

//     private setRating(value: number): void {
//         this.ratingValue = value;
//         this.stars.forEach((star, index) => {
//             star.classList.toggle('active', index < value);
//         });
//     }

//     getRating(): number {
//         return this.ratingValue;
//     }
// }

// Usage
// const ratingManager = new RatingManager('.star');
// ratingManager.getRating() to get the current rating
