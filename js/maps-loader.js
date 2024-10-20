/**
 * Google Maps API Loader
 * This module dynamically loads the Google Maps JavaScript API and provides a method to import libraries.
 */

((config) => {
  // Declare variables for later use
  var apiLoadPromise, scriptElement, paramKey;
  const errorMessage = "The Google Maps JavaScript API";  // Descriptive string for error messages
  const googleNamespace = "google";                       // Namespace for Google
  const importLibraryFn = "importLibrary";                // Function name to import Google Maps libraries
  const callbackName = "__ib__";                          // Internal callback property name
  const doc = document;                                   // Reference to the document object
  let win = window;                                       // Reference to the global window object

  // Initialize the Google namespace and maps object if not already defined
  win = win[googleNamespace] || (win[googleNamespace] = {});
  const mapsNamespace = win.maps || (win.maps = {});
  const librarySet = new Set();                           // Set to store requested library names
  const queryParams = new URLSearchParams();              // Create URLSearchParams object to build query string

  /**
   * Loads the Google Maps JavaScript API
   * @returns {Promise} A promise that resolves when the API is loaded
   */
  const loadGoogleMapsAPI = () => 
    apiLoadPromise || (apiLoadPromise = new Promise(async (resolve, reject) => {
      await (scriptElement = doc.createElement("script"));  // Create a new script element

      // Add library names to the URL parameters
      queryParams.set("libraries", [...librarySet] + "");
      
      // Add additional configuration options to the URL parameters
      for (paramKey in config) 
        queryParams.set(paramKey.replace(/[A-Z]/g, match => "_" + match[0].toLowerCase()), config[paramKey]);

      // Set the callback parameter to the global callback function
      queryParams.set("callback", googleNamespace + ".maps." + callbackName);
      
      // Set the script source to the Google Maps API with the query parameters
      scriptElement.src = `https://maps.${googleNamespace}apis.com/maps/api/js?` + queryParams;

      // Define the global callback function to resolve the promise
      mapsNamespace[callbackName] = resolve;

      // Handle script loading error
      scriptElement.onerror = () => apiLoadPromise = reject(Error(errorMessage + " could not load."));

      // Set a nonce attribute if a script with a nonce exists in the document
      scriptElement.nonce = doc.querySelector("script[nonce]")?.nonce || "";

      // Append the script to the document head to start loading
      doc.head.append(scriptElement);
    }));

  // Check if the importLibrary function is already defined
  if (mapsNamespace[importLibraryFn]) {
    console.warn(errorMessage + " only loads once. Ignoring:", config);
  } else {
    /**
     * Imports a Google Maps library
     * @param {string} libraryName - The name of the library to import
     * @param {...any} rest - Additional arguments to pass to the original importLibrary function
     * @returns {Promise} A promise that resolves when the library is loaded
     */
    mapsNamespace[importLibraryFn] = (libraryName, ...rest) => 
      librarySet.add(libraryName) && loadGoogleMapsAPI().then(() => mapsNamespace[importLibraryFn](libraryName, ...rest));
  }
})
// Immediately invoke the function with the Google Maps API key and version as configuration options
({ key: "AIzaSyA8RnliZz_1L9qZMyUoICB26UYWlrK4lLU", v: "weekly" });
