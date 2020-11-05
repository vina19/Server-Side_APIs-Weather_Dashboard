$(document).ready(function() {
    

    // Function that will run after the search button clicked
    $("#search-btn").on("click", function() {

        // OpenWeather API key
        let myAPIkey = "0906529f0e63b6d51e5251dfa653e405";

        // Get the search city input from the user
        let cityName = $("#city-search").val();

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
            console.log(response);

            getCityWeatherDescription(response);
        });
    });
});

function getCityWeatherDescription(city) {

    //$("#city-weather").empty();

    // Get current date
    let currentDate = moment().format("L");

    // Create elements and add the city weather descriptions to the box
    let cityTitle = $("<h1>");
    cityTitle.addClass("city-title");
    cityTitle.text(city.name + " " + currentDate);

    let cityTemp = $("<p>");
    cityTemp.addClass("city-temp");
    cityTemp.text("Temperature: " + city.main.temp);

    let cityHumidity = $("<p>");
    cityHumidity.addClass("city-humidity");
    cityHumidity.text("Humidity: " + city.main.humidity);

    let cityWindSpeed = $("<p>");
    cityWindSpeed.addClass("city-wind-speed");
    cityWindSpeed.text("Wind Speed: " + city.wind.speed);

    $("#city-weather").append(cityTitle, cityTemp, cityHumidity, cityWindSpeed);
};


    
