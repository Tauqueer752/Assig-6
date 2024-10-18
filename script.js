const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const progressBar = document.getElementById('progress');

let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];


startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});


function startQuiz() {
  startButton.classList.add('hide');
  score = 0;
  currentQuestionIndex = 0;
  questionContainer.classList.remove('hide');
  scoreContainer.classList.add('hide');
  fetchQuestions(); // Fetch questions from API
}


async function fetchQuestions() {
  try {
    const res = await fetch(
      'https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple'
    );
    const data = await res.json();
    quizQuestions = formatQuestions(data.results); 
    setNextQuestion();
  } catch (error) {
    console.error('Failed to fetch questions:', error);
  }
}


function formatQuestions(apiQuestions) {
  return apiQuestions.map((q) => {
    const answers = [...q.incorrect_answers.map((ans) => ({ text: ans, correct: false })), 
                     { text: q.correct_answer, correct: true }];
    return { question: q.question, answers: shuffleArray(answers) };
  });
}


function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}


function setNextQuestion() {
  resetState();
  showQuestion(quizQuestions[currentQuestionIndex]);
  updateProgressBar();
}


function showQuestion(question) {
  questionElement.innerHTML = question.question; // Use innerHTML to render special characters
  question.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) button.dataset.correct = true;
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });
}


function resetState() {
  nextButton.classList.add('hide');
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}


function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  if (correct) score++;
  scoreElement.innerText = score;
  Array.from(answerButtons.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
  if (quizQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    showScore();
  }
}


function setStatusClass(element, correct) {
  element.classList.remove('correct', 'wrong');
  if (correct) element.classList.add('correct');
  else element.classList.add('wrong');
}


function showScore() {
  questionContainer.classList.add('hide');
  scoreContainer.classList.remove('hide');
  startButton.innerText = 'Restart';
  startButton.classList.remove('hide');
}


function updateProgressBar() {
  const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + '%';
}

