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

var API_KEY = "f5e25466bfa1e46ad656169c960527a3";

// function currentLocation() {
//   $.ajax({
//       url: "https://freegeoip.app/json/",
//       method: "GET",
//   }).then(function (response) {
//       queryResult = response.city || 'exton';
//       console.log(queryResult);

//       renderWeather(q);
//   });
// };

function renderWeather() {
  $("#search-button").on("click", function () {
    var city = $("#search-input").val();

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      API_KEY;

    $.ajax({
      url: queryURL,
      method: "GET",
      error: (err) => {
        //If API through error then say
        $(".form-errors").text("Please enter an actual City").show();
        return;
      },
    }).then(function (response) {
      var cityNameInput = $("<h2>").text(response.name);
      var cityNameList = $("<button>").text(response.name);

      localStorage.setItem("city", JSON.stringify(city));

      cityNameList.addClass("list-group-item list-group-item-action");

      var weatherIcon = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
      );

      var weatherType = $("<p>").text(response.weather[0].main);

      var tempInt = parseInt(response.main.temp);

      var tempF = (tempInt * 9) / 5 - 459.67;

      var cityTemp = $("<p>").text(
        "Current Temperature: " + Math.floor(tempF) + " °F"
      );

      var cityHumidity = $("<p>").text(
        "Humidity: " + response.main.humidity + "%"
      );

      var cityWindSpeed = $("<p>").text(
        "Wind Speed: " + Math.round(response.wind.speed) + " MPH"
      );

      $("#cityList").empty();

      $("#cityList").append(
        cityNameInput,
        weatherIcon,
        weatherType,
        cityTemp,
        cityHumidity,
        cityWindSpeed
      );

      $("#searchHistory").prepend(cityNameList);

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
        var cityUVIndex = $("<p>").text("UV Index: " + uvIndex);

        // highlights the appropiate color
        $(cityUVIndex).attr("style", "width:10%; background-color: " + uvColor);

        // displays in the city box
        $("#cityList").append(cityUVIndex);
      });
    });
  });
}

function fiveDayForecast() {
  $("#search-button").on("click", function () {
    var city = $("#search-input").val();

    // 5 day forecast
    var queryURLforecast =
      "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=f5e25466bfa1e46ad656169c960527a3&q=" +
      city;

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
          forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
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

        // style of the cards
        $(".forecast").attr("style", "background-color:blue; color:white");
      }
    });
  });
}

$(document).ready(function () {
  renderWeather();
  fiveDayForecast();
});
