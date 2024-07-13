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
  