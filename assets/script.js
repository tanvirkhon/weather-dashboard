/************************************************
 Variables 
************************************************/
// API KEY
const weatherAPIKey = "b0b7a5a79a5ad7d55256e7b7b3a2f6ea";

// City Forecast section
let currentCityForecast = document.getElementById("city-forecast");
// City Five Day
let futureCityForecast = document.getElementById("future-forecast");
// Geo Location required variables
let city;
// Input field
let inputField = document.getElementById("input-field");
// Button
const findCityBtn = document.getElementById("search-button");

// Save Cities
const saveCities = [];
const getSavedCities = JSON.parse(localStorage.getItem("savedCities"));
let searchHistory = document.getElementById("search-history");

/************************************************
Function
************************************************/
for (let i = 0; i < getSavedCities.length; i++) {
  console.log(getSavedCities);

  let cityHistory = document.createElement("button");
  cityHistory.append(getSavedCities[i]);
  cityHistory.classList =
    "flex px-6 py-2 border-4 border-white text-white font-medium text-s leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-full";
  searchHistory.appendChild(cityHistory);
}

// List cities already in local storage

function getLocation(event) {
  event.preventDefault();

  // Clear city weather forecast
  futureCityForecast.innerHTML = "";
  currentCityForecast.innerHTML = "";

  let longitude;
  let latitude;

  if (!inputField.value) {
    alert("Please Enter City Name");
  }

  city = inputField.value;

  if (!saveCities.includes(city)) {
    // Push city to saved city array
    saveCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(saveCities));
  }

  // Geo Location URL Call
  let geoLocationAPICall =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city.trim() +
    "&appid=" +
    weatherAPIKey;

  //Fetch Call
  fetch(geoLocationAPICall)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      longitude = data[0].lon;
      latitude = data[0].lat;

      let queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        weatherAPIKey +
        "&units=imperial";

      // Fetch Call for Location API
      fetch(queryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          city = data.city.name;

          cityTemp = data.list[0].main.temp;
          cityWind = data.list[0].wind.speed;
          cityHumidity = data.list[0].main.humidity;

          // Open Weather Icon ID
          cityWeatherIconID = data.list[0].weather[0].icon;
          openWeatherIconURL =
            "http://openweathermap.org/img/w/" + cityWeatherIconID + ".png";

          //Create Div Container
          let cityInfoDiv = document.createElement("div");
          cityInfoDiv.classList =
            "flex-row space-x-4 rounded-lg shadow-lg bg-white justify-between";

          currentCityForecast.appendChild(cityInfoDiv);

          // Create City Title
          let cityNameTitle = document.createElement("h2");
          cityNameTitle.classList = "text-5xl font-bold mt-4 mb-6";
          cityNameTitle.append(city);
          cityInfoDiv.appendChild(cityNameTitle);

          // Add icon to city
          let iconImg = document.createElement("img");
          iconImg.setAttribute("src", openWeatherIconURL);
          cityInfoDiv.appendChild(iconImg);

          // Create "<p>" for City Temperature
          let cityTempParagraph = document.createElement("p");
          cityTempParagraph.append("Temp: " + cityTemp + " ℉");
          cityInfoDiv.appendChild(cityTempParagraph);

          // Create "<p>" for City wind conditions
          let cityWindParagraph = document.createElement("p");
          cityWindParagraph.append("Wind: " + cityWind + " MPH");
          cityInfoDiv.appendChild(cityWindParagraph);

          // Create "<p>" for City Temperature
          let cityHumParagraph = document.createElement("p");
          cityHumParagraph.append("Humidity: " + cityHumidity + " %");
          cityInfoDiv.appendChild(cityHumParagraph);

          // Forecast 5 Day API Call
          for (let i = 0; i < data.list.length; i += 8) {
            // Open Weather Icon ID
            forecastIconID = data.list[i].weather[0].icon;
            IconURL =
              "http://openweathermap.org/img/w/" + forecastIconID + ".png";

            let cityForecastDiv = document.createElement("div");
            // cityForecastDiv.classList = "flex flex-wrap";
            futureCityForecast.appendChild(cityForecastDiv);

            // Add icon to city
            let forecastIconImg = document.createElement("img");
            forecastIconImg.setAttribute("src", IconURL);
            cityForecastDiv.appendChild(forecastIconImg);

            let forecastTemp = document.createElement("p");
            forecastTemp.append("Temp: " + data.list[i].main.temp + " ℉");
            cityForecastDiv.appendChild(forecastTemp);

            let cityWindForecast = document.createElement("p");
            cityWindForecast.append(
              "Wind: " + data.list[i].wind.speed + " MPH"
            );
            cityForecastDiv.appendChild(cityWindForecast);

            let cityHumForecast = document.createElement("p");
            cityHumForecast.append("Humidity: " + cityHumidity + " %");
            cityForecastDiv.appendChild(cityHumForecast);
          }

          return;
        });
    });
}

/************************************************
Event Listeners
************************************************/

// Get city input
findCityBtn.addEventListener("click", getLocation);
