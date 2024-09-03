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


// Manages a progress bar UI, updating its value and appearance based on progress state.

export default class ProgressBarManager {
    private progressBar: HTMLElement;

    constructor(progressBarId: string) {
        this.progressBar = document.getElementById(progressBarId) as HTMLElement;
    }

    setProgress(percentage: number): void {
        this.progressBar.style.width = `${percentage}%`;
    }
}

// Usage
const progressBarManager = new ProgressBarManager('myProgressBar');
// progressBarManager.setProgress(50); // Set progress to 50%
