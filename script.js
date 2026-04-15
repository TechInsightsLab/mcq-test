const allQuestions = [
    { category: "JavaScript", question: "Which is a JS framework?", a: "React", b: "HTML", c: "CSS", d: "SQL", correct: "a" },
    { category: "JavaScript", question: "Which company created JS?", a: "Microsoft", b: "Netscape", c: "Oracle", d: "Google", correct: "b" },
    { category: "HTML", question: "Which tag is used for images?", a: "<img>", b: "<pic>", c: "<src>", d: "<href>", correct: "a" },
    { category: "CSS", question: "Which property changes text color?", a: "font-style", b: "text-color", c: "color", d: "background", correct: "c" }
];

let quizData = [], currentIdx = 0, score = 0, userAnswers = [];

function startQuiz(cat) {
    quizData = allQuestions.filter(q => q.category === cat);
    if(quizData.length === 0) return alert("No questions in this category!");
    
    // Shuffle
    for (let i = quizData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
    }

    document.getElementById('category-screen').classList.add('hidden');
    document.getElementById('quiz-box').classList.remove('hidden');
    document.getElementById('total-questions').innerText = quizData.length;
    loadQuiz();
}

function loadQuiz() {
    const data = quizData[currentIdx];
    document.getElementById('current-pos').innerText = currentIdx + 1;
    document.getElementById('progress-bar').style.width = `${(currentIdx / quizData.length) * 100}%`;
    document.getElementById('question').innerText = data.question;
    
    ['a','b','c','d'].forEach(id => {
        document.getElementById(`text-${id}`).innerText = data[id];
        const label = document.getElementById(`text-${id}`).parentElement;
        label.className = 'option-label';
        label.querySelector('input').disabled = false;
    });
    
    document.getElementById('options-form').reset();
    document.getElementById('next').classList.add('hidden');
}

document.getElementById('options-form').addEventListener('change', (e) => {
    const selected = e.target.value;
    const correct = quizData[currentIdx].correct;
    document.querySelectorAll('input[name="answer"]').forEach(i => i.disabled = true);
    
    const isCorrect = selected === correct;
    userAnswers.push({ q: quizData[currentIdx].question, c: quizData[currentIdx][correct], s: quizData[currentIdx][selected], ok: isCorrect });

    if (isCorrect) {
        e.target.parentElement.classList.add('correct');
        showToast("Correct! 🎉", "success");
        score++;
    } else {
        e.target.parentElement.classList.add('wrong');
        document.querySelector(`input[value="${correct}"]`).parentElement.classList.add('correct');
        showToast("Wrong! ❌", "error");
    }
    document.getElementById('score').innerText = score;
    document.getElementById('next').classList.remove('hidden');
});

function showToast(m, t) {
    const el = document.getElementById('toast');
    el.innerText = m; el.className = `toast ${t}`;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 1500);
}

document.getElementById('next').addEventListener('click', () => {
    currentIdx++;
    if (currentIdx < quizData.length) loadQuiz();
    else showFinalResult();
});

function showFinalResult() {
    document.getElementById('quiz-box').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('result-stats').innerHTML = `<h3>Score: ${score}/${quizData.length}</h3>`;
    let reviewHtml = '';
    userAnswers.forEach(item => {
        reviewHtml += `<div class="review-item"><div class="rev-q">${item.q}</div><div class="rev-a">✔ ${item.c}</div>${!item.ok ? `<div class="rev-w">✘ Your Pick: ${item.s}</div>` : ''}</div>`;
    });
    document.getElementById('review-section').innerHTML = reviewHtml;
}

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('theme-toggle').innerText = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('quiz-theme', theme);
}

// Init theme
const savedTheme = localStorage.getItem('quiz-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
document.getElementById('theme-toggle').innerText = savedTheme === 'dark' ? '☀️' : '🌙';

function goBack() { location.reload(); }
