// ========================================
// HW2: US Geography Quiz - Study Guide
// CST336 - Will Walter
// ========================================

// ========================================
// QUIZ DATA - All questions and answers
// ========================================
const quizData = {
    // Question 1: Text input
    q1: { correct: "Sacramento", points: 10 },
    
    // Question 2: Dropdown
    q2: { correct: "Arizona", points: 10 },
    
    // Question 3: Checkboxes (multiple correct)
    q3: { 
        correct: ["Washington", "Jefferson", "Roosevelt", "Lincoln"],
        points: 10,
        // Each correct answer is worth 2.5 points
        perAnswer: 2.5
    },
    
    // Question 4: Radio - Smallest state
    q4: { correct: "Rhode Island", points: 10 },
    
    // Question 5: Radio - Longest river
    q5: { correct: "Missouri River", points: 10 },
    
    // Question 6: Number input
    q6: { correct: 50, points: 10 },
    
    // Question 7: Radio - Time zones
    q7: { correct: "4", points: 10 },
    
    // Question 8: Checkboxes (Great Lakes)
    q8: {
        correct: ["Superior", "Michigan", "Huron", "Erie", "Ontario"],
        points: 10,
        perAnswer: 2  // 5 correct answers × 2 points = 10
    },
    
    // Question 9: Text input
    q9: { correct: "Hawaii", points: 10 },
    
    // Question 10: Dropdown
    q10: { correct: "Hawaii", points: 10 }
};

// ========================================
// OPTIONS FOR RANDOM ORDER QUESTIONS
// ========================================
const q4Options = [
    "Rhode Island", "Delaware", "Connecticut", "Hawaii"
];

const q5Options = [
    "Missouri River", "Mississippi River", "Colorado River", "Rio Grande"
];

// ========================================
// WEB STORAGE - Track quiz attempts
// ========================================
let quizAttempts = localStorage.getItem('quizAttempts');

if (quizAttempts === null) {
    quizAttempts = 0;
    localStorage.setItem('quizAttempts', quizAttempts);
} else {
    quizAttempts = parseInt(quizAttempts);
}

// Display attempt count
document.getElementById('attemptCount').innerHTML = `📊 Total quiz attempts: ${quizAttempts}`;

// ========================================
// FUNCTION: Shuffle array (Fisher-Yates algorithm)
// ========================================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ========================================
// FUNCTION: Display random order options
// ========================================
function displayRandomOptions() {
    // Question 4 - Random order
    const shuffledQ4 = shuffleArray([...q4Options]);
    const q4Container = document.getElementById('q4Options');
    q4Container.innerHTML = '';
    shuffledQ4.forEach(option => {
        q4Container.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="q4" id="q4_${option}" value="${option}">
                <label class="form-check-label" for="q4_${option}">${option}</label>
            </div>
        `;
    });
    
    // Question 5 - Random order
    const shuffledQ5 = shuffleArray([...q5Options]);
    const q5Container = document.getElementById('q5Options');
    q5Container.innerHTML = '';
    shuffledQ5.forEach(option => {
        q5Container.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="q5" id="q5_${option}" value="${option}">
                <label class="form-check-label" for="q5_${option}">${option}</label>
            </div>
        `;
    });
}

// Call function when page loads
displayRandomOptions();

// ========================================
// FUNCTION: Check a single question
// ========================================
function checkQuestion(questionId, userAnswer, correctAnswer, feedbackId, markImgId, isCheckbox = false, correctList = null) {
    let isCorrect = false;
    let score = 0;
    
    if (isCheckbox && correctList) {
        // Handle checkbox questions with multiple correct answers
        let correctCount = 0;
        let selectedCount = 0;
        
        correctList.forEach(answer => {
            if (userAnswer.includes(answer)) {
                correctCount++;
            }
        });
        
        selectedCount = userAnswer.length;
        
        // Calculate score: points for correct selections, no penalty for incorrect
        score = correctCount * quizData[questionId].perAnswer;
        
        // Mark as correct only if all correct answers are selected AND no wrong selections
        isCorrect = (correctCount === correctList.length && selectedCount === correctList.length);
        
    } else {
        // Handle single answer questions
        if (typeof userAnswer === 'string') {
            // Case-insensitive comparison for text inputs
            isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        } else {
            isCorrect = userAnswer === correctAnswer;
        }
        score = isCorrect ? quizData[questionId].points : 0;
    }
    
    // Display feedback
    const feedbackDiv = document.getElementById(feedbackId);
    const markImg = document.getElementById(markImgId);
    
    if (isCorrect) {
        feedbackDiv.innerHTML = '✓ Correct!';
        feedbackDiv.className = 'feedback correct';
        markImg.src = 'img/correct.png';
        markImg.style.display = 'inline';
    } else {
        feedbackDiv.innerHTML = `✗ Incorrect. The correct answer is: ${Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}`;
        feedbackDiv.className = 'feedback incorrect';
        markImg.src = 'img/incorrect.png';
        markImg.style.display = 'inline';
    }
    
    return score;
}

// ========================================
// FUNCTION: Get user answers from form
// ========================================
function getUserAnswers() {
    return {
        q1: document.getElementById('q1').value,
        q2: document.getElementById('q2').value,
        q3: getCheckboxValues(['q3_1', 'q3_2', 'q3_3', 'q3_4']),
        q4: getRadioValue('q4'),
        q5: getRadioValue('q5'),
        q6: parseInt(document.getElementById('q6').value),
        q7: getRadioValue('q7'),
        q8: getCheckboxValues(['q8_1', 'q8_2', 'q8_3', 'q8_4', 'q8_5', 'q8_6']),
        q9: document.getElementById('q9').value,
        q10: document.getElementById('q10').value
    };
}

// Helper: Get selected checkbox values
function getCheckboxValues(ids) {
    const values = [];
    ids.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            values.push(checkbox.value);
        }
    });
    return values;
}

// Helper: Get selected radio value
function getRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (let radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// ========================================
// FUNCTION: Calculate total score
// ========================================
function calculateTotalScore(answers) {
    let total = 0;
    
    // Question 1
    total += checkQuestion('q1', answers.q1, quizData.q1.correct, 'q1Feedback', 'markImg1');
    
    // Question 2
    total += checkQuestion('q2', answers.q2, quizData.q2.correct, 'q2Feedback', 'markImg2');
    
    // Question 3 (Checkbox)
    total += checkQuestion('q3', answers.q3, quizData.q3.correct, 'q3Feedback', 'markImg3', true, quizData.q3.correct);
    
    // Question 4
    total += checkQuestion('q4', answers.q4, quizData.q4.correct, 'q4Feedback', 'markImg4');
    
    // Question 5
    total += checkQuestion('q5', answers.q5, quizData.q5.correct, 'q5Feedback', 'markImg5');
    
    // Question 6
    total += checkQuestion('q6', answers.q6, quizData.q6.correct, 'q6Feedback', 'markImg6');
    
    // Question 7
    total += checkQuestion('q7', answers.q7, quizData.q7.correct, 'q7Feedback', 'markImg7');
    
    // Question 8 (Checkbox)
    total += checkQuestion('q8', answers.q8, quizData.q8.correct, 'q8Feedback', 'markImg8', true, quizData.q8.correct);
    
    // Question 9
    total += checkQuestion('q9', answers.q9, quizData.q9.correct, 'q9Feedback', 'markImg9');
    
    // Question 10
    total += checkQuestion('q10', answers.q10, quizData.q10.correct, 'q10Feedback', 'markImg10');
    
    return total;
}

// ========================================
// FUNCTION: Display results
// ========================================
function displayResults(score) {
    const resultsDiv = document.getElementById('results');
    const scoreSpan = document.getElementById('score');
    const congratsDiv = document.getElementById('congratsMessage');
    
    scoreSpan.textContent = score;
    resultsDiv.style.display = 'block';
    
    // Congratulatory message for score above 80
    if (score > 80) {
        congratsDiv.innerHTML = `
            <div class="congrats">
                🎉 CONGRATULATIONS! 🎉<br>
                You scored ${score}%! Excellent knowledge of US Geography!
            </div>
        `;
    } else if (score >= 70) {
        congratsDiv.innerHTML = `
            <div class="congrats" style="background: #fff3cd; color: #856404;">
                Good job! You scored ${score}%. Keep studying to reach 80%!
            </div>
        `;
    } else {
        congratsDiv.innerHTML = `
            <div class="congrats" style="background: #f8d7da; color: #721c24;">
                You scored ${score}%. Review the answers and try again!
            </div>
        `;
    }
}

// ========================================
// FUNCTION: Submit quiz
// ========================================
function submitQuiz() {
    // Get all answers
    const answers = getUserAnswers();
    
    // Calculate score
    const totalScore = calculateTotalScore(answers);
    
    // Update and increment quiz attempts in localStorage
    quizAttempts++;
    localStorage.setItem('quizAttempts', quizAttempts);
    document.getElementById('attemptCount').innerHTML = `📊 Total quiz attempts: ${quizAttempts}`;
    
    // Display results
    displayResults(totalScore);
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// EVENT LISTENERS
// ========================================
document.getElementById('submitBtn').addEventListener('click', submitQuiz);

// Allow Enter key to submit
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitQuiz();
    }
});

// ========================================
// STUDY NOTES:
// 1. localStorage: Stores data in browser (persists after page refresh)
// 2. Array manipulation: shuffleArray uses Fisher-Yates algorithm
// 3. DOM manipulation: dynamically creating radio buttons
// 4. Event listeners: handling user interaction
// ========================================