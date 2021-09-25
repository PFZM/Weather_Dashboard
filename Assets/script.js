const currentDate = document.querySelector("#date");
const searchBtn = document.querySelector("#search-button");
const cityInput = document.querySelector("#city");

const APIKey = "fc1547c6c6eac0f4c70827baceb61b94";
let city;

// function to display current date
function displayDate() {
  const date = moment().format("dddd, DD-MMM-YYYY");
  currentDate.textContent = date;
}
setInterval(displayDate, 1000);

searchBtn.addEventListener("click", searchCity);

function searchCity(event) {
  event.preventDefault();

  if (!cityInput.value) {
    window.alert("Please enter a city name");
    return;
  }

  city = cityInput.value;
  console.log(city);

  retrieveWeather(city);
}

function retrieveWeather(city) {
  const queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText + "\nPlease check the city name");
      }
      response.json().then(function (data) {
        console.log(data);
      });
      console.log(response);
    })
    .catch(function (error) {
      alert("Unable to retrieve data");
    });
}
