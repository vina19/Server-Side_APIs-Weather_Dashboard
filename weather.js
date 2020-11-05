$(document).ready(function() {
    

    // Function that will run after the search button clicked
    $("#search-btn").on("click", function() {

        // OpenWeather API key
        let myAPIkey = "0906529f0e63b6d51e5251dfa653e405";

        // Get the search city input from the user
        let city = $("#city-search").val();
        console.log(city);

        // URL where the data is from
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + myAPIkey;

        // Create an AJAX call to retrieve the data from OpenWeather API by the city
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);

            let cityDescription = $(".city-weather");
            let cityTitleEl = $("<h2>");
            cityTitleEl.text(response.name);

            cityDescription.append(cityTitleEl);
        });
    });
});


    
