// display time
function display_c() {
  var refresh = 1000; // Refresh rate in milli seconds
  mytime = setTimeout("display_ct()", refresh);
}

// function to create the time
function display_ct() {
  var x = new Date();
  document.getElementById('ct').innerHTML = x;
  display_c();
}

var API_KEY = 'f5e25466bfa1e46ad656169c960527a3';

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

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  API_KEY;

  $.ajax({
    url: queryURL,
    method: "GET",
    error: (err => { //If API through error then say
      $(".form-errors").text("Please enter an actual City").show();
      return;
      })
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
        $(cityUVIndex).attr("style", "width:8%; background-color: " + uvColor);

        // displays in the city box
        $("#cityList").append(cityUVIndex);
      });
    })
  })
}

$(document).ready(function() {
  renderWeather();
});
