// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// Global Variables
var searchHistory = [];
var cityInputEl = document.querySelector("#city");
var userFormEl = document.querySelector("#user-form");

// Date format for jumbo-tron
$(document).ready(function() {

// Current Date from Moment
const now = moment().format('LL');

// Setting Date at top of page
let pageDate = $('#currentDay');
$(pageDate).text(now);

});

// Function to populate History List of cities
var getHistory = function() {
    var savedCity = JSON.parse(localStorage.getItem("searchHistory"));
    if (savedCity !== null) {
        searchHistory = savedCity;
    };

    // To cycle through History Data
    for (var i = 0; i < searchHistory.length; i++) {
        // Statement to prevent anymore than 6 cities to append
        if (i = 6)
        break;

        // Creating listed-item links for each Searched City 'to 6'
        cityLink = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
    
        // Appending Listed Items with class of list-group
        cityLink.text(searchHistory[i]);
        $(".list-group").append(cityLink);
    };
};

// Function to manipulate API link to add custom city search
// which user will type in EX: name = city, city = Houston
var getWeatherInfo = function(name) {
    var apiURL ="https://api.openweathermap.org/data/2.5/forecast?q=" + name + "&appid=d137f08c46cdb94d7d0aa58a6e5c6fba";

    fetch(apiURL)
    .then(function(response) {
        if(response.ok) {
            response.json()
            .then(function(data) {
                console.log(data);
            });
        } else {
            // Error 400 ^ EX: City not found or incorrect characters
            alert("Error: " + response.statusText);
        };
    })
    // Error 500 ^ EX: Most likely internet issues
    .catch(function(error) {
        // To notify user of connection issue to Weather API
        alert("Unable to connect to Weather API");
    });
};

var userSubmitHandler = function() {
    // To prevent default page reloading
    event.preventDefault();

    // User City Input
    var cityName = cityInputEl.value.trim();

    // If statement to clear text
    // && to tell user they must enter a city
    if (cityName) {
        cityInputEl.value = "";
        getWeatherInfo(cityName);
    } else {
        alert("Please enter a city name :)")
    }



};

userFormEl.addEventListener("submit", userSubmitHandler);