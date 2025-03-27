const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}s`;
};

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion = 0,
  timer;

const startQuiz = () => {
  const num = parseInt(numQuestions.value);
  time = parseInt(timePerQuestion.value); // ✅ Get user-selected time

  fetch("./questions.json")
    .then((res) => res.json())
    .then((data) => {
      questions = data.sort(() => Math.random() - 0.5).slice(0, num);
      if (questions.length === 0) {
        console.error("No questions available!");
        return;
      }
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      currentQuestion = 0;
      showQuestion(questions[currentQuestion]);
    });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
  clearInterval(timer); // ✅ Stop any previous timer
  time = parseInt(timePerQuestion.value); // ✅ Reset timer for new question

  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;
  const answers = [...question.incorrect_answers, question.correct_answer];
  answers.sort(() => Math.random() - 0.5);
  
  answersWrapper.innerHTML = "";
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox"><i class="fas fa-check"></i></span>
      </div>`;
  });

  questionNumber.innerHTML = `Question <span class="current">${currentQuestion + 1}</span> / <span class="total">${questions.length}</span>`;

  document.querySelectorAll(".answer").forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        document.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  startTimer(time); // ✅ Start the timer for this question
};

const startTimer = (time) => {
  progress(time); // ✅ Ensure progress bar starts at full time

  timer = setInterval(() => {
    if (time > 0) {
      progress(time);
      time--;
    } else {
      clearInterval(timer); // ✅ Stop timer when time reaches 0
      checkAnswer(); // ✅ Auto-submit answer when time is up
    }
  }, 1000);
};

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const checkAnswer = () => {
  clearInterval(timer); // ✅ Stop the timer once an answer is submitted
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestion].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      document.querySelectorAll(".answer").forEach((answer) => {
        if (answer.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) {
          answer.classList.add("correct");
        }
      });
    }
  } else {
    document.querySelectorAll(".answer").forEach((answer) => {
      if (answer.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) {
        answer.classList.add("correct");
      }
    });
  }

  document.querySelectorAll(".answer").forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  clearInterval(timer); // ✅ Ensure timer resets for the next question

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion(questions[currentQuestion]);
  } else {
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});