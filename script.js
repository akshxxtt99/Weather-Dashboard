const apiKey = "YOUR_API_KEY";

// Live clock
function updateTime() {
    const todayInfo = document.getElementById("todayInfo");
    const now = new Date();
    todayInfo.innerText =
        now.toDateString() + " • " + now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    if (!city) return alert("Enter a city name");

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod !== "200") {
        alert(data.message);
        return;
    }

    // Hide hero only once
    document.getElementById("heroSection").classList.add("hidden");

    // Show sections
    document.getElementById("currentWeather").classList.remove("hidden");
    document.getElementById("forecast").classList.remove("hidden");

    // Current Weather
    const current = data.list[0];
    document.getElementById("currentWeather").innerHTML = `
        <h2>${data.city.name}</h2>
        <h1>${current.main.temp}°C</h1>
        <p>${current.weather[0].description}</p>
        <p>Humidity: ${current.main.humidity}%</p>
        <p>Wind: ${current.wind.speed} m/s</p>
    `;

    // Clear previous forecast
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    // 7 Days
    const dailyData = data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 7);

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt);
        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h4>${date.toDateString().slice(0,10)}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });

    // Clear input
    document.getElementById("cityInput").value = "";
}