var state = {
   questions: [
    {
      text: "What color are coffee beans before they are roasted?",
      choices: ["White", "Brown", "Green", "Orange"],
      correctChoiceIndex: 2,
    },
    {
      text: "On average, How many cups are consumed by Americans each day?",
      choices: ['100 million', '235 Million', '400 Million', '587 Million'],
      correctChoiceIndex: 2,
    },
    {
      text: "What are the two main types of coffee beans?",
      choices: ['Robusta and Augusta', 'Arabica and Aromatic', 'Caffeine and Green', 'Arabica and Robusta'],
      correctChoiceIndex: 3,
    },
    {
      text: "Where does coffee originate from?",
      choices: ['Columbia', 'Argentina', 'Hawaii', 'Ethiopia'],
      correctChoiceIndex: 3,
    },
    {
      text: "What country is the leading coffee consumer?",
      choices: ['Italy', 'United States', 'France', 'Columbia'],
      correctChoiceIndex: 1,
    }
  ],
  praises : [
    "That was correct! Pour yourself a cup!",
    "Correct. That was unBEANevable",
    "You're right! Move on!",
    "Sweet Beans! That was correct! Grind em up! "
  ],

  admonishments: [
    "Wrong. Go make some k-cup!",
    "Incorrect. Go to Ethiopia. Study up and come back!",
    "Wrong! Try finding the right answer at the bottom of your cup!"
  ],
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
  feedbackRandom: 0
};


function setRoute(state, route) {
  state.route = route;
};

function resetGame(state) {
  state.score = 0;
  state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

function answerQuestion(state, answer) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
  if (state.lastAnswerCorrect) {
    state.score++;
  }
  selectFeedback(state);
  setRoute(state, 'answer-feedback');
};

function selectFeedback(state) {
  state.feedbackRandom = Math.random();
};

function advance(state) {
  state.currentQuestionIndex++;
  if (state.currentQuestionIndex === state.questions.length) {
    setRoute(state, 'final-feedback');
  }
  else {
    setRoute(state, 'question');
  }
};


function renderApp(state, elements) {
 
  Object.keys(elements).forEach(function(route) {
    elements[route].hide();
  });
  elements[state.route].show();

  if (state.route === 'start') {
      renderStartPage(state, elements[state.route]);
  }
  else if (state.route === 'question') {
      renderQuestionPage(state, elements[state.route]);
  }
  else if (state.route === 'answer-feedback') {
    renderAnswerFeedbackPage(state, elements[state.route]);
  }
  else if (state.route === 'final-feedback') {
    renderFinalFeedbackPage(state, elements[state.route]);
  }
};


function renderStartPage(state, element) {
};

function renderQuestionPage(state, element) {
  renderQuestionCount(state, element.find('.question-count'));
  renderQuestionText(state, element.find('.question-text'));
  renderChoices(state, element.find('.choices'));
};

function renderAnswerFeedbackPage(state, element) {
  renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
  renderAnswerFeedbackText(state, element.find(".feedback-text"));
  renderNextButtonText(state, element.find(".see-next"));
};

function renderFinalFeedbackPage(state, element) {
  renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
  var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
  element.text(text);
};

function renderQuestionText(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  element.text(currentQuestion.text);
};

function renderChoices(state, element) {
  var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = currentQuestion.choices.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer" value="' + index + '" required>' +
        '<label>' + choice + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
  var html = state.lastAnswerCorrect ?
      "<h6 class='user-was-correct'></h6>" :
      "<h1 class='user-was-incorrect'></>";

  element.html(html);
};

function renderAnswerFeedbackText(state, element) {
  var choices = state.lastAnswerCorrect ? state.praises : state.admonishments;
  var text = choices[Math.floor(state.feedbackRandom * choices.length)];
  element.text(text);
};

function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
      "Next" : "How did I do?";
  element.text(text);
};

function renderFinalFeedbackText(state, element) {
  var text = "You got " + state.score + " out of " +
    state.questions.length + " questions right.";
  element.text(text);
};

// Event handlers
var PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

$("form[name='game-start']").submit(function(event) {
  event.preventDefault();
  setRoute(state, 'question');
  renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click(function(event){
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event) {
  event.preventDefault();
  var answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(state, answer);
  renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(function(event) {
  advance(state);
  renderApp(state, PAGE_ELEMENTS);
});

$(function() { renderApp(state, PAGE_ELEMENTS); });