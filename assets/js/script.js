// Query selector variables

var startScreen = document.querySelector('.start');
var startDiv = document.querySelector('.bored-api');
var catScreen = document.querySelector('#categories');
var quizScreen = document.querySelector('#quiz');
var timeEl = document.querySelector('.time');
var nameScreen = document.querySelector('#aquire-name');
var userName = document.querySelector('#name');
var scoresScreen = document.querySelector('.scores-page');
var funIdea = document.querySelector('#scores-idea');
var numFetch = document.querySelector('#num-fetch');
var scoreTable = document.querySelector('#show-score');
var headerEl = document.querySelector('header');

// Local variables
var currentIndex = 0;
let score = 0;

// SILVIA: ----------------------------------------------------------------------->

// Get categories element that will contain the categories
var categoriesEl = document.getElementById('categories');

function getCategories(pageNumber) {
    startScreen.classList.add('hide');
    catScreen.classList.remove('hide');
    var apiUrl = `https://opentdb.com/api_category.php`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
      

            // Determine the total number of pages based on the number of categories
            var startIdx = (pageNumber - 1) * 6;
            var endIdx = startIdx + 6;
            var displayedCategories = data.trivia_categories.slice(startIdx, endIdx);

            // Clear the categories container before adding new categories
            categoriesEl.innerHTML = "";

            // Show the categories container
            var catMessageEl = document.createElement('h2');
            catMessageEl.classList.add('title', 'has-text-weight-bold');
            catMessageEl.textContent = 'Choose a category to start the quiz';
            categoriesEl.appendChild(catMessageEl);
            for (let i = 0; i < displayedCategories.length; i++) {
                var category = displayedCategories[i];
                // console.log(category);

                var iconUrl = getIconCategory(category.id);
                // console.log(iconUrl);

                category[category.id] = {
                    name: category.name,
                    iconUrl: iconUrl
                };

                var categoryEl = document.createElement('div');
                categoryEl.classList.add('category');

                categoryEl.innerHTML = `
                    <button onClick="clickCategory(${category.id})" id="${category.id}" class="btn-cat"><img src="${category[category.id].iconUrl}" alt="${category.name} Icono"></button>
                    <br><span class="span has-text-link is-uppercase is-size-6 has-text-weight-bold">${category.name}</span>
                `;
                categoriesEl.appendChild(categoryEl);
            }

            // Create and add the pagination section
            var pagination = document.createElement('nav');
            pagination.classList.add('pagination', 'navbar', 'is-centered');
            pagination.innerHTML = `
                <ul class="pagination-list">
                    <li>
                        <a class="pagination-link ${pageNumber === 1 ? 'is-current' : ''}" 
                           aria-label="Page 1" 
                           aria-current="${pageNumber === 1 ? 'page' : ''}"
                           onclick="getCategories(1)">1</a>
                    </li>
                    <li>
                        <a class="pagination-link ${pageNumber === 2 ? 'is-current' : ''}" 
                           aria-label="Goto page 2" 
                           onclick="getCategories(2)">2</a>
                    </li>
                    <li>
                        <a class="pagination-link ${pageNumber === 3 ? 'is-current' : ''}" 
                           aria-label="Goto page 3" 
                           onclick="getCategories(3)">3</a>
                    </li>
                    <li>
                        <a class="pagination-link ${pageNumber === 4 ? 'is-current' : ''}" 
                           aria-label="Goto page 4" 
                           onclick="getCategories(4)">4</a>
                    </li>
                </ul>
            `;
            categoriesEl.appendChild(pagination);

        })
        .catch(function (error) {
            // console.log('Error:', error);
        });


}
// Function to get the URL of the icon for a category
function getIconCategory(categoryId) {
    var base = './assets/img/categories/';
    var extension = '.png';
    // Url for getting the icon of the category
    var iconoUrl = `${base}icono${categoryId}${extension}`;
    return iconoUrl;
}


// JORDAN: -----------------------------------------------------------------------> 






//---------------- Variables ----------------//
// Variables to keep//
var questionSet = $(".quiz-screen");
var question = $("<p>").attr("class", "question has-text-info-dark is-size-4 button-container");
var ulQuiz = $("<ul>")
var answerBtns = $(".option")
var answerBtn = $("<button>")
var generateToken = $("#generateToken");
var resetToekn = $("#resetToken");
var token;
var difficulty;
var category;
var questionGroup = [];
var categoryId;

//---------------- Fetch Requests ----------------//
var quizEl = document.getElementById('quiz');
function tokenFetch() {
    var requestURL = "https://opentdb.com/api_token.php?command=request"
    fetch(requestURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            token = (data.token);
            // console.log(token);
            // Create title for quiz 
            var quizMessageEl = document.createElement('h1');
            quizMessageEl.classList.add('title', 'is-italic');
            quizMessageEl.textContent = 'Answer as many questions as you can!';
            headerEl.appendChild(quizMessageEl);
            triviaFetch();
            startModal();
        })

};

//Function to fetch the trivia quiz// 
function triviaFetch() {
    // PRODUCTION TEST URL ---->>>  var requestURL = "https://opentdb.com/api.php?amount=1&category=" + 9 + "&token=" + token;
    var requestURL = "https://opentdb.com/api.php?amount=1&category=" + category + "&difficulty=" + difficulty + "&token=" + token;
    // console.log(requestURL);
    fetch(requestURL)
        .then(function (response) {
            if (!response.ok) { 
                return triviaFetch();
            }
                  return response.json();
        })
        .then(function (data) {
            var correctAnswer = (data.results[0].correct_answer);
            // console.log(data);
            questionGroup = (data.results[0].incorrect_answers);
            questionGroup.unshift(data.results[0].correct_answer);

            // Create Question <P> element with question//
            questionSet.append(question.html((data.results[0].question)).append(ulQuiz))

            // Randomize Question Output Order//
            var rndQuestionGroup = [];

            for (var i = questionGroup.length; i > 0; i--) {
                var spliceNumber = questionGroup.splice((Math.floor(Math.random() * i)), 1);
                rndQuestionGroup.push(spliceNumber[0]);
            }
            console.log(correctAnswer)
            for (var j = 0; j < rndQuestionGroup.length; j++) {
                // Create Answers <Button> elements//

                // Assign an ID to the correct question when displaying the buttons// 
                if (rndQuestionGroup[j] === correctAnswer) {
                    question.append($("<button>").html(rndQuestionGroup[j]).attr({ "class": "option button is-link is-rounded my-4", "id": "correctOption" }))
                } else {
                    question.append($("<button>").html(rndQuestionGroup[j]).attr({ "class": "option button is-link is-rounded my-4", "id": "option-" + j }))
                }
            }
        }
        );
};


//---------------- Event Listeners ----------------//
// Search form event listener //

generateToken.on("click", function (event) {
    tokenFetch();
});

questionSet.on("click", ".option", function () {
    if ($(this).attr("id") === "correctOption") {
        score++
    }

    //Show Modal Right/Wrong//
    startModal()
    //Add 5sec to timer//

    //Modal stay for 5 sec//
    secondsLeft += 5
    //Close modal and run through next functions//




    triviaFetch();
    questionGroup = [];
    console.log(score);
});





function clickCategory(categoryId) {
    var categoriesEl = document.getElementById("categories");

    categoriesEl.innerHTML = `
        <h2 class="title has-text-weight-bold">Select the difficulty level</h2>
        <div class="button-container">
            <button class="btn-dif button is-link is-rounded my-4" id="easy" data-category="${categoryId}" data-difficulty="easy">Easy</button>
            <button class="btn-dif button is-link is-rounded my-4" id="medium" data-category="${categoryId}" data-difficulty="medium">Medium</button>
            <button class="btn-dif button is-link is-rounded my-4" id="hard" data-category="${categoryId}" data-difficulty="hard">Hard</button>
        </div>
        
    `;
}

$(document).on("click", ".btn-dif", function (event) {
    event.preventDefault();
    difficulty = $(this).attr("data-difficulty");
    category = $(this).attr("data-category");
    // console.log(difficulty);
    // console.log(category);
    startQuiz();
});


function startQuiz() {
    // score = 0;
    // currentIndex = 0;
    setTimer();
    catScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    tokenFetch();
}


// BECKY: ----------------------------------------------------------------------->
function startModal() {
    let modalTimer;
    Swal.fire({

        title: "5 second delay",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff",
        backdrop: `
      rgba(0,0,123,0.4)
      url(./assets/img/giphy-2.gif)
      left top
      no-repeat
    `,
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            modalTimer = setInterval(() => {
                // timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(modalTimer);
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
    })
};

// First Bored API Fetch request
function boredFetch() {
    var requestURL = `http://www.boredapi.com/api/activity/`;

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (document.querySelector('.start-api') != undefined) {
                var indexBored1 = document.querySelector('.start-api');
                startDiv.removeChild(indexBored1);
            }
            var indexBored = document.createElement('div');
            indexBored.setAttribute('class', 'start-api');
            var fetchHtml = `<h4 class="has-text-grey subtitle is-4">${data.activity}?</h4>`;
            indexBored.innerHTML = fetchHtml;
            startDiv.appendChild(indexBored);
        })
}

function getStart() {
    boredFetch();
    startScreen.classList.remove('hide');
    catScreen.classList.add('hide');
}

// Calling function to get started
getStart();

// Setting timer/interval
var timerInterval;
var secondsLeft;

function setTimer() {
    secondsLeft = 120;

    timerInterval = setInterval(function () {
        if (secondsLeft >= 0) {
            timeEl.textContent = 'Time: ' + secondsLeft;
            secondsLeft--;
        } else {
            clearInterval(timerInterval);
            aquireName();
        }
    }, 1000)
}

// Aquire name functions
function aquireName() {
    clearInterval(timerInterval);
    startScreen.classList.add('hide');
    quizScreen.classList.add('hide');
    nameScreen.classList.remove('hide');
}

function submitBtn(event) {
    event.preventDefault();
    var userScore = {
        user: userName.value.trim(),
        score: score
    }
    // console.log(userScore);
    saveScores(userScore);
    displayScores();
}

// Display high score functions
function saveScores(userScore) {
    var savedScores = localStorage.getItem('savedScores');
    var scoresArray = [];
    if (savedScores) {
        scoresArray = JSON.parse(savedScores);
    }
    scoresArray.push(userScore);
    localStorage.setItem('savedScores', JSON.stringify(scoresArray));
}

String.prototype.toSentenceCase = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}

function getScores() {
    scoreTable.innerHTML = `
                    <tr>
                        <td class="is-size-4"><strong>Users</strong></td>
                        <td class="is-size-4"><strong>Scores</strong></td>
                    </tr>
        `;
    var savedScores = localStorage.getItem('savedScores');
    if (savedScores) {
        var scoresArray = JSON.parse(savedScores).sort((a, b) => b.score - a.score);
        for (var i = 0; i < 11; i++) {
            var tableRow = document.createElement('tr');
            tableRow.classList.add('score-row');
            if (scoresArray[i]) {
                var userName = scoresArray[i].user ? scoresArray[i].user.toSentenceCase() : 'N/A';
                var userScore = scoresArray[i].score !== undefined ? scoresArray[i].score : 'N/A';
                tableRow.innerHTML = `
                        <td>${userName}</td><td>${userScore}</td>
                    `;
                scoreTable.appendChild(tableRow);
            }
        }
    };
}

$('#reset-btn').on('click', function () {
    localStorage.removeItem('savedScores');
    $('.score-row').remove();
});

function displayScores() {
    boredFetch2();
    nameScreen.classList.add('hide');
    scoresScreen.classList.remove('hide');
    getScores();
}

// Second bored fetch request
function boredFetch2() {
    var requestURL = `http://www.boredapi.com/api/activity/`;

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            if (document.querySelector('.score-bored') != undefined) {
                var scoreBored1 = document.querySelector('.score-bored');
                funIdea.removeChild(scoreBored1);
            }
            var scoreBored = document.createElement('div');
            scoreBored.setAttribute('class', 'score-bored');
            var fetchHtml = `<p class="second-bored has-text-grey my-4 subtitle is-4"><i>${data.activity}!</i></p>`;
            scoreBored.innerHTML = fetchHtml;
            funIdea.appendChild(scoreBored);
        })
}


function playAgain() {
    scoresScreen.classList.add('hide');
    startScreen.classList.remove('hide');
    boredFetch();
    score=0
}

// Event listeners
$('#category-btn').on('click', () => { getCategories(1) });
$('#submit-name').on('click', submitBtn);
$('#back-btn').on('click', getStart);
$('#suggest-btn').on('click', boredFetch);
$('#name-btn').on('click', aquireName);
$('#play-again-btn').on('click', playAgain);







// Stash of bulma elements to add:

// Progress bar for quiz:
// `
// <progress class="progress is-success" value="60" max="100">60%</progress>
// `