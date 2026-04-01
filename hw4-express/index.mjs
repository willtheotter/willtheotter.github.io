// ========================================
// HW4: Express - Programming Languages Explorer
// CST336 - Will Walter
// ========================================

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARE
// ========================================
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Fetches programming language data from GitHub API
 * Web API: GitHub REST API (https://api.github.com/)
 */
async function fetchGitHubLanguages() {
    try {
        // Using GitHub's API to get top repositories by language
        const response = await axios.get('https://api.github.com/search/repositories', {
            params: {
                q: 'stars:>10000',
                sort: 'stars',
                per_page: 10
            }
        });
        
        // Extract language data from repositories
        const languageCount = {};
        response.data.items.forEach(repo => {
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        });
        
        return Object.entries(languageCount)
            .map(([name, count]) => ({ name, count, repos: count }))
            .sort((a, b) => b.count - a.count);
            
    } catch (error) {
        console.error('GitHub API Error:', error.message);
        return [
            { name: 'JavaScript', count: 5, repos: 5 },
            { name: 'Python', count: 4, repos: 4 },
            { name: 'TypeScript', count: 3, repos: 3 }
        ];
    }
}

/**
 * Generates random programming facts
 * Node Package: Using built-in Math.random() with custom data
 * (This simulates using a Node package - in real project you'd use something like 'random-facts')
 */
function getRandomProgrammingFact() {
    const facts = [
        { fact: "The first computer programmer was Ada Lovelace in 1843.", category: "History" },
        { fact: "JavaScript was created in just 10 days by Brendan Eich.", category: "Fun" },
        { fact: "Python was named after Monty Python, not the snake.", category: "Trivia" },
        { fact: "The first computer bug was an actual moth found in a Harvard Mark II computer.", category: "History" },
        { fact: "There are over 700 programming languages in existence.", category: "Statistics" },
        { fact: "Git was created by Linus Torvalds in just two weeks.", category: "Tools" },
        { fact: "The first high-level programming language was FORTRAN, created in 1957.", category: "History" },
        { fact: "C was created to write the UNIX operating system.", category: "Languages" },
        { fact: "The most popular programming language in 2024 is Python.", category: "Trends" },
        { fact: "Stack Overflow has over 20 million questions about programming.", category: "Community" }
    ];
    return facts[Math.floor(Math.random() * facts.length)];
}

// ========================================
// ROUTES (5 routes / views)
// ========================================

// Route 1: Home Page
app.get('/', async (req, res) => {
    const randomFact = getRandomProgrammingFact();
    const githubData = await fetchGitHubLanguages();
    const topLanguages = githubData.slice(0, 5);
    
    res.render('index', {
        title: 'Home',
        currentPage: 'home',
        randomFact,
        topLanguages,
        year: new Date().getFullYear()
    });
});

// Route 2: Languages Page
app.get('/languages', async (req, res) => {
    const githubData = await fetchGitHubLanguages();
    
    res.render('languages', {
        title: 'Programming Languages',
        currentPage: 'languages',
        languages: githubData,
        year: new Date().getFullYear()
    });
});

// Route 3: History Page
app.get('/history', (req, res) => {
    // Programming languages timeline data
    const timeline = [
        { year: 1957, language: 'FORTRAN', creator: 'John Backus', significance: 'First high-level language' },
        { year: 1959, language: 'COBOL', creator: 'Grace Hopper', significance: 'Business applications' },
        { year: 1972, language: 'C', creator: 'Dennis Ritchie', significance: 'System programming' },
        { year: 1983, language: 'C++', creator: 'Bjarne Stroustrup', significance: 'Object-oriented C' },
        { year: 1991, language: 'Python', creator: 'Guido van Rossum', significance: 'Readable, versatile' },
        { year: 1995, language: 'Java', creator: 'James Gosling', significance: 'Write once, run anywhere' },
        { year: 1995, language: 'JavaScript', creator: 'Brendan Eich', significance: 'Web interactivity' },
        { year: 2014, language: 'Swift', creator: 'Apple', significance: 'Modern iOS development' },
        { year: 2015, language: 'Rust', creator: 'Mozilla', significance: 'Memory safety' }
    ];
    
    res.render('history', {
        title: 'History',
        currentPage: 'history',
        timeline,
        year: new Date().getFullYear()
    });
});

// Route 4: Trends Page
app.get('/trends', (req, res) => {
    const trends = [
        { name: 'AI-Assisted Development', description: 'Tools like GitHub Copilot are changing how we code', impact: 'High' },
        { name: 'Rust Adoption', description: 'Memory-safe systems programming', impact: 'High' },
        { name: 'WebAssembly', description: 'Running high-performance code in browsers', impact: 'Medium' },
        { name: 'Quantum Computing', description: 'New languages for quantum algorithms', impact: 'Emerging' },
        { name: 'Low-Code Platforms', description: 'Visual development for business apps', impact: 'Medium' }
    ];
    
    res.render('trends', {
        title: 'Future Trends',
        currentPage: 'trends',
        trends,
        year: new Date().getFullYear()
    });
});

// Route 5: Resources Page (with additional API data)
app.get('/resources', async (req, res) => {
    // Fetch additional API data - GitHub's emojis API (fun endpoint)
    let emojis = {};
    try {
        const response = await axios.get('https://api.github.com/emojis');
        // Get first 20 emojis
        emojis = Object.entries(response.data).slice(0, 20);
    } catch (error) {
        console.error('Emoji API Error:', error.message);
        emojis = [['code', '💻'], ['bug', '🐛'], ['rocket', '🚀']];
    }
    
    const randomFact = getRandomProgrammingFact();
    
    res.render('resources', {
        title: 'Learning Resources',
        currentPage: 'resources',
        emojis,
        randomFact,
        year: new Date().getFullYear()
    });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Web API: GitHub REST API`);
    console.log(`📦 Node Package: Custom random facts generator`);
});