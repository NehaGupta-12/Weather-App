const apiKey = "2c04e27ec189fdc815d314e5d48781ba";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
    const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
    const googleApiKey = "AIzaSyCH5Af2wrzkkaEtQxM-EiEVzdfQWeq6eh8";
    const googleMapUrl = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;

    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const weatherIcon = document.querySelector(".weather-icon");
    const mapElement = document.getElementById('map');

    async function checkWeather(city) {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);

        if (response.status == 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            document.querySelector(".forecast").style.display = "none";
        } else {
            var data = await response.json();
            var forecastData = await forecastResponse.json();

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

            if (data.weather[0].main == "Clouds") {
                weatherIcon.src = "images/clouds.png";
            } else if (data.weather[0].main == "Clear") {
                weatherIcon.src = "images/clear.png";
            } else if (data.weather[0].main == "Rain") {
                weatherIcon.src = "images/rain.png";
            } else if (data.weather[0].main == "Drizzle") {
                weatherIcon.src = "images/drizzle.png";
            } else if (data.weather[0].main == "Mist") {
                weatherIcon.src = "images/mist.png";
            }
            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";

            const dateElement = document.querySelector(".date");
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.innerHTML = now.toLocaleDateString('en-US', options);

            // Update the map marker position
            const position = { lat: data.coord.lat, lng: data.coord.lon };

            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: position,
                mapId: "DEMO_MAP_ID",
            });

            const marker = new google.maps.Marker({
                map,
                position: position,
                title: 'Weather Location',
            });

            updateForecast(forecastData);
        }
    }

    function updateForecast(forecastData) {
        const forecastContainer = document.querySelector('.forecast-container');
        forecastContainer.innerHTML = ''; // Clear previous forecast data

        const dailyData = forecastData.list.filter((reading) => reading.dt_txt.includes("12:00:00"));

        dailyData.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('forecast-day');
            dayElement.innerHTML = `
                <h4>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                <img src="images/${day.weather[0].main.toLowerCase()}.png" alt="${day.weather[0].main}">
                <p>${Math.round(day.main.temp)}°c</p>
            `;
            forecastContainer.appendChild(dayElement);
        });

        document.querySelector(".forecast").style.display = "block";
    }

    searchBtn.addEventListener("click", () => {
        checkWeather(searchBox.value)
    });

    window.onload = () => {
        const dateElement = document.querySelector(".date");
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerHTML = now.toLocaleDateString('en-US', options);
    };

    function initMap() {
        const position = { lat: -25.344, lng: 131.031 };

        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 4,
            center: position,
            mapId: "DEMO_MAP_ID",
        });

        const marker = new google.maps.Marker({
            map,
            position: position,
            title: 'Weather Location',
        });
    }

    document.addEventListener('touchstart', function (event) {}, { passive: true });
    document.addEventListener('touchmove', function (event) {}, { passive: true });