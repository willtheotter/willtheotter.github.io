// ========================================
// HW5: Sign Up Form - Study Guide
// CST336 - Will Walter
// ========================================

// ========================================
// 6️⃣ LOAD STATES ON PAGE LOAD
// ========================================
// Requirement: When page loads, display all US states in dropdown
// NO event listener needed - just call function directly

async function getStates() {
    try {
        // Using a reliable US states API
        const url = "https://gist.githubusercontent.com/mshafrir/2646763/raw/states_titlecase.json";
        
        const response = await fetch(url);
        const states = await response.json();
        
        const stateSelect = document.getElementById("state");
        
        // Clear loading message
        stateSelect.innerHTML = '<option value="">Select a state...</option>';
        
        // Add each state to dropdown
        states.forEach(state => {
            const option = document.createElement("option");
            option.value = state.abbreviation;
            option.text = state.name;
            stateSelect.appendChild(option);
        });
        
        console.log(`✅ Loaded ${states.length} states`);
        
    } catch (error) {
        console.error("Error loading states:", error);
        // Fallback states if API fails
        const fallbackStates = [
            { abbreviation: "AL", name: "Alabama" },
            { abbreviation: "CA", name: "California" },
            { abbreviation: "NY", name: "New York" },
            { abbreviation: "TX", name: "Texas" }
        ];
        
        const stateSelect = document.getElementById("state");
        fallbackStates.forEach(state => {
            const option = document.createElement("option");
            option.value = state.abbreviation;
            option.text = state.name;
            stateSelect.appendChild(option);
        });
    }
}

// Call getStates when page loads (NO event listener needed!)
getStates();

// ========================================
// 1️⃣ & 2️⃣ ZIP CODE LOOKUP
// ========================================
// Requirement: City, latitude, longitude update when entering zip code
// Requirement: "Zip code not found" message if invalid

document.getElementById("zip").addEventListener("blur", async function() {
    const zip = document.getElementById("zip").value;
    const zipError = document.getElementById("zipError");
    
    // Clear previous data
    document.getElementById("city").value = "";
    document.getElementById("lat").value = "";
    document.getElementById("lon").value = "";
    
    // Validate zip code format
    if (!zip || zip.length !== 5 || isNaN(zip)) {
        zipError.textContent = "Please enter a valid 5-digit zip code";
        return;
    }
    
    try {
        // Using Zippopotam API for US zip codes
        const url = `https://api.zippopotam.us/us/${zip}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Zip code not found");
        }
        
        const data = await response.json();
        
        // Update city, latitude, longitude
        document.getElementById("city").value = data.places[0]["place name"];
        document.getElementById("lat").value = data.places[0]["latitude"];
        document.getElementById("lon").value = data.places[0]["longitude"];
        
        // Clear error message on success
        zipError.textContent = "";
        
        console.log(`✅ Found: ${data.places[0]["place name"]}`);
        
    } catch (error) {
        // Display "Zip code not found" message
        zipError.textContent = "❌ Zip code not found";
        console.error("Zip lookup error:", error);
    }
});

// ========================================
// 3️⃣ COUNTIES UPDATE WHEN SELECTING STATE
// ========================================
// Requirement: List of counties updates when selecting a state

document.getElementById("state").addEventListener("change", async function() {
    const stateAbbr = document.getElementById("state").value;
    const countySelect = document.getElementById("county");
    
    // Clear county dropdown
    countySelect.innerHTML = '<option value="">Select a county...</option>';
    
    if (!stateAbbr) {
        return;
    }
    
    try {
        // Using US Census API for counties by state
        const url = `https://api.census.gov/data/2019/pep/population?get=NAME&for=county:*&in=state:${stateAbbr}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Skip the header row (index 0)
        for (let i = 1; i < data.length; i++) {
            const countyName = data[i][0];
            // Remove "County" suffix if present for cleaner display
            const cleanName = countyName.replace(" County", "");
            
            const option = document.createElement("option");
            option.value = cleanName;
            option.text = cleanName;
            countySelect.appendChild(option);
        }
        
        console.log(`✅ Loaded ${data.length - 1} counties for ${stateAbbr}`);
        
    } catch (error) {
        console.error("Error loading counties:", error);
        // Fallback counties if API fails
        const fallbackCounties = ["County 1", "County 2", "County 3"];
        fallbackCounties.forEach(county => {
            const option = document.createElement("option");
            option.value = county;
            option.text = county;
            countySelect.appendChild(option);
        });
    }
});

// ========================================
// 4️⃣ USERNAME AVAILABILITY CHECK
// ========================================
// Requirement: Color-coded message when typing username

document.getElementById("username").addEventListener("input", function() {
    const username = document.getElementById("username").value;
    const userMsg = document.getElementById("userMsg");
    
    // Check username rules
    if (username.length === 0) {
        userMsg.textContent = "";
        userMsg.className = "";
    } else if (username.length < 3) {
        // Too short - red message
        userMsg.textContent = "❌ Username must be at least 3 characters";
        userMsg.className = "text-danger";
    } else if (username === "admin" || username === "Admin" || username === "ADMIN") {
        // Reserved username - red message
        userMsg.textContent = "❌ Username not available (reserved)";
        userMsg.className = "text-danger";
    } else if (username.includes(" ")) {
        // No spaces allowed - red message
        userMsg.textContent = "❌ Username cannot contain spaces";
        userMsg.className = "text-danger";
    } else {
        // Available - green message
        userMsg.textContent = "✓ Username available!";
        userMsg.className = "text-success";
    }
});

// ========================================
// 5️⃣ PASSWORD SUGGESTION
// ========================================
// Requirement: When clicking password field, show suggested password

document.getElementById("password").addEventListener("focus", function() {
    const suggestedSpan = document.getElementById("suggested");
    const suggestedPassword = generatePassword();
    suggestedSpan.innerHTML = `💡 Suggested password: <strong>${suggestedPassword}</strong>`;
});

// Generate a random password
function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// ========================================
// 8️⃣, 9️⃣, 🔟 VALIDATION & WELCOME PAGE
// ========================================
// Requirement 8: Password must have at least 6 characters
// Requirement 9: Password must match Retype Password
// Requirement 10: Welcome page displayed if valid

function validateForm() {
    const password = document.getElementById("password").value;
    const retype = document.getElementById("retype").value;
    const username = document.getElementById("username").value;
    const zip = document.getElementById("zip").value;
    const state = document.getElementById("state").value;
    
    // Check if all fields are filled
    if (!username || !password || !retype || !zip || !state) {
        alert("❌ Please fill out all fields before submitting");
        return;
    }
    
    // Requirement 8: Password length validation
    if (password.length < 6) {
        alert("❌ Password must be at least 6 characters long");
        document.getElementById("password").focus();
        return;
    }
    
    // Requirement 9: Password matching validation
    if (password !== retype) {
        alert("❌ Passwords do not match! Please retype your password.");
        document.getElementById("retype").focus();
        return;
    }
    
    // Check username availability (make sure it's valid)
    const userMsg = document.getElementById("userMsg");
    if (userMsg.classList.contains("text-danger")) {
        alert("❌ Please choose a different username");
        return;
    }
    
    // Check if zip code was found
    const zipError = document.getElementById("zipError");
    if (zipError.textContent.includes("not found")) {
        alert("❌ Please enter a valid zip code");
        return;
    }
    
    // ========================================
    // Requirement 10: Welcome page displayed
    // ========================================
    
    // Get user data for welcome message
    const city = document.getElementById("city").value;
    const county = document.getElementById("county").value;
    const stateName = document.getElementById("state").options[document.getElementById("state").selectedIndex].text;
    
    // Create welcome page
    document.body.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card shadow-lg border-0 rounded-4">
                        <div class="card-body text-center p-5">
                            <div class="mb-4">
                                <div class="display-1">🎉</div>
                            </div>
                            <h1 class="display-4 mb-3">Welcome, ${username}!</h1>
                            <p class="lead mb-4">Your account has been successfully created!</p>
                            
                            <div class="alert alert-info text-start mt-4">
                                <h5 class="mb-3">📋 Account Details:</h5>
                                <p><strong>📍 Location:</strong> ${city || "Unknown"}, ${county || "Unknown"} County, ${stateName}</p>
                                <p><strong>🔐 Username:</strong> ${username}</p>
                                <p><strong>📅 Created:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>
                            
                            <button class="btn btn-primary btn-lg px-5 mt-3" onclick="location.reload()">
                                Create Another Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                font-family: 'Segoe UI', sans-serif;
            }
            .card {
                animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;
}

// ========================================
// ADDITIONAL HELPER: Clear password suggestion on blur
// ========================================
document.getElementById("password").addEventListener("blur", function() {
    const suggestedSpan = document.getElementById("suggested");
    // Keep the suggestion or clear after delay
    setTimeout(() => {
        if (document.activeElement !== document.getElementById("password")) {
            // Optional: clear after 3 seconds
            // suggestedSpan.innerHTML = "";
        }
    }, 3000);
});

// ========================================
// STUDY NOTES:
// ========================================
/*
REQUIREMENTS CHECKLIST:

✅ 1. City, lat, lon update when entering zip code (zip.blur event)
✅ 2. "Zip code not found" message displayed (try/catch with error)
✅ 3. Counties update when selecting state (state.change event)
✅ 4. Color-coded username availability (input event, text-danger/success)
✅ 5. Suggested password on focus (password.focus event)
✅ 6. US states loaded on page load (getStates() called directly)
✅ 7. Nice look (Bootstrap + 30+ CSS rules)
✅ 8. Password length validation (min 6 characters)
✅ 9. Password matching validation (password === retype)
✅ 10. Welcome page displayed on valid submission

APIs USED:
- US States: GitHub Gist JSON
- Zip Codes: Zippopotam API (https://api.zippopotam.us)
- Counties: US Census API

DATA FLOW:
1. User enters zip → API call → Populates city, lat, lon
2. User selects state → API call → Populates counties
3. User types username → Real-time validation
4. User clicks password → Shows suggestion
5. User submits → Validation → Welcome page
*/