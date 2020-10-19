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

var q = '';

var API_KEY = 'f5e25466bfa1e46ad656169c960527a3';

function currentLocation() {
  $.ajax({
      url: "https://freegeoip.app/json/",
      method: "GET",
  }).then(function (response) {
      queryResult = response.city || 'exton';
      console.log(queryResult);

      renderWeather(q);
  });
};

function renderWeather(q) {
  $("#search-button").on('click', function() {
    q = $("#search-input").val();
  })

  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
  q +
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
    var cityNameList = $("<button id='searchHistory'>").text(response.name);

    localStorage.setItem("city", JSON.stringify(city));

    cityNameList.addClass("list-group-item list-group-item-action");

    var weatherIcon = $("<img>").attr(
      "src",
      "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
    );
  })
}
