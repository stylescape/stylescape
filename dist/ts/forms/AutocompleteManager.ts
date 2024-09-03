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


// Manages an autocomplete functionality for input fields, including search suggestions.


export default class AutocompleteManager {

    private input: HTMLInputElement;
    private suggestionsList: HTMLElement;

    constructor(inputId: string, suggestionsListId: string) {
        this.input = document.getElementById(inputId) as HTMLInputElement;
        this.suggestionsList = document.getElementById(suggestionsListId) as HTMLElement;
        this.input.addEventListener('input', () => this.updateSuggestions(this.input.value));
    }

    private updateSuggestions(query: string): void {
        // Fetch and display suggestions based on query
        // For demo purposes, we'll just log the query
        console.log('Updating suggestions for query:', query);
    }
}

// Usage
const autocompleteManager = new AutocompleteManager('searchInput', 'suggestionsList');
