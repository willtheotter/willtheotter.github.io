// Load states on page load (NO event listener needed)
getStates();

// 1️⃣ ZIP CODE LOOKUP
document.getElementById("zip").addEventListener("blur", async () => {
  let zip = document.getElementById("zip").value;

  let url = `https://api.zippopotam.us/us/${zip}`;

  try {
    let res = await fetch(url);

    if (!res.ok) throw "error";

    let data = await res.json();

    document.getElementById("city").value = data.places[0]["place name"];
    document.getElementById("lat").value = data.places[0]["latitude"];
    document.getElementById("lon").value = data.places[0]["longitude"];
    document.getElementById("zipError").innerText = "";

  } catch {
    document.getElementById("zipError").innerText = "Zip code not found";
  }
});


// 3️⃣ COUNTIES BY STATE
document.getElementById("state").addEventListener("change", async () => {
  let state = document.getElementById("state").value;

  let url = `https://api.census.gov/data/2019/pep/population?get=NAME&for=county:*&in=state:${state}`;

  let res = await fetch(url);
  let data = await res.json();

  let countySelect = document.getElementById("county");
  countySelect.innerHTML = "";

  for (let i = 1; i < data.length; i++) {
    let option = document.createElement("option");
    option.text = data[i][0];
    countySelect.appendChild(option);
  }
});


// 4️⃣ USERNAME CHECK
document.getElementById("username").addEventListener("input", () => {
  let username = document.getElementById("username").value;
  let msg = document.getElementById("userMsg");

  if (username.length < 3) {
    msg.innerText = "Too short";
    msg.className = "text-danger";
  } else if (username === "admin") {
    msg.innerText = "Username not available";
    msg.className = "text-danger";
  } else {
    msg.innerText = "Username available";
    msg.className = "text-success";
  }
});


// 5️⃣ PASSWORD SUGGESTION
document.getElementById("password").addEventListener("focus", () => {
  document.getElementById("suggested").innerText =
    "Suggested: " + generatePassword();
});

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}


// 6️⃣ LOAD STATES
async function getStates() {
  let url = "https://gist.githubusercontent.com/mshafrir/2646763/raw/states_titlecase.json";

  let res = await fetch(url);
  let states = await res.json();

  let select = document.getElementById("state");

  states.forEach(s => {
    let option = document.createElement("option");
    option.value = s.abbreviation;
    option.text = s.name;
    select.appendChild(option);
  });
}


// 8,9,10️⃣ VALIDATION + REDIRECT
function validateForm() {
  let pass = document.getElementById("password").value;
  let retype = document.getElementById("retype").value;

  if (pass.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (pass !== retype) {
    alert("Passwords do not match");
    return;
  }

  // SUCCESS PAGE
  document.body.innerHTML = `
    <div class="container text-center mt-5">
      <h1>Welcome 🎉</h1>
      <p>Your account has been created!</p>
    </div>
  `;
}