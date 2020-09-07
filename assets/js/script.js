// Global Variables
var searchHistory = [];
var cityInputEl = document.querySelector("#city");
var userFormEl = document.querySelector("#user-form");
var date = moment().format("MM/DD/YYYY");
var mainCard = $("#daily-forecast");

// Date format for jumbo-tron
$(document).ready(function() {

// Current Date from Moment
const now = moment().format('LL');

// Setting Date at top of page
let pageDate = $('#currentDay');
$(pageDate).text(now);

});

$(".remove-history").click(function() {
    window.localStorage.clear();
    $(".list-group-item").remove();
    location.reload();
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
    // To remove content from container
    $("#weekly-forecast").empty();
    $("#daily-forecast").empty();
    
    // Api URL for single most up-to-date weather
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + name + "&appid=d137f08c46cdb94d7d0aa58a6e5c6fba";

    $.ajax({
        url: apiURL,
        method: "GET"
    }).then(function(response) {
        // To create var for iconCode manipulation
        var icon = response.weather[0].icon;

        // To get icon img from weatherAPi Source
        var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";

        var cardTitle = $("<h3>")
        .text(name);
        
        // To append to card body
        mainCard.prepend(cardTitle);

        // To append the Icon as an IMG
        mainCard.append($("<img>")
        .attr("src", iconURL));

        // To set CityTemp and calculate correct Temp && Append
        var cityTemp = response.main.temp;
        var cityTemp = Math.round((response.main.temp - 276) * 1.80 + 32);
        mainCard.append($("<p>").html("Temperature: " + cityTemp + " &#8457"));

        // To set CityHumidity
        var cityHumid = response.main.humidity;
        mainCard.append($("<p>").html("Humidity: " + cityHumid + "%"));

        // To set CitySpeed
        var citySpeed = response.wind.speed;
        mainCard.append($("<p>").html("Wind Speed: " + citySpeed + " MPH"));

        // To retrieve UVInded we need LAT/LONGITUDE
        // Fetch and transfer data through new API
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=d137f08c46cdb94d7d0aa58a6e5c6fba&lat=" + lat + "&lon=" + lon,
            method: "GET"
            })
            .then(function(response) {
            // To display UVIndex in main Card Body
            mainCard.append($("<p>").html("UV Index: <i>" + response.value + "</i>"));

            // To create UVIndex background based on the data given
            // Severity = higher number (closer to danger colors) <>
            if (response.value <= 2) {
                $("i").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("i").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("i").attr("class", "btn btn-outline-danger");
            };
        });

        // To fetch for Weekly "5-Day" ForeCast
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + name + "&appid=d137f08c46cdb94d7d0aa58a6e5c6fba",
            method: "GET"
        // To display 5 separate columns from the forecast response
        }).then(function(response) {
            for (var i = 0; i < 5; i++) {
                // To create columns
                var newCard = $("<div>").attr("class", "col bg-primary text-white rounded-lg column-days");
                $("#weekly-forecast").append(newCard);

                // To create a date for each day using help from Moment.JS
                var myDate = new Date(response.list[i * 8].dt * 1000);
                newCard.append($("<h4>").html(myDate.toLocaleDateString()));

                // To get icon corresponding to weather each day
                var icon = response.list[i * 8].weather[0].icon;
                // To get icon from the API
                var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
                // To append the Icon as an IMG
                newCard.append($("<img>").attr("src", iconURL));

                // To set CityTemp and calculate correct Temp && Append *again
                var cityTemp = Math.round((response.list[i * 8].main.temp - 276) * 1.80 + 32);
                newCard.append($("<p>").html("Temperature: " + cityTemp + " &#8457"));
            
                // To set CityHumidity
                var cityHumid = response.list[i * 8].main.humidity;
                // displays humidity
                newCard.append($("<p>").html("Humidity: " + cityHumid + "%"));
            };
        });
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
        getWeatherInfo(cityName);
    } else {
        alert("Please enter a city name :)")
    }
};

userFormEl.addEventListener("submit", userSubmitHandler);
getHistory();