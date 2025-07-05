const weatherDataContainer = document.getElementById("weatherDataContainer");
const inputData = document.getElementById("inputData");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");
const API_KEY = "a2691e9bfeeb04ae11e515035abf864f"; // add your API key

// display weather
function renderCity(data) {
  weatherDataContainer.innerHTML = "";
  // current
  const cityDiv = document.createElement("div");
  cityDiv.className = "city-details-container";
  cityDiv.innerHTML = `
    <div class="city-heading-container">
      <h1 class="city-heading">${data.city.name} (${new Date().toLocaleDateString()})</h1>
      <img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" alt="icon"/>
    </div>
    <p>Temp: ${Math.round(data.list[0].main.temp - 273)}°C</p>
    <p>Wind: ${data.list[0].wind.speed} m/s</p>
    <p>Humidity: ${data.list[0].main.humidity}%</p>
  `;
  weatherDataContainer.appendChild(cityDiv);

  // forecast
  const forecastTitle = document.createElement("h3");
  forecastTitle.className = "forecast-heading-element";
  forecastTitle.innerText = "4-Day Forecast";
  weatherDataContainer.appendChild(forecastTitle);

  const forecastWrap = document.createElement("div");
  forecastWrap.className = "forecast-container";
  weatherDataContainer.appendChild(forecastWrap);

  const upcoming = data.list.filter(item =>
    new Date(item.dt_txt).getHours() === 12 &&
    new Date(item.dt_txt).toDateString() !== new Date().toDateString()
  ).slice(0,4);

  upcoming.forEach(day => {
    const div = document.createElement("div");
    div.className = "eachdayForecast";
    div.innerHTML = `
      <h5>${new Date(day.dt_txt).toLocaleDateString()}</h5>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon"/>
      <p>Temp: ${Math.round(day.main.temp - 273)}°C</p>
      <p>Wind: ${day.wind.speed} m/s</p>
      <p>Humidity: ${day.main.humidity}%</p>
    `;
    forecastWrap.appendChild(div);
  });
}

// fetch
async function fetchData(city) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
    const data = await res.json();
    if (data.cod !== "200") throw new Error(data.message);
    renderCity(data);
  } catch (err) {
    weatherDataContainer.innerHTML = `<h3 class="error-message">${err.message}</h3>`;
  }
}

// fetch by geolocation
locationButton.addEventListener("click", () => {
  if (!navigator.geolocation){
    alert("Geolocation unsupported");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const {lat, lon} = pos.coords;
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await res.json();
        renderCity(data);
      } catch {
        weatherDataContainer.innerHTML = `<h3 class="error-message">Unable to fetch location weather.</h3>`;
      }
    },
    () => alert("Unable to access your location")
  );
});

// event listeners
searchButton.addEventListener("click", () => {
  if (inputData.value.trim()) fetchData(inputData.value.trim());
});
inputData.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && inputData.value.trim()) fetchData(inputData.value.trim());
});
