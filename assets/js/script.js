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
        // Creating listed-item links for each Searched City 'to 6'
        cityLink = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
    
        // Appending Listed Items with class of list-group
        cityLink.text(searchHistory[i]);
        $(".list-group").append(cityLink);

        // To create function to call getHistory();
        $(".list-group-item").click(function() {
        cityName = $(this).text();
        getWeatherInfo(cityName);
        });
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
    // User City Input
    var cityName = cityInputEl.value.trim();

    //getWeatherData();

    var checkHistory = searchHistory.includes(cityName);
    if (checkHistory == true) {
        return;
    }
    else {
        searchHistory.push(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        var cityLink = $("<a>").attr({
            // list-group-item-action keeps the search history buttons consistent
            class: "list-group-item list-group-item-action",
            href: "#"
        });

        cityLink.text(cityName);
        $(".list-group").append(cityLink);
    };

    // If statement to clear text
    // && to tell user they must enter a city
    if (cityName) {
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name :)")
    }
};

$(".remove-history").click(function() {
    window.localStorage.clear();
    event.preventDefault();
    $(".list-group-item").remove();
    location.reload();
});

userFormEl.addEventListener("submit", userSubmitHandler);
getHistory();