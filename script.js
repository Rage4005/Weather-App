document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '8021a4ce86cb0532a7078e54878fcabd'; // Replace with your OpenWeatherMap API key

    const loadingElement = document.getElementById('loading');
    const weatherResultElement = document.getElementById('weatherResult');
    const forecastResultElement = document.getElementById('forecastResult');
    const searchHistoryListElement = document.getElementById('searchHistoryList');

    // Show loading indicator
    loadingElement.style.display = 'block';
    weatherResultElement.innerHTML = '';
    forecastResultElement.innerHTML = '';

    // Fetch current weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            loadingElement.style.display = 'none';

            if (data.cod === 200) {
                weatherResultElement.innerHTML = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;

                // Store search in local storage
                let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
                if (!searches.includes(city)) {
                    searches.push(city);
                    localStorage.setItem('searchHistory', JSON.stringify(searches));
                    updateSearchHistory();
                }
            } else {
                weatherResultElement.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            // Hide loading indicator
            loadingElement.style.display = 'none';

            weatherResultElement.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
        });

    // Fetch 5-day forecast data
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                const forecastItems = data.list.filter(item => item.dt_txt.includes("12:00:00"));
                forecastItems.forEach(item => {
                    const date = new Date(item.dt_txt).toLocaleDateString();
                    forecastResultElement.innerHTML += `
                        <div class="forecast-item">
                            <h3>${date}</h3>
                            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
                            <p>Temp: ${item.main.temp}°C</p>
                            <p>${item.weather[0].description}</p>
                        </div>
                    `;
                });
            } else {
                forecastResultElement.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(error => {
            forecastResultElement.innerHTML = `<p>Error fetching forecast data: ${error.message}</p>`;
        });
});

// Function to update search history display
function updateSearchHistory() {
    const searchHistoryListElement = document.getElementById('searchHistoryList');
    const searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryListElement.innerHTML = '';
    searches.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => {
            document.getElementById('cityInput').value = city;
            document.getElementById('searchBtn').click();
        });
        searchHistoryListElement.appendChild(li);
    });
}

// Toggle search history display
document.getElementById('hamburger').addEventListener('click', function() {
    const searchHistoryElement = document.getElementById('searchHistory');
    if (searchHistoryElement.style.display === 'block') {
        searchHistoryElement.style.display = 'none';
    } else {
        searchHistoryElement.style.display = 'block';
    }
});

// Load search history on page load
document.addEventListener('DOMContentLoaded', updateSearchHistory);