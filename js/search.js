/**
 * Bird Search Module
 * This module handles the search functionality for bird names, including autocomplete suggestions.
 *
 * References:
 * Stack Overflow: Removing layers from a Leaflet map: https://stackoverflow.com/questions/31386562/removing-layers-from-a-leaflet-map
 * W3Schools: How to create an Autocomplete: https://www.w3schools.com/howto/howto_js_autocomplete.asp
 */

$(document).ready(function() {
    const birdOccurrences = []; // This will hold all occurrences fetched from the API.
    scientificNames = window.scientificNames; // Populate scientific names
    commonNames = window.commonNames; // Populate common names

    /**
     * Updates the suggestions list based on the user's input.
     * @param {string} searchText - The text entered by the user in the search input
     */
    function updateSuggestionsList(searchText) {
        // Check for matches in common names first
        let matchingNames = commonNames.filter(name => name.toLowerCase().startsWith(searchText.toLowerCase()));

        // If no matches found in common names, check scientific names
        if (matchingNames.length === 0) {
            matchingNames = scientificNames.filter(name => name.toLowerCase().startsWith(searchText.toLowerCase()));
        }

        console.log(`User input: ${searchText}`);
        console.log("Matching Names:", matchingNames);

        const suggestionsList = $('#suggestions-List');
        suggestionsList.empty();

        // Populate the suggestions list
        matchingNames.forEach(name => {
            suggestionsList.append(`<li>${name}</li>`);
        });
        
        // Show or hide suggestions based on matches
        if (matchingNames.length === 0) {
            suggestionsList.hide();
        } else {
            suggestionsList.show();
        }
    }

    // Event handler for when the user types in the search input
    $('#search-input').on('input', function() {
        const searchText = $(this).val();
        if (searchText.length >= 2) {
            updateSuggestionsList(searchText);
        } else {
            $('#suggestions-List').empty().hide();
        }
    });

    // Event handler for clicking on a suggestion
    $('#suggestions-List').on('click', 'li', function() {
        const selectedName = $(this).text();
        $('#search-input').val(selectedName);
        $('#suggestions-List').empty().hide();
        $('#search-input').focus(); // Keep focus on the search input
    });

    // Event handler to detect click outside the input and list
    $(document).on('click', function (event) {
        const isClickInside = $(event.target).closest('#search-input, #suggestions-list').length > 0;

        if (!isClickInside) {
            const suggestionsList = $('#suggestions-list');

            // If there are items in the list, select the first one
            if (suggestionsList.children('li').length > 0) {
                const firstSuggestion = suggestionsList.children('li:first').text();
                $('#search-input').val(firstSuggestion);
            }
            suggestionsList.empty().hide(); // Hide the suggestions list
        }
    });
});
