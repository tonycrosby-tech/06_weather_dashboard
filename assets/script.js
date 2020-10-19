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

var queryResult = '';

var API_KEY = 'f5e25466bfa1e46ad656169c960527a3';

function currentLocation() {
  $.ajax({
      url: "https://freegeoip.app/json/",
      method: "GET",
  }).then(function (response) {
      queryResult = response.city || 'exton';
      console.log(queryResult);
  });
};