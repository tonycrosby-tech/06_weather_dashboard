// display time
function display_c() {
  var refresh = 1000; // Refresh rate in milli seconds
  mytime = setTimeout("display_ct()", refresh);
}

// function to create the time
function display_ct() {
  var x = new Date();
  document.getElementById("ct").innerHTML = x;
  display_c();
}

$(document).ready(function() {
    // my unique api key
  var API_KEY = "f5e25466bfa1e46ad656169c960527a3";

  // search button
  var searchBtn = $("#search");

  // city input
  var cityInput = $("#city");

  // adding recent searched cities to this
  var searchHistoryDiv = $("#searchHistory");

  // empty array for searched cities
  var searchArray = [];

  // get the input value as text
  var searchCity = cityInput.val();

  // storing items in localstorage
  var searchStorage = JSON.parse(localStorage.getItem("city"));

  appendStorage();

  // This function appends the stored search history items to the searchHistory div
  function appendStorage() {
    if (searchStorage === null) {
      searchArray = [];
    } else {
      for (var i = 0; i < searchStorage.length; i++) {
        var storedHistoryItem = $("<button>");
        storedHistoryItem.text(searchStorage[i]);
        storedHistoryItem.attr("class", "list-group-item-action");
        searchHistoryDiv.append(storedHistoryItem);
        searchArray = searchStorage;
      }
    }
  }

  init();

  // call from localstorage if last stored city was in localstorage then it is loaded on page
  function init() {
    
      if (searchStorage !== null) {
        searchArray = searchStorage;
      }

      if (localStorage.getItem("city")) {
        searchArray === [];
      } else {
        console.log("no data in localstorage");
        searchArray === [];
      }
  }

  // This function creates a button that appends to the search history
  function createSearchHistory() {
    if (searchCity !== "") {
      var searchHistoryItem = $("<button>");
      searchHistoryItem.text(searchCity);
      searchHistoryItem.attr("class", "mt-2 list-group-item-action");
      searchHistoryDiv.append(searchHistoryItem);
      searchArray.push(searchCity);
      localStorage.setItem("city", JSON.stringify(searchArray));
      cityInput.val("");
    }
  }

  // on click i want to render the weather data for the searched city
  searchBtn.on("click", function (event) {
    event.preventDefault();
    searchCity = cityInput.val();
    renderWeather();
    createSearchHistory();
  });

  // on click i want to render the weather data and create a button that i can click to move back and forth displaying each city
  searchHistoryDiv.on("click", ".list-group-item-action", function (event) {
    searchCity = event.target.textContent;
    renderWeather();
  });

  // this function has the current weather the UVI and the forecast
  function renderWeather() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchCity +
      "&appid=" +
      API_KEY;
    // if no error this is hidden
    $(".form-errors").text("Please enter an actual City").hide();
    // ajax call
    $.ajax({
      url: queryURL,
      method: "GET",
      error: (err) => {
        //If API throws error then output
        $(".form-errors").text("Please enter an actual City").show();
        return;
      },
    }).then(function (response) {
      var cityNameInput = $("<h2 class='text-center'>").text(response.name);

      // function createCityList() {
      //   var cityNameList = $(`<button class='history'>${city}</button>`).text(
      //     response.name
      //   );

      //   var cities = $("#search-input").val();

      //   if (localStorage.getItem("city") === null) {

      //   } else {

      //   }

      //   console.log(cities);

      //   cityNameList.addClass("list-group-item-action");

      //   $("#searchHistory").append(cityNameList);
      // }
      // createCityList();

      // picture of how the weather is
      var weatherIcon = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
      );

      // tells what the weather type is
      var weatherType = $("<p>").text(response.weather[0].main);

      // gets the weather temperature
      var tempInt = parseInt(response.main.temp);

      // temperature to farenheit
      var tempF = (tempInt * 9) / 5 - 459.67;

      // makes it so temperature is rounded up or shown as a whole number
      var cityTemp = $("<p>").text(
        "Current Temperature: " + Math.floor(tempF) + " °F"
      );

      // outputs the humidity in %
      var cityHumidity = $("<p>").text(
        "Humidity: " + response.main.humidity + "%"
      );

      // outputs the wind speed in mph
      var cityWindSpeed = $("<p>").text(
        "Wind Speed: " + Math.round(response.wind.speed) + " MPH"
      );
      
      $("#cityList").empty();
      // appends everything to output the weather information
      $("#cityList").append(
        cityNameInput,
        weatherIcon,
        weatherType,
        cityTemp,
        cityHumidity,
        cityWindSpeed
      );
      
      // latitude uvi position
      var latitude = response.coord.lat;

      // longitude uvi position
      var longitude = response.coord.lon;

      // uvi queryURL to display uvi data
      var queryURLuvi =
        "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=f5e25466bfa1e46ad656169c960527a3&q=" +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      // ajax call for UVI
      $.ajax({
        url: queryURLuvi,
        method: "GET",
      }).then(function (response) {
        // gets the UVI
        var uvIndex = response[0].value;

        // empty color display
        var uvColor = "";

        // if its less then three then highlight green
        if (uvIndex < 3) {
          uvColor = "green";

          // if its less then 6 then highlight yellow
        } else if (uvIndex < 6) {
          uvColor = "yellow";

          // if its less then 8 then highlight orange
        } else if (uvIndex < 8) {
          uvColor = "orange";

          // if its less then 11 then highlight red
        } else if (uvIndex < 11) {
          uvColor = "red";

          // if its anything else then highlight violet
        } else {
          uvColor = "violet";
        }

        // gets the UV Index
        var cityUVIndex = $(
          "<span class='border d-inline-block rounded px-2 py-1 mb-4'>"
        ).text("UV Index: " + uvIndex);
        // highlights the appropiate color
        $(cityUVIndex).attr("style", "background-color: " + uvColor);

        // displays in the city box
        $("#cityList").append(cityUVIndex);

        // 5 day forecast
        var queryURLforecast =
          "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=f5e25466bfa1e46ad656169c960527a3&q=" +
          searchCity;

        // ajax call to get 5 day forecast at 3pm everyday
        $.ajax({
          url: queryURLforecast,
          method: "GET",
          // Store all of the data inside of an object called forecast
        }).then(function (forecast) {
          // log forecast in the console
          console.log(forecast);

          // gets the day of the forecast
          var nowMoment = moment();

          // Loop through the forecast array and display a single forecast for 5 days
          for (var i = 6; i < forecast.list.length; i += 8) {
            // creating an h5 to put the date in
            var forecastDate = $("<h5>");

            // this is the day in the array
            var forecastDay = (i + 2) / 8;

            // empty the box that displays the forecast
            $("#forecast-date" + forecastDay).empty();

            // displays the date and add 1 day to display 5 days
            $("#forecast-date" + forecastDay).append(
              forecastDate.text(nowMoment.add(1, "days").format("dddd, M/D/YY"))
            );

            // create an img for the forecast
            var forecastIcon = $("<img>");

            // gets the icon from the DOM
            forecastIcon.attr(
              "src",
              "https://openweathermap.org/img/w/" +
                forecast.list[i].weather[0].icon +
                ".png"
            );

            // empty the current icon
            $("#forecast-icon" + forecastDay).empty();

            // gets the new icon then displays it
            $("#forecast-icon" + forecastDay).append(forecastIcon);

            // gets the temperature and displays it
            $("#forecast-temp" + forecastDay).text(
              "Temp: " + Math.round(forecast.list[i].main.temp) + " °F"
            );

            // gets the humidity and displays it
            $("#forecast-humidity" + forecastDay).text(
              "Humidity: " + forecast.list[i].main.humidity + "%"
            );
          }
        });
      });
    });
  }
})

