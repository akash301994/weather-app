const APIKey = "3486c501a31f92ae09c119b5ee7fae0e";

const form = document.getElementById("form");
const queryInput = document.getElementById("query");
const errorContainer = document.querySelector(".error-container");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = queryInput.value.trim();

  if (city) {
    getWeatherForecast(city);
  }
});

function getWeatherForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      errorContainer.innerHTML =
        "City not found, please enter just a city name!";
    });
}

function displayForecast(data) {
  console.log(data);
  const currentDayContainer = document.querySelector(".current-day-box");
  const currentTemperature = data.list[0].main.temp;
  const currentWindSpeed = data.list[0].wind.speed;
  const currentHumidity = data.list[0].main.humidity;


  currentDayContainer.innerHTML = `
        <img src = 'https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png' alt = 'weather icon'/>
        <p>Date: ${new Date(data.list[0].dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${currentTemperature}°F</p> 
        <p>Wind Speed: ${currentWindSpeed} m/s</p>
        <p>Humidity: ${currentHumidity}%</p>
        
        
    `;

  const forecastBoxes = document.querySelectorAll(".forecast-box");
  for (let i = 0; i < forecastBoxes.length; i++) {
    const date = new Date(data.list[i * 8].dt * 1000);
    const dateString = date.toLocaleDateString();
    const temperature = data.list[i * 8].main.temp;
    const windSpeed = data.list[i * 8].wind.speed;
    const humidity = data.list[i * 8].main.humidity;

    forecastBoxes[i].innerHTML = `
            <img src = 'https://openweathermap.org/img/wn/${data.list[i*8].weather[0].icon}.png' alt = 'weather icon'/>
            <p>Date: ${dateString}</p>
            <p>Temperature: ${temperature}°F</p> 
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>  
        `;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".search-container");
  const queryInput = document.getElementById("query");
  const pastSearchesContainer = document.querySelector(
    ".past-searches-container"
  );
  const clearStorageButton = document.getElementById("clear-storage-button");

  clearStorageButton.addEventListener("click", function () {
    localStorage.removeItem("pastSearches");

    pastSearchesContainer.innerHTML = "<h2>Past Searches</h2>";
  });

  // click event listener to the past searches container
  pastSearchesContainer.addEventListener("click", function (event) {
    if (event.target.tagName === "P") {
      const city = event.target.textContent;
      queryInput.value = city;
      getWeatherForecast(city);
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = queryInput.value.trim();

    if (city) {
      saveSearchToLocalStorage(city);
      getWeatherForecast(city);
    }
  });

  function saveSearchToLocalStorage(city) {
    // Get existing searches from local storage (if any)
    const existingSearches =
      JSON.parse(localStorage.getItem("pastSearches")) || [];

    existingSearches.push(city);
    localStorage.setItem("pastSearches", JSON.stringify(existingSearches));

    displayPastSearches(existingSearches);
  }

  function displayPastSearches(searches) {
    pastSearchesContainer.innerHTML = "<h2>Past Searches</h2>";

    searches.forEach((search) => {
      const searchItem = document.createElement("p");
      searchItem.textContent = search;
      pastSearchesContainer.appendChild(searchItem);
    });
  }
});
