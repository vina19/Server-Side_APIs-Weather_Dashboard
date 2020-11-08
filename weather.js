// OpenWeather API key
let myAPIkey = "0906529f0e63b6d51e5251dfa653e405";

// When the document html ready then run the functions insied it
$(document).ready(function() {
    
    // Function that will run after the search button clicked
    $("#search-btn").on("click", function() {

        // Get the search city input from the user
        let cityName = $("#city-search").val();

        // Empty the search bar
        $("#city-search").val("");

        // Create a button list with the name of the city that the user input
        let cityList = $("#city-list");
        let city = $("<a>");
        city.addClass("list-group-item list-group-item-action city");
        city.text(cityName);

        cityList.append(city);

        // URL where the data is from
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + myAPIkey;

        // Create an AJAX call to retrieve the data from OpenWeather API by the city
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            // Call the getCityWeatherDescription and getUVIndex to fill in the city weather description box
            getCityWeatherDescription(response);
            getUVIndex(response);

            // Call the getFiveDayForecast to show the five day forecast inside the 5 days forecast cards
            getFiveDayForecast(response);

        });
    });
});

function getCityWeatherDescription(city) {

    // Empty the box everytime the user search a different city
    $("#city-weather").empty();

    // Get current date
    let currentDate = moment().format("L");

    // Convert the temperature to Fahrenheit
    let tempToF = Math.floor((city.main.temp - 273.15) * 1.80 + 32);
    
    // Create elements and add the city weather descriptions to the box
    // City weather descriptions: Name of the city, current date, temperature,
    // Humidity, wind speed, and UV index (will get this uv index in different function).
    let cityTitle = $("<h1>");
    cityTitle.addClass("city-title");
    cityTitle.text(city.name + " " + currentDate);

    let cityTemp = $("<p>");
    cityTemp.addClass("city-temp");
    cityTemp.text("Temperature: " + tempToF + "F");

    let cityHumidity = $("<p>");
    cityHumidity.addClass("city-humidity");
    cityHumidity.text("Humidity: " + city.main.humidity + "%");

    let cityWindSpeed = $("<p>");
    cityWindSpeed.addClass("city-wind-speed");
    cityWindSpeed.text("Wind Speed: " + city.wind.speed + "MPH");

    // Append all the elements to the box of the city weather descriptions.
    $("#city-weather").append(cityTitle, cityTemp, cityHumidity, cityWindSpeed);
};

// Get UV Index
function getUVIndex(city) {

    // Get the latitude and longitude of the city
    let cityLat = city.coord.lat;
    let cityLon = city.coord.lon;

    // URLto get the uv index data
    let cityUVIndexQueryUrl =  "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + myAPIkey;

    // Create an AJAX call to retrieve the uv index data
    $.ajax({
        url: cityUVIndexQueryUrl,
        method: "GET"
    }).then(function(UVindexResponse) {

        // Create <p> element for the UV Index value 
        let cityUVindex = $("<p>");
        cityUVindex.addClass("city-uv-index");
        cityUVindex.text("UV Index: " + UVindexResponse.value);

        // Append the UV Index value to the city weather description box
        $("#city-weather").append(cityUVindex);

    });
};

// Function to get the five day forecast
function getFiveDayForecast(city) {

    // Get the city name
    let cityForecastName = city.name;

    // The URL API to get the 5 day forecast
    let fiveDayForecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityForecastName + "&appid=" + myAPIkey;

    // Create an AJAX call to retrive the five day forecast data
    $.ajax({
        url: fiveDayForecastUrl,
        method: "GET"
    }).then(function(forecastResponse) {

        console.log(forecastResponse);

        //$("#forecast-cards")
    });
};


    
