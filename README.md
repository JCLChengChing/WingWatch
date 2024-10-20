# WingWatch - Bird Sighting Tracker

## Introduction

WingWatch is a web-based application designed to help bird enthusiasts and photographers track and share bird sightings. By utilizing historical data and optimized map illustrations, the app provides users with valuable insights into prime bird spotting locations for various species.

The platform enables efficient searching and tracking of bird species by analyzing occurrence data, making it easier for users to locate specific birds. WingWatch differentiates itself by combining data analysis with an intuitive interface, offering a seamless experience for users looking to enhance their bird-watching activities. Its value lies in empowering users with actionable information, improving their bird-spotting efficiency, and fostering a community of bird enthusiasts.

### Features

- User-friendly interface for recording bird sightings
- Interactive map for precise location tagging
- Gallery view of all recorded sightings
- Search functionality to find specific sightings


### Project Structure

WingWatch/
├── css/
│   ├── index_bird.css        # styles for right bar of index.html include last seen bar, record.
│   ├── modal-pop-up.css       # styles for modal pop-ups forms 
│   ├── setting.css       # styles for setting.html
│   └── styles.css       # main css style
├── js/
│   ├── collect.js         # JS for collecting bird sighting data
│   ├── common.js          # Common JS utilities used across the application
│   ├── gallery-pop-up.js  # JS for handling gallery pop-ups
│   ├── index_bird_content.js # JS for dynamic content on the main page
│   ├── index.js           # Main JS file for the homepage
│   ├── jquery.min.js      # jQuery library
│   ├── location-picker.js # JS for picking locations on a map
│   ├── maps-loader.js     # JS for loading map-related functionalities
│   ├── modal-pop-up.js    # JS for modal pop-up functionality
│   ├── pop-up-map.js      # JS for pop-up map functionalities
│   ├── search.js          # JS for search functionality
│   └── setting.js         # JS for settings functionalities
├── node_modules/          # Dependencies for Node.js
├── picture/               # Folder containing pictures
├── user_bird/             # Folder containing user-submitted bird pictures
├── .env                   # Environment variables
├── .gitignore             # Specifies intentionally untracked files to ignore
├── collect.html           # HTML for the data collection page
├── data.txt               # Text file for storing data
├── gallery.html           # HTML for the gallery page
├── id_counter.txt         # Keeps track of ID count
├── index.html             # Main entry HTML file
├── package-lock.json      # Automatically generated for any operations where npm modifies either the node_modules tree, or package.json
├── package.json           # Records important metadata about a project
├── process.env            # Alternative environment file
├── README.md              # README file for the project documentation
├── setting.html           # HTML for settings page
└── submit_data.php        # PHP script for submitting data

### Technologies Used

- HTML
- CSS
- JavaScript
- jQuery
- Leaflet.js for maps
- PHP for backend user data processing


### API and dataset 
- Google Map API
- Leaflet.js for maps
- Wildlife open data: https://biocache-ws.ala.org.au/ws/occurrences/search



### Setup and Installation

1. Navigating to `https://deco1800teams-t03-wingwatch.uqcloud.net/` on any browser.

### Usage

This section guides you through the various functionalities of the application, ensuring you can effectively use all features:

- **Searching for Birds:**
  - Go to the search bar.
  - Enter the bird's scientific or common name to find specific sightings.

- **Viewing Bird Details:**
  - Locate the bird's marker on the map.
  - Click the marker to see detailed information, including the last seen time.

- **Adding a New Sighting:**
  - Click the "collect" button on the homepage or the '+' icon on the collection page to start a new entry.
  - Complete the form by entering the species, time, and location of the sighting.
  - Utilize the interactive map to accurately mark the sighting location.

- **Reviewing Your Sightings:**
  - Access the gallery or interactive map to view all your recorded sightings.

These instructions will help you navigate the app smoothly, from finding and adding bird sightings to reviewing them later.

### Features

- **Fast Bird Search:** Quickly search for birds by entering their scientific or common name for immediate results.
- **User-Friendly Navigation:** Simple and intuitive navigation to ensure ease of use for all users, whether beginners or experienced bird watchers.
- **Real-Time Information:** View up-to-date information on bird sightings, including the last seen time and other relevant details.
- **Data Collection & Display:** Seamlessly add new sightings and have your data automatically collected, stored, and displayed for future reference.
- **Bird Gallery:** Browse through a visually appealing gallery that displays all your recorded bird sightings in one place.



### Acknowledgments

We would like to express our gratitude to the following individuals and technologies that made this project possible:

- **Course Instructors and Teaching Assistants** - For their invaluable guidance and support throughout the development of this project.
- **jQuery** - Used for simplifying JavaScript operations and enhancing the interactivity of the application.
- **Wildlife API** - For providing access to essential bird sighting data that powers our application.
- **Google Maps API** - For offering detailed maps and location-based services to enhance the bird sighting tracking experience.
- **Leaflet.js** - For providing an open-source library to display interactive maps.

### Reference

Check each file for reference.
