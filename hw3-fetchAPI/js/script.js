// ========================================
// HW3: Weather App - Fetch API Study Guide
// CST336 - Will Walter
// ========================================

// API Configuration
const API_KEY = '47f5cb3877364c059a4959f9f8622139'; // OpenWeatherMap API Key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const weatherResult = document.getElementById('weatherResult');

// ========================================
// REQUIREMENT 2: JS VALIDATION for form element
// ========================================
function validateCityInput(city) {
    // Check if empty
    if (!city || city.trim() === '') {
        return {
            valid: false,
            message: '❌ Please enter a city name'
        };
    }
    
    // Check minimum length
    if (city.trim().length < 2) {
        return {
            valid: false,
            message: '❌ City name must be at least 2 characters long'
        };
    }
    
    // Check maximum length
    if (city.trim().length > 50) {
        return {
            valid: false,
            message: '❌ City name is too long (max 50 characters)'
        };
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const cityRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!cityRegex.test(city.trim())) {
        return {
            valid: false,
            message: '❌ Please use only letters, spaces, hyphens, or apostrophes'
        };
    }
    
    return {
        valid: true,
        message: '',
        trimmedCity: city.trim()
    };
}

// ========================================
// REQUIREMENT 3: EVENT LISTENER (click and keypress)
// ========================================
searchBtn.addEventListener('click', handleWeatherSearch);

// Allow Enter key to trigger search
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleWeatherSearch();
    }
});

// ========================================
// REQUIREMENT 4 & 5: FETCH CALL from Web API
// ========================================
async function fetchWeatherData(city) {
    try {
        // Build API URL with parameters
        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        
        // FETCH CALL - Requirement 4 & 5
        const response = await fetch(url);
        
        // Check if response is OK
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check spelling.`);
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key.');
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch weather data');
    }
}

// ========================================
// REQUIREMENT 6: DISPLAY DATA in user-friendly format
// ========================================
function displayWeatherData(data) {
    // Extract data from API response
    const cityName = data.name;
    const country = data.sys.country;
    const temperature = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;
    const weatherIcon = getWeatherIcon(description);
    
    // Get temperature-based message
    const tempMessage = getTemperatureMessage(temperature);
    
    // Build HTML for weather display
    const weatherHTML = `
        <div class="city-name">
            ${cityName}, ${country}
        </div>
        <div class="temperature">
            ${temperature}°C
        </div>
        <div class="description">
            ${weatherIcon} ${description}
        </div>
        <div class="weather-details">
            <div class="detail-card">
                <div class="detail-label">🌡️ Feels Like</div>
                <div class="detail-value">${feelsLike}°C</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">💧 Humidity</div>
                <div class="detail-value">${humidity}%</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">💨 Wind Speed</div>
                <div class="detail-value">${windSpeed} m/s</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">🔽 Pressure</div>
                <div class="detail-value">${pressure} hPa</div>
            </div>
        </div>
        <div class="extra-info" style="text-align: center; margin-top: 1rem; padding: 0.5rem; background: #e8f0fe; border-radius: 8px;">
            ${tempMessage}
        </div>
    `;
    
    // Display the weather data
    weatherResult.innerHTML = weatherHTML;
    weatherResult.style.display = 'block';
    
    // Scroll to results
    weatherResult.scrollIntoView({ behavior: 'smooth' });
}

// Helper function: Get weather icon based on description
function getWeatherIcon(description) {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '🌤️';
}

// Helper function: Get temperature-based message
function getTemperatureMessage(temp) {
    if (temp >= 35) return '🔥 Extreme heat! Stay hydrated and avoid direct sunlight!';
    if (temp >= 30) return '☀️ Hot weather! Wear light clothing and use sunscreen.';
    if (temp >= 25) return '🌞 Warm and pleasant! Perfect for outdoor activities.';
    if (temp >= 15) return '🌸 Comfortable weather! Great day for a walk.';
    if (temp >= 5) return '🍂 Cool weather! Bring a light jacket.';
    if (temp >= 0) return '🧣 Cold! Wear warm clothes.';
    return '❄️ Freezing! Bundle up and stay warm!';
}

// ========================================
// MAIN FUNCTION: Handle weather search
// ========================================
async function handleWeatherSearch() {
    // Clear previous results and errors
    weatherResult.style.display = 'none';
    errorMessage.style.display = 'none';
    errorMessage.innerHTML = '';
    
    // Get user input
    const city = cityInput.value;
    
    // VALIDATION - Requirement 2
    const validation = validateCityInput(city);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    // Show loading state
    searchBtn.textContent = 'Loading...';
    searchBtn.disabled = true;
    
    try {
        // FETCH WEATHER DATA - Requirement 4 & 5
        const weatherData = await fetchWeatherData(validation.trimmedCity);
        
        // DISPLAY DATA - Requirement 6
        displayWeatherData(weatherData);
        
        // Clear input after successful search
        cityInput.value = '';
        
    } catch (error) {
        showError(error.message);
    } finally {
        // Reset button
        searchBtn.textContent = 'Get Weather';
        searchBtn.disabled = false;
    }
}

// Helper function to show error messages
function showError(message) {
    errorMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>⚠️</span>
            <span>${message}</span>
        </div>
    `;
    errorMessage.style.display = 'block';
    weatherResult.style.display = 'none';
}

// ========================================
// INITIALIZATION: Welcome message
// ========================================
function showWelcomeMessage() {
    errorMessage.innerHTML = `
        <div style="background: #e8f0fe; color: #667eea; border-left-color: #667eea;">
            🌟 Welcome! Enter a city name to get real-time weather data from OpenWeatherMap API.
        </div>
    `;
    errorMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorMessage.innerHTML.includes('Welcome')) {
            errorMessage.style.display = 'none';
        }
    }, 5000);
}

// Show welcome message on page load
showWelcomeMessage();

// ========================================
// STUDY NOTES:
// ========================================
/*
REQUIREMENTS CHECKLIST:

✅ 1. Form Element: <input> for city name
✅ 2. JS Validation: validateCityInput() checks empty, length, characters
✅ 3. Event Listener: click on button AND keypress on input
✅ 4. Fetch Call: fetchWeatherData() uses fetch() API
✅ 5. Web API Data: OpenWeatherMap API provides real weather data
✅ 6. Display Data: displayWeatherData() shows formatted weather info
✅ 7. External CSS: style.css with 24+ CSS rules

API USED:
- Name: OpenWeatherMap Current Weather API
- Endpoint: https://api.openweathermap.org/data/2.5/weather
- Parameters: q (city name), appid (API key), units (metric)

DATA FLOW:
1. User enters city name
2. JS validates input
3. Click/Enter triggers fetch()
4. API returns weather data
5. Data is formatted and displayed
6. Error handling for invalid cities
*/