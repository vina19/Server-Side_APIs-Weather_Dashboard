// OpenWeather API key
let myAPIkey = "0906529f0e63b6d51e5251dfa653e405";

// city name arrays
let citySearchHistory = [];

// When the document html ready then run the functions insied it
$(document).ready(function() {

    getCitySearch();
    
    // Function that will run after the search button clicked
    $("#search-btn").on("click", function() {

        // Create a variable for the input name from the user
        let cityName = $("#city-search").val();

        // Call the getCityWeatherDescription to fill in the city weather description box
        getCityWeatherDescription(cityName);

        // Empty the search bar
        $("#city-search").val("");

        // Add the city name to the city search history array
        citySearchHistory.push(cityName);

        // Set the city name as the city search history to the localStorage
        localStorage.setItem("citySearchedHistory", JSON.stringify(citySearchHistory));

        // Call the save function to save the city search
        saveCitySearch();
    });
});

function getCityWeatherDescription(city) {

    // URL where the data is from
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myAPIkey;

    // Create an AJAX call to retrieve the data from OpenWeather API by the city
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        // Empty the box everytime the user search a different city
        $("#city-weather").empty();

        // Get current date
        let currentDate = moment().format("L");

        // Convert the temperature Celsius to Fahrenheit
        let tempToF = Math.floor((response.main.temp - 273.15) * 1.80 + 32);
    
        // Create elements and add the city weather descriptions to the box
        // City weather descriptions: Name of the city, current date, temperature,
        // Humidity, wind speed, and UV index (will get this uv index in different function).
        let cityTitle = $("<h1>");
        cityTitle.addClass("city-title");

        let weatherIcon = $("<img>");
        // get the idea of which link  grab the weather icon image from: 
        // https://stackoverflow.com/questions/44177417/how-to-display-openweathermap-weather-icon
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
    
        cityTitle.text(response.name + " " + currentDate);
        cityTitle.append(weatherIcon);

        let cityTemp = $("<p>");
        cityTemp.addClass("city-temp");
        cityTemp.text("Temperature: " + tempToF + " °F");

        let cityHumidity = $("<p>");
        cityHumidity.addClass("city-humidity");
        cityHumidity.text("Humidity: " + response.main.humidity + "%");

        let cityWindSpeed = $("<p>");
        cityWindSpeed.addClass("city-wind-speed");
        cityWindSpeed.text("Wind Speed: " + response.wind.speed + " MPH");

        // Append all the elements to the box of the city weather descriptions.
        $("#city-weather").append(cityTitle, cityTemp, cityHumidity, cityWindSpeed);
    
        getUVIndex(response.coord.lon, response.coord.lat);
        getFiveDayForecast(response.name);

});        

// Get UV Index
function getUVIndex(cityLon, cityLat) {

    // URLto get the uv index data
    let cityUVIndexQueryUrl =  "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + myAPIkey;

    // Create an AJAX call to retrieve the uv index data
    $.ajax({
        url: cityUVIndexQueryUrl,
        method: "GET"
    }).then(function(UVindexResponse) {

        // Create <p> element for the UV Index and <span> for the value 
        let cityUVindex = $("<p>");
        cityUVindex.addClass("city-uv-index");
        cityUVindex.text("UV Index: ");

        let UVIndexText = $("<span>");
        UVIndexText.text(UVindexResponse.value);

        cityUVindex.append(UVIndexText);

        // The if condition to decide which color to give to the uv value text background.
        // Get the uv index measurment from: https://en.wikipedia.org/wiki/Ultraviolet_index
        if (UVindexResponse.value <= 2) {
            UVIndexText.css({"background": "green", "color": "white", "padding" : "5px"});
        }
        else if (UVindexResponse.value == 3 && UVindexResponse.value <= 5) {
            UVIndexText.css({"background": "yellow", "color": "white", "padding" : "5px"});
        }
        else if (UVindexResponse.value == 6 && UVindexResponse.value <= 7) {
            UVIndexText.css({"background": "orange", "color": "white", "padding" : "5px"});
        }    
        else if (UVindexResponse.value == 8 && UVindexResponse.value <= 10) {
            UVIndexText.css({"background": "red", "color": "white", "padding" : "5px"});
        }
        else {
            UVIndexText.css({"background": "violet", "color": "white", "padding" : "5px"});
        }

        // Append the UV Index value to the city weather description box
        $("#city-weather").append(cityUVindex);


    });
};

// Function to get the five day forecast
function getFiveDayForecast(city) {

    // Empty the card
    $("#forecast-cards-1").empty();
    $("#forecast-cards-2").empty();
    $("#forecast-cards-3").empty();
    $("#forecast-cards-4").empty();
    $("#forecast-cards-5").empty();

    // The URL API to get the 5 day forecast
    let fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + myAPIkey;

    // Create an AJAX call to retrive the five day forecast data
    $.ajax({
        url: fiveDayForecastUrl,
        method: "GET"
    }).then(function(forecastResponse) {

        console.log(forecastResponse);

        // Get the date from the API
        let getForecastDay1Date = forecastResponse.list[0].dt_txt;
        let getForecastDay2Date = forecastResponse.list[8].dt_txt;
        let getForecastDay3Date = forecastResponse.list[16].dt_txt;
        let getForecastDay4Date = forecastResponse.list[24].dt_txt;
        let getForecastDay5Date = forecastResponse.list[32].dt_txt;

        // Day 1 forecast
        let forecastDay1Date = $("<h4>");
        forecastDay1Date.text(getForecastDay1Date.substring(0, 10));
        let forecastIcon1 = $("<img>");
        forecastIcon1.attr("src", "https://openweathermap.org/img/w/" + forecastResponse.list[1].weather[0].icon + ".png");
        let forecastTemp1 = $("<p>");
        forecastTemp1.text("Temp: " + Math.floor((forecastResponse.list[1].main.temp - 273.15) * 1.80 + 32) + " °F");
        let forecastHumidity1 = $("<p>");
        forecastHumidity1.text("Humidity: " + forecastResponse.list[1].main.humidity + "%");

        // Day 2 forecast
        let forecastDay2Date = $("<h4>");
        forecastDay2Date.text(getForecastDay2Date.substring(0, 10));
        let forecastIcon2 = $("<img>");
        forecastIcon2.attr("src", "https://openweathermap.org/img/w/" + forecastResponse.list[4].weather[0].icon + ".png");
        let forecastTemp2 = $("<p>");
        forecastTemp2.text("Temp: " + Math.floor((forecastResponse.list[4].main.temp - 273.15) * 1.80 + 32) + " °F");
        let forecastHumidity2 = $("<p>");
        forecastHumidity2.text("Humidity: " + forecastResponse.list[4].main.humidity + "%");

        // Day 3 forecast
        let forecastDay3Date = $("<h4>");
        forecastDay3Date.text(getForecastDay3Date.substring(0, 10));
        let forecastIcon3 = $("<img>");
        forecastIcon3.attr("src", "https://openweathermap.org/img/w/" + forecastResponse.list[12].weather[0].icon + ".png");
        let forecastTemp3 = $("<p>");
        forecastTemp3.text("Temp: " + Math.floor((forecastResponse.list[12].main.temp - 273.15) * 1.80 + 32) + " °F");
        let forecastHumidity3 = $("<p>");
        forecastHumidity3.text("Humidity: " + forecastResponse.list[12].main.humidity + "%");

        // Day 4 forecast
        let forecastDay4Date = $("<h4>");
        forecastDay4Date.text(getForecastDay4Date.substring(0, 10));
        let forecastIcon4 = $("<img>");
        forecastIcon4.attr("src", "https://openweathermap.org/img/w/" + forecastResponse.list[20].weather[0].icon + ".png");
        let forecastTemp4 = $("<p>");
        forecastTemp4.text("Temp: " + Math.floor((forecastResponse.list[20].main.temp - 273.15) * 1.80 + 32) + " °F");
        let forecastHumidity4 = $("<p>");
        forecastHumidity4.text("Humidity: " + forecastResponse.list[20].main.humidity + "%");

        // Day 5 forecast
        let forecastDay5Date = $("<h4>");
        forecastDay5Date.text(getForecastDay5Date.substring(0, 10));
        let forecastIcon5 = $("<img>");
        forecastIcon5.attr("src", "https://openweathermap.org/img/w/" + forecastResponse.list[28].weather[0].icon + ".png");
        let forecastTemp5 = $("<p>");
        forecastTemp5.text("Temp: " + Math.floor((forecastResponse.list[28].main.temp - 273.15) * 1.80 + 32) + " °F");
        let forecastHumidity5 = $("<p>");
        forecastHumidity5.text("Humidity: " + forecastResponse.list[28].main.humidity + "%");

        // Append all the elements to the cards
        $("#forecast-cards-1").append(forecastDay1Date, forecastIcon1, forecastTemp1, forecastHumidity1);
        $("#forecast-cards-2").append(forecastDay2Date, forecastIcon2, forecastTemp2, forecastHumidity2);
        $("#forecast-cards-3").append(forecastDay3Date, forecastIcon3, forecastTemp3, forecastHumidity3);
        $("#forecast-cards-4").append(forecastDay4Date, forecastIcon4, forecastTemp4, forecastHumidity4);
        $("#forecast-cards-5").append(forecastDay5Date, forecastIcon5, forecastTemp5, forecastHumidity5);
    });
}};

// function to save the city that the user want to search 
function saveCitySearch() {

    // Empty the search history
    $("#city-list").empty();

    // Create a button list with the name of the city that the user input
    // Looping through the city search history array and get the city search history
    for (let i=0; i < citySearchHistory.length; i++) {

        let cityList = $("#city-list");
        let city = $("<a>");
        city.addClass("list-group-item list-group-item-action city");
        city.text(citySearchHistory[i]);

        cityList.append(city);
    };

    // if the city button click then get the weather description and five day forecast 
    // from the city that clicked
    $(".city").on("click", function() {
        getCityWeatherDescription($(this).text());
    });
};

// Function to get the search history item from the local storage
function getCitySearch() {
    
    let storedCitySearched = JSON.parse(localStorage.getItem("citySearchedHistory"));

    // if stored city search from local storage null then city search will be the same as the one in the array
    if (storedCitySearched !== null) {
        citySearchHistory = storedCitySearched;
    }

    saveCitySearch();
};