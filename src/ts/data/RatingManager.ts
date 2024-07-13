// Copyright 2024 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



// Manages a star rating UI, allowing users to set and view ratings.

export default class RatingManager {
    private stars: NodeListOf<HTMLElement>;
    private ratingValue: number = 0;

    constructor(starsSelector: string) {
        this.stars = document.querySelectorAll(starsSelector);
        this.stars.forEach((star, index) => {
            star.addEventListener('click', () => this.setRating(index + 1));
        });
    }

    private setRating(value: number): void {
        this.ratingValue = value;
        this.stars.forEach((star, index) => {
            star.classList.toggle('active', index < value);
        });
    }

    getRating(): number {
        return this.ratingValue;
    }
}

// Usage
const ratingManager = new RatingManager('.star');
// ratingManager.getRating() to get the current rating
