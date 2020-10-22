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