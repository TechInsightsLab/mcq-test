const allQuestions = [
    { category: "JavaScript", question: "Which company developed JS?", a: "Microsoft", b: "Netscape", c: "Google", d: "Oracle", correct: "b" },
    { category: "JavaScript", question: "Which is a JS framework?", a: "Django", b: "React", c: "Laravel", d: "Flask", correct: "b" },
    { category: "HTML", question: "What does HTML stand for?", a: "Hyper Text Markup", b: "Home Tool Markup", c: "Hyperlink Text", d: "High Tech Mark", correct: "a" },
    { category: "CSS", question: "What does CSS stand for?", a: "Creative Style", b: "Cascading Style", c: "Computer Style", d: "Control Style", correct: "b" }
];

let quizData = [], currentIdx = 0, score = 0, userAnswers = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startQuiz(cat) {
    quizData = allQuestions.filter(q => q.category === cat);
    shuffle(quizData);
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
    document.getElementById('result-stats').innerHTML = `<h3>Final Score: ${score}/${quizData.length}</h3>`;
    let reviewHtml = '<h4>Review:</h4>';
    userAnswers.forEach(item => {
        reviewHtml += `<div class="review-item"><div class="rev-q">${item.q}</div><div class="rev-a">✔ ${item.c}</div>${!item.ok ? `<div class="rev-w">✘ Your Pick: ${item.s}</div>` : ''}</div>`;
    });
    document.getElementById('review-section').innerHTML = reviewHtml;
}

function goBack() { location.reload(); }
