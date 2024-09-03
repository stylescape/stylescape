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



// Implements a countdown timer UI, updating the display as the timer counts down.

export default class CountdownTimer {
    private endTime: Date;
    private displayElement: HTMLElement;

    constructor(endTime: Date, displayElementId: string) {
        this.endTime = endTime;
        this.displayElement = document.getElementById(displayElementId) as HTMLElement;
        this.startTimer();
    }

    private startTimer(): void {
        const interval = setInterval(() => {
            const remaining = this.endTime.getTime() - new Date().getTime();
            if (remaining <= 0) {
                clearInterval(interval);
                this.displayElement.textContent = 'Time up!';
                return;
            }
            this.displayElement.textContent = this.formatTime(remaining);
        }, 1000);
    }

    private formatTime(timeInMilliseconds: number): string {
        const seconds = Math.floor((timeInMilliseconds / 1000) % 60);
        const minutes = Math.floor((timeInMilliseconds / 1000 / 60) % 60);
        const hours = Math.floor((timeInMilliseconds / 1000 / 60 / 60) % 24);
        return `${hours}:${minutes}:${seconds}`;
    }
}

// Usage
const countdown = new CountdownTimer(new Date('2023/01/01 00:00:00'), 'countdownDisplay');
