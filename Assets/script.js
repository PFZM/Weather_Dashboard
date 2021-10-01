const currentDate = document.querySelector("#date");
const searchBtn = document.querySelector("#search-button");
const cityInput = document.querySelector("#city");
const actualWeather = document.querySelector("#actual-weather");
const actualCityDate = document.querySelector("#city-date");
const actualTemp = document.querySelector("#actual-temp");
const actualWind = document.querySelector("#actual-wind");
const actualHumid = document.querySelector("#actual-humidity");
const actualUV = document.querySelector("#actual-UVindex");
const searchedCities = document.querySelector("#storage-cities");
const forecastDis = document.querySelector("#forecast");
const titleFor = document.querySelector("#title-forecast");

const APIKey = "fc1547c6c6eac0f4c70827baceb61b94";

function getCitiesFromLocalStorage() {
  return JSON.parse(localStorage.getItem("cities")) || [];
}

function setCitiesInLocalStorage(cities) {
  localStorage.setItem("cities", JSON.stringify(cities));
}

// function to display current date
function displayDate() {
  const date = moment().format("dddd, DD-MMM-YYYY");
  currentDate.textContent = date;
}
setInterval(displayDate, 1000);

// Event listeners
searchBtn.addEventListener("click", searchCity);

// Function to retrieve the city from the form and call back for retrieve the weather
function searchCity(event) {
  event.preventDefault();

  if (!cityInput.value) {
    window.alert("Please enter a city name");
    return;
  }

  retrieveWeather(cityInput.value, true);
}

// Check if the city that was searched is already in local storage.
function isCityInLocalStorage(city) {
  const citiesInLocalStorage = getCitiesFromLocalStorage();

  for (let i = 0; i < citiesInLocalStorage.length; i++) {
    if (city.toLowerCase() === citiesInLocalStorage[i].toLowerCase()) {
      return true;
    }
  }
  return false;
}
// Fetch to weather API to retrieve information for the city
function retrieveWeather(city, createBtn) {
  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=metric" +
    "&appid=" +
    APIKey;

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText + "\nPlease check the city name");
        return;
      }
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);

      // check if city is already in localstorage, is yes we should not store
      if (isCityInLocalStorage(city)) {
        return;
      }
      if (createBtn) {
        storageCities(data);
      }
    })
    .catch(function (error) {
      alert("Unable to retrieve data");
    });
}

// Display current weather
function displayWeather(data) {
  actualWeather.className = "current-weather";

  const cityDate = data.name + " (" + moment().format("DD-MM-YYYY") + ") ";
  const iconWeatherUrl =
    "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";

  const iconWeather = document.createElement("img");
  iconWeather.className = "icon-image";
  iconWeather.src = iconWeatherUrl;
  actualCityDate.textContent = cityDate;
  actualCityDate.appendChild(iconWeather);

  const currentTemp = data.main.temp;
  actualTemp.textContent = "Temp: " + currentTemp + " °C";

  const currentWind = data.wind.speed;
  actualWind.textContent = "Wind: " + currentWind + " Km/h";

  const currentHumidity = data.main.humidity;
  actualHumid.textContent = "Humidity: " + currentHumidity + " %";

  const oneCallUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    data.coord.lat +
    "&lon=" +
    data.coord.lon +
    "&exclude=minutely,hourly,alerts&units=metric&appid=" +
    APIKey;

  fetch(oneCallUrl)
    .then(function (response) {
      if (!response.ok) {
        alert("Error: " + response.statusText);
        return;
      }
      return response.json();
    })
    .then(function (dataOne) {
      const currentUvIndex = dataOne.current.uvi;
      actualUV.textContent = "UV Index: ";

      const numberUV = document.createElement("span");

      numberUV.textContent = currentUvIndex;

      if (currentUvIndex < 2) {
        numberUV.className = "favorable";
      }
      if (3 < currentUvIndex < 7) {
        numberUV.className = "moderate";
      }
      if (currentUvIndex > 8) {
        numberUV.className = "severe";
      }

      actualUV.appendChild(numberUV);

      fiveDayFor(dataOne);
    })
    .catch(function (error) {
      alert("Unable to retrieve data");
    });
}

function fiveDayFor(dataOne) {
  titleFor.style.display = "block";

  forecastDis.innerHTML = "";

  for (let day = 1; day < 6; day++) {
    const dayForecast = document.createElement("div");
    dayForecast.className = "day";

    const dateForecast = document.createElement("h3");
    dayForecast.textContent = moment().add(day, "days").format("DD-MM-YYYY");
    dayForecast.appendChild(dateForecast);

    const iconForeWeatherUrl =
      "https://openweathermap.org/img/wn/" +
      dataOne.daily[day].weather[0].icon +
      "@2x.png";

    const iconForecast = document.createElement("img");
    iconForecast.className = "icon-forecast-image";
    iconForecast.src = iconForeWeatherUrl;
    dayForecast.appendChild(iconForecast);

    const tempForecast = document.createElement("p");
    tempForecast.textContent = "Temp: " + dataOne.daily[day].temp.max + " °C";
    dayForecast.appendChild(tempForecast);

    const windForecast = document.createElement("p");
    windForecast.textContent =
      "Wind: " + dataOne.daily[day].wind_speed + " Km/h";
    dayForecast.appendChild(windForecast);

    const humidityForecast = document.createElement("p");
    humidityForecast.textContent =
      "Humidity: " + dataOne.daily[day].humidity + "%";
    dayForecast.appendChild(humidityForecast);

    forecastDis.appendChild(dayForecast);
  }
}

// Store the searched city in local storage and add button for searched cities section
function storageCities(data) {
  const listOfCities = getCitiesFromLocalStorage();
  listOfCities.unshift(data.name);
  setCitiesInLocalStorage(listOfCities);
  const cityBt = document.createElement("button");
  cityBt.className = "btn-cities";
  cityBt.textContent = listOfCities[0];
  cityBt.onclick = function () {
    retrieveWeather(data.name, false);
  };
  searchedCities.prepend(cityBt);
}

// Retrieve information from local storage when refreshing the browser to the last search.
function displayStgCities() {
  const cities = getCitiesFromLocalStorage();

  for (let i = 0; i < cities.length; i++) {
    const cityBt = document.createElement("button");
    cityBt.className = "btn-cities";
    cityBt.textContent = cities[i];
    cityBt.onclick = function () {
      retrieveWeather(cities[i], false);
    };
    searchedCities.appendChild(cityBt);
  }

  if (cities.length !== 0) {
    retrieveWeather(cities[0], false);
  }
}
displayStgCities();
