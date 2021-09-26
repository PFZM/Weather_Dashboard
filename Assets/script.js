const currentDate = document.querySelector("#date");
const searchBtn = document.querySelector("#search-button");
const cityInput = document.querySelector("#city");
const actualCityDate = document.querySelector("#city-date");
const actualTemp = document.querySelector("#actual-temp");
const actualWind = document.querySelector("#actual-wind");
const actualHumid = document.querySelector("#actual-humidity");
const actualUV = document.querySelector("#actual-UVindex");
const numberUV = document.querySelector("#UV-number");
const storageCities = document.querySelector("storage-cities");
const forecastDis = document.querySelector("#forecast");

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
    "&units=metric" +
    "&appid=" +
    APIKey;

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText + "\nPlease check the city name");
      }
      response.json().then(function (data) {
        console.log(data);
        displayWeather(data);
      });
    })
    .catch(function (error) {
      alert("Unable to retrieve data");
    });
}

function displayWeather(data) {
  const cityDate = data.name + " (" + moment().format("DD-MM-YYYY") + ") ";
  const iconWeatherUrl =
    "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

  const iconWeather = document.createElement("img");
  iconWeather.className = "icon-image";
  iconWeather.src = iconWeatherUrl;
  actualCityDate.textContent = cityDate;
  actualCityDate.appendChild(iconWeather);

  const currentTemp = data.main.temp;
  actualTemp.textContent = "Temp: " + currentTemp + " C";

  const currentWind = data.wind.speed;
  actualWind.textContent = "Wind: " + currentWind + " Km/h";

  const currentHumidity = data.main.hummidity;
  actualHumid.textContent = "Humidity: " + currentHumidity + " %";

  const oneCallUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    data.coord.lat +
    "&lon=" +
    data.coord.lon +
    "&units=metric&appid=" +
    APIKey;

  fetch(oneCallUrl)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText);
      }
      response.json().then(function (dataOne) {
        console.log(dataOne);
        const currentUvIndex = dataOne.current.uvi;
        actualHumid.textContent = "UV Index: ";

        if (currentUvIndex < 2) {
          numberUV.className = "favorable";
        }
        if (3 < currentUvIndex < 7) {
          numberUV.className = "moderate";
        }
        if (currentUvIndex > 8) {
          numberUV.className = "favorable";
        }

        numberUV.textContent = currentUvIndex;

        for (let i = 0; i < 5; i++) {
          const dayForecast = document.createElement("div");
          forecastDis.appendChild(dayForecast);
          const dateForecast = document.createElement("h3");
          const iconForecast = document.createElement("img");

          const tempForecast = document.createElement("p");
          tempForecast.textContent =
            "Temp: " + dataOne.daily[i++].temp.max + "C";
          console.log(tempForecast);

          const windForecast = document.createElement("p");
          windForecast.textContent =
            "Wind: " + dataOne.daily[i++].wind_speed + "Km/h";
          console.log(windForecast);

          const humidityForecast = document.createElement("p");
          humidityForecast.textContent =
            "Humidity: " + dataOne.daily[i++].humidity + "%";
          console.log(humidityForecast);

          dayForecast.appendChildren(
            dateForecast +
              iconForecast +
              tempForecast +
              windForecast +
              humidityForecast
          );
        }
      });

      forecastDis.textContent = "5 - Day Forecast:";

      //   displayForecast(dataOne);
    })
    .catch(function (error) {
      alert("Unable to retrieve data");
    });

  //   storageCity(city);
}

// function storageCity(city) {}
