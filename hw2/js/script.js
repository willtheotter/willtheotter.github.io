// US Geography Quiz - Main JavaScript

// Initialize variables
var score = 0;
var attempts = localStorage.getItem("total_attempts");

if (attempts == null) {
    attempts = 0;
} else {
    attempts = parseInt(attempts);
}

// Display attempts on page load
document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${attempts}`;

// Question 4 choices (random order)
function displayQ4Choices() {
    let q4ChoicesArray = ["Maine", "Rhode Island", "Maryland", "Delaware"];
    q4ChoicesArray = _.shuffle(q4ChoicesArray);
    let container = document.querySelector("#q4Choices");
    container.innerHTML = "";
    
    for (let i = 0; i < q4ChoicesArray.length; i++) {
        let div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `
            <input class="form-check-input" type="radio" name="q4" value="${q4ChoicesArray[i]}" id="q4opt${i}">
            <label class="form-check-label" for="q4opt${i}">${q4ChoicesArray[i]}</label>
        `;
        container.appendChild(div);
    }
}

// Question 5 choices (random order)
function displayQ5Choices() {
    let q5ChoicesArray = ["Missouri", "Mississippi", "Yukon", "Rio Grande"];
    q5ChoicesArray = _.shuffle(q5ChoicesArray);
    let container = document.querySelector("#q5Choices");
    container.innerHTML = "";
    
    for (let i = 0; i < q5ChoicesArray.length; i++) {
        let div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `
            <input class="form-check-input" type="radio" name="q5" value="${q5ChoicesArray[i]}" id="q5opt${i}">
            <label class="form-check-label" for="q5opt${i}">${q5ChoicesArray[i]}</label>
        `;
        container.appendChild(div);
    }
}

// Display random order choices on load
displayQ4Choices();
displayQ5Choices();

// Form validation
function isFormValid() {
    // Check Q1
    if (document.querySelector("#q1").value.trim() === "") {
        document.querySelector("#validationFdbk").innerHTML = "Question 1 must be answered!";
        return false;
    }
    
    // Check Q2
    if (document.querySelector("#q2").value === "") {
        document.querySelector("#validationFdbk").innerHTML = "Please select an answer for question 2.";
        return false;
    }
    
    // Check Q4 (radio)
    if (!document.querySelector("input[name=q4]:checked")) {
        document.querySelector("#validationFdbk").innerHTML = "Please select an answer for question 4.";
        return false;
    }
    
    // Check Q5 (radio)
    if (!document.querySelector("input[name=q5]:checked")) {
        document.querySelector("#validationFdbk").innerHTML = "Please select an answer for question 5.";
        return false;
    }
    
    // Check Q6 (number)
    if (document.querySelector("#q6").value === "") {
        document.querySelector("#validationFdbk").innerHTML = "Please answer question 6.";
        return false;
    }
    
    // Check Q7 (radio)
    if (!document.querySelector("input[name=q7]:checked")) {
        document.querySelector("#validationFdbk").innerHTML = "Please select an answer for question 7.";
        return false;
    }
    
    // Check Q9 (text)
    if (document.querySelector("#q9").value.trim() === "") {
        document.querySelector("#validationFdbk").innerHTML = "Please answer question 9.";
        return false;
    }
    
    // Check Q10 (dropdown)
    if (document.querySelector("#q10").value === "") {
        document.querySelector("#validationFdbk").innerHTML = "Please select an answer for question 10.";
        return false;
    }
    
    document.querySelector("#validationFdbk").innerHTML = "";
    return true;
}

// Right answer handler
function rightAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Correct!";
    document.querySelector(`#q${index}Feedback`).className = "mt-2 bg-success text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/check.png' width='25'>";
    score += 10; // 10 points per question
}

// Wrong answer handler
function wrongAnswer(index) {
    document.querySelector(`#q${index}Feedback`).innerHTML = "Incorrect";
    document.querySelector(`#q${index}Feedback`).className = "mt-2 bg-danger text-white";
    document.querySelector(`#markImg${index}`).innerHTML = "<img src='img/xmark.png' width='25'>";
}

// Main grading function
function gradeQuiz() {
    if (!isFormValid()) {
        return;
    }
    
    score = 0;
    
    // Get all responses
    let q1Response = document.querySelector("#q1").value.toLowerCase().trim();
    let q2Response = document.querySelector("#q2").value;
    let q4Response = document.querySelector("input[name=q4]:checked").value;
    let q5Response = document.querySelector("input[name=q5]:checked").value;
    let q6Response = parseInt(document.querySelector("#q6").value);
    let q7Response = document.querySelector("input[name=q7]:checked").value;
    let q9Response = document.querySelector("#q9").value.toLowerCase().trim();
    let q10Response = document.querySelector("#q10").value;
    
    // Checkbox responses for Q3
    let jackson = document.querySelector("#Jackson").checked;
    let franklin = document.querySelector("#Franklin").checked;
    let jefferson = document.querySelector("#Jefferson").checked;
    let roosevelt = document.querySelector("#Roosevelt").checked;
    
    // Checkbox responses for Q8 (Great Lakes)
    let glErie = document.querySelector("#gl1").checked;
    let glMichigan = document.querySelector("#gl2").checked;
    let glSuperior = document.querySelector("#gl3").checked;
    let glHuron = document.querySelector("#gl4").checked;
    let glOntario = document.querySelector("#gl5").checked;
    let glChamplain = document.querySelector("#gl6").checked;
    
    // Grade Q1
    if (q1Response === "sacramento") {
        rightAnswer(1);
    } else {
        wrongAnswer(1);
    }
    
    // Grade Q2
    if (q2Response === "Arizona") {
        rightAnswer(2);
    } else {
        wrongAnswer(2);
    }
    
    // Grade Q3 (correct: Jefferson and Roosevelt only)
    if (!jackson && !franklin && jefferson && roosevelt) {
        rightAnswer(3);
    } else {
        wrongAnswer(3);
    }
    
    // Grade Q4
    if (q4Response === "Rhode Island") {
        rightAnswer(4);
    } else {
        wrongAnswer(4);
    }
    
    // Grade Q5
    if (q5Response === "Missouri") {
        rightAnswer(5);
    } else {
        wrongAnswer(5);
    }
    
    // Grade Q6
    if (q6Response === 50) {
        rightAnswer(6);
    } else {
        wrongAnswer(6);
    }
    
    // Grade Q7
    if (q7Response === "4") {
        rightAnswer(7);
    } else {
        wrongAnswer(7);
    }
    
    // Grade Q8 (all five Great Lakes: Erie, Michigan, Superior, Huron, Ontario)
    if (glErie && glMichigan && glSuperior && glHuron && glOntario && !glChamplain) {
        rightAnswer(8);
    } else {
        wrongAnswer(8);
    }
    
    // Grade Q9
    if (q9Response === "hawaii") {
        rightAnswer(9);
    } else {
        wrongAnswer(9);
    }
    
    // Grade Q10
    if (q10Response === "Hawaii") {
        rightAnswer(10);
    } else {
        wrongAnswer(10);
    }
    
    // Display total score
    let scoreElement = document.querySelector("#totalScore");
    scoreElement.innerHTML = `Total Score: ${score}/100`;
    
    // Congratulatory message for score > 80
    if (score > 80) {
        scoreElement.style.color = "green";
        document.querySelector("#congrats").innerHTML = "🎉 Congratulations! You scored above 80!";
    } else {
        scoreElement.style.color = "red";
        document.querySelector("#congrats").innerHTML = "";
    }
    
    // Update attempts
    attempts++;
    document.querySelector("#totalAttempts").innerHTML = `Total Attempts: ${attempts}`;
    localStorage.setItem("total_attempts", attempts);
}

// Add event listener to submit button
document.querySelector("#submitQuiz").addEventListener("click", gradeQuiz);

// Clear feedback on page load
for (let i = 1; i <= 10; i++) {
    let fb = document.querySelector(`#q${i}Feedback`);
    if (fb) {
        fb.innerHTML = "";
        fb.className = "mt-2";
    }
    let mark = document.querySelector(`#markImg${i}`);
    if (mark) mark.innerHTML = "";
}