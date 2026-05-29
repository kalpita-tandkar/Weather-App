const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const weatherDiv = document.getElementById("weather");
const errorDiv = document.getElementById("error");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});
function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "⛅";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 99) return "⛈️";
  return "🌍";
}

async function getWeather() {

  const city = cityInput.value;

  weatherDiv.innerHTML = "";
  errorDiv.innerHTML = "";

  if (!city) {
    errorDiv.innerHTML = "Please enter city name";
    return;
  }

  try {

    weatherDiv.innerHTML = "Loading...";

    // 🌍 Geocoding API
    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      weatherDiv.innerHTML = "";
      errorDiv.innerHTML = "City not found";
      return;
    }

    const place = geoData.results[0];

    const latitude = place.latitude;
    const longitude = place.longitude;

    // 🌦️ Weather API
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;

    const temperature = current.temperature;
    const windspeed = current.windspeed;
    const weathercode = current.weathercode;

    const icon = getWeatherIcon(weathercode);

    // 🖥️ UI Output
    weatherDiv.innerHTML = `
      <div class="weather-box">

        <div class="icon">${icon}</div>

        <h2>${place.name}, ${place.country}</h2>

        <div class="temp">${temperature}°C</div>

        <div class="info">

          <div class="card">
            🌬️ Wind: ${windspeed} km/h
          </div>

          <div class="card">
            📍 Latitude: ${latitude}
          </div>

          <div class="card">
            📍 Longitude: ${longitude}
          </div>

        </div>

      </div>
    `;

  } catch (error) {
    weatherDiv.innerHTML = "";
    errorDiv.innerHTML = "Something went wrong";
  }
}