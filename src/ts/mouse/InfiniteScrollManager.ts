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

