// Declare game option variables
var totalLevels = 5;
// This prevents generating a color that is too light or dark to match
var minimumColorValue = 50;
var maximumColorValue = 700;

// Declare blank variables
var level = 0;
var red = 0;
var green = 0;
var blue = 0;
var adjustedRed = 0;
var adjustedGreen = 0;
var adjustedBlue = 0;
var adjustedRGB = 'rgb(0,0,0)';
var interval, timeout;
var finalScore = 0;
var playerData = { targetRed: [], adjustedRed: [], targetGreen: [], adjustedGreen: [], targetBlue: [], adjustedBlue: [], levelScores: [] };

// Check if there is already a local high score list
if (localStorage.getItem('highscoreList') === null) {
    // If not, then create a blank one
    highscoreList = [];
}
else {
    // Otherwise, retrieve and parse it
    var retrievedList = localStorage.getItem('highscoreList');
        highscoreList = JSON.parse(retrievedList);
}

function resetGame() {
    // Reset all page positions
    document.getElementById('title-screen').style.left = '0';
    document.getElementById('summary').style.left = '100%';
    document.getElementById('final-summary').style.left = '100%';
    document.getElementById('highscores').style.left = '100%';
    document.getElementById('game-length').style.opacity = '0';
    document.getElementById('how-to-play').style.opacity = '0';
    // Reset game variables
    adjustedRed = 0;
    adjustedGreen = 0;
    adjustedBlue = 0;
    adjustedRGB = 'rgb(0,0,0)';
    adjustmentBox.innerHTML = adjustedRGB;
    adjustmentBox.parentElement.style.backgroundColor = adjustedRGB;
    finalScore = 0;
    level = 0;
    delete playerData;
    playerData = { targetRed: [], adjustedRed: [], targetGreen: [], adjustedGreen: [], targetBlue: [], adjustedBlue: [], levelScores: [] };
}

// Event handlers for title screen
var titlePlay = document.getElementById('title-play');
    titlePlay.addEventListener('click', selectGameLength);
var howTo = document.getElementById('title-howto');
    howTo.addEventListener('click', function() {
        document.getElementById('how-to-play').style.opacity = '1';
    });
// DOM elements for referencing
var levelText = document.getElementById('level');
var targetBox = document.querySelector('.target-box');
var adjustmentBox = document.querySelector('.adjustment-box span');
var submit = document.querySelector('#submit-color span');
    submit.addEventListener('click', displaySummary);
var summary = document.getElementById('summary');
var levelComplete = document.querySelector('.level-complete span');
var previousTargetColor = document.getElementById('previous-target-color');
var previousAdjustedColor = document.getElementById('previous-adjusted-color');
var hr = document.querySelector('hr');
var colorStripeContainer = document.querySelector('#final-summary .row');


// Add event listeners for all 6 color buttons
var buttons = document.querySelectorAll('.btn');
for (var i = 0; i < buttons.length; i++) {
    // Add event listeners for click events
    buttons[i].addEventListener('mousedown', function() {
        var currentButton = this.id;
        adjustColor(currentButton);

        // Stop value from increasing on mouseout
        this.addEventListener('mouseout', function() {
            window.clearTimeout(timeout);
            window.clearInterval(interval);
        });
        
        // Allow holding a button to increase the value
        timeout = window.setTimeout(function () {
            interval = window.setInterval(function() {
                adjustColor(currentButton);
            }, 30);
        }, 350);
    });
    // Add event listeners for touch events
    buttons[i].addEventListener('touchstart', function(e) {
        var currentButton = this.id;
        e.preventDefault();
        adjustColor(currentButton);
        
        // Allow holding a button to increase the value
        timeout = window.setTimeout(function () {
            interval = window.setInterval(function() {
                adjustColor(currentButton);
            }, 30);
        }, 350);
    });
    // Stop value from increasing on mouseup
    buttons[i].addEventListener('mouseup', function() {
        window.clearTimeout(timeout);
        window.clearInterval(interval);
    });
    // Stop value from increasing on touchend
    buttons[i].addEventListener('touchend', function() {
        window.clearTimeout(timeout);
        window.clearInterval(interval);
    });
}

// Allow user to select a long or short game
function selectGameLength() {
    var short = document.getElementById('game-short');
        short.removeEventListener('click', setGameLength);
        short.addEventListener('click', setGameLength);
    var long = document.getElementById('game-long');
        long.removeEventListener('click', setGameLength);
        long.addEventListener('click', setGameLength);
        long.parentNode.style.opacity = '1';
}

// Set game length based on input
function setGameLength() {
    if (this.id === 'game-short') {
        totalLevels = 5;
    }
    else if (this.id === 'game-long') {
        totalLevels = 10;
    }
    generateRGB();
    var titleScreen = document.getElementById('title-screen');
        titleScreen.style.left = '100%';
}

// Generate random RGB values for current level
function generateRGB() {
    red = random();
    green = random();
    blue = random();
    // Only use color if it is within the set threshold
    if (red + green + blue >= minimumColorValue && red + green + blue <= maximumColorValue) {
        rgb = '';
        rgb += 'rgb(' + red + ',' + green + ',' + blue + ')';
        targetBox.style.backgroundColor = rgb;
        adjustmentBox.innerHTML = adjustedRGB;
        submit.style.color = checkIfLightOrDark(red,green,blue);
        submit.style.backgroundColor = rgb;
        summary.style.left = '100%';
        level++;
        if (level >= totalLevels) {
            level = totalLevels;
            levelText.innerHTML = 'Final Level';
        }
        else {
            levelText.innerHTML = 'Level ' + level;
        }
    }
    // Otherwise re-roll colors
    else {
        generateRGB();
    }
}

// Check if color value is within valid range then add or subtract from it
function adjustColor(btn) {
    if (btn === 'red-more' && adjustedRed < 255) {
        adjustedRed++;
    }
    else if (btn === 'red-less' && adjustedRed > 0) {
        adjustedRed--;
    }
    else if (btn === 'green-more' && adjustedGreen < 255) {
        adjustedGreen++;
    }
    else if (btn === 'green-less' && adjustedGreen > 0) {
        adjustedGreen--;
    }
    else if (btn === 'blue-more' && adjustedBlue < 255) {
        adjustedBlue++;
    }
    else if (btn === 'blue-less' && adjustedBlue > 0) {
        adjustedBlue--;
    }
    else {
    }

    generateAdjustedRGB(); 
}

// Update on screen display of user adjusted color
function generateAdjustedRGB() {
    adjustedRGB = '';
    adjustedRGB += 'rgb(' + adjustedRed + ',' + adjustedGreen + ',' + adjustedBlue + ')'; 
    adjustmentBox.parentElement.style.backgroundColor = adjustedRGB;
    adjustmentBox.innerHTML = adjustedRGB;
}

// Check the generated RGB value and make overlay text light or dark to show up better
function checkIfLightOrDark(r,g,b) {
    if (r + g + b >= 320) {
        return 'rgba(0,0,0,.35)';
    }
    else {
        return 'rgba(255,255,255,.35)';
    }
}

// Show summary of the previous level with scores
function displaySummary() {
    // Slide in summary screen and display previous level colors
    summary.style.left = '0';
    levelComplete.parentNode.style.backgroundColor = rgb;
    levelComplete.innerHTML = 'Level ' + level + ' Complete!';
    // Display previous level target and user colors
    previousTargetColor.style.backgroundColor = rgb;
    previousTargetColor.nextElementSibling.innerHTML = red + ', ' + green + ', ' + blue;
    previousAdjustedColor.style.backgroundColor = adjustedRGB;
    previousAdjustedColor.nextElementSibling.innerHTML = adjustedRed + ', ' + adjustedGreen + ', ' + adjustedBlue;
    // Display user scores based on accuracy
    hr.style.backgroundColor = rgb;
    var redScore = getLevelScore(red,adjustedRed);
    document.getElementById('red-avg').innerHTML = ': &nbsp;' + redScore.toLocaleString();
    var greenScore = getLevelScore(green,adjustedGreen);
    document.getElementById('green-avg').innerHTML = ': &nbsp;' + greenScore.toLocaleString();
    var blueScore = getLevelScore(blue,adjustedBlue);
    document.getElementById('blue-avg').innerHTML = ': &nbsp;' + blueScore.toLocaleString();
    var levelScore = redScore + greenScore + blueScore;
    finalScore += levelScore;
    document.getElementById('total-level-score').innerHTML = '+' + levelScore.toLocaleString() + ' points';
    // Add button to proceed to next level or display final score
    var next = document.querySelector('#summary .submit');
        if (level >= totalLevels) {
            next.innerHTML = 'final score';
            next.removeEventListener('click', generateRGB);
            next.addEventListener('click', displayFinalSummary);
        }
        else {
            next.innerHTML = 'next level';
            next.removeEventListener('click', displayFinalSummary);
            next.addEventListener('click', generateRGB);
        }
    // Add level data to an array
    playerData.levelScores.push(levelScore);
    playerData.targetRed.push(red);
    playerData.adjustedRed.push(adjustedRed);
    playerData.targetGreen.push(green);
    playerData.adjustedGreen.push(adjustedGreen);
    playerData.targetBlue.push(blue);
    playerData.adjustedBlue.push(adjustedBlue);
}

// Take values from previous level to output player accuracy scores
function getLevelScore(target, adjusted) {
    var score = 0;
    var total = Math.abs(target - adjusted);
    switch(total) {
        case 0:
            return score = 2500;
            break;
        case 1:
            return score = 1750;
            break;
        case 2:
            return score = 1250;
            break;
        case 3:
            return score = 900;
            break;
        case 4:
            return score = 700;
            break;
        case 5:
            return score = 500;
            break;
        case 6:
            return score = 400;
            break;
        case 7:
            return score = 300;
            break;
        case 8:
            return score = 200;
            break;
        case 9:
            return score = 100;
            break;
        case 10:
            return score = 50;
            break;
        default:
            return score = 0;
            break;
    }
}

function displayFinalSummary() {
    document.getElementById('final-summary').style.left = '0';
    createColorStripe();
    listPreviousScores();
    var score = document.getElementById('final-score');
        score.innerHTML = finalScore.toLocaleString();
    // Add button to submit high score
    document.getElementById('name-input').value = '';
    var button = document.querySelector('#final-summary .submit');
        button.addEventListener('click', addToHighscores);
}

// Lookup all colors from this session and create a tiled banner with them
function createColorStripe() {
    // Reset color stripe
    colorStripeContainer.innerHTML = '';
    // Build color stripe
    for (var i = 0; i < totalLevels; i++) {
        var colorStripe = document.createElement('div');
            colorStripe.classList.add('color-stripe');
            colorStripe.style.backgroundColor = 'rgb(' + playerData.targetRed[i] + ',' + playerData.targetGreen[i] + ',' + playerData.targetBlue[i] + ')';
        colorStripeContainer.appendChild(colorStripe);
    }
}

// Lookup all previous level scores and append them to the final summary
function listPreviousScores() {
    var levelList = document.getElementById('final-list');
        levelList.innerHTML = '';
    var entry = '';
    for (var i = 0; i < playerData.levelScores.length; i++) {
        entry += '<div class="row">';
        entry += '<span class="level-list">' + 'Level ' + (i + 1) + '</span>';
        entry += '<span class="score-list">' + playerData.levelScores[i].toLocaleString() + '</span>';
        entry += '</div>';
    }
    levelList.innerHTML = entry;

}

// Add player input name to high score list and then retrieve list
function addToHighscores() {
    var name = document.querySelector('#final-summary input').value;
    var error = document.querySelector('.notification');
    if (name.length > 0 && name.length <= 20) {
        error.style.visibility = 'hidden';
        highscoreList.push({ name: name, score: finalScore });
        // Sort high score list
        highscoreList.sort( function(a,b) { return b.score - a.score; } );
        // Trim high score list if too long
        if (highscoreList.length > 8) {
            highscoreList.splice((highscoreList.length), 1);
        }
        // Add high score list to local storage
        localStorage.setItem('highscoreList', JSON.stringify(highscoreList));
        displayHighscores();
    }
    else {
        error.style.visibility = 'visible';
    }
}

// Display a list of the local high scores
function displayHighscores() {
    // Retrieve list from local storage and parse it
    var retrievedList = localStorage.getItem('highscoreList');
        highscoreList = JSON.parse(retrievedList);
    // Clear high score page
    var list = document.getElementById('highscore-list');
        list.innerHTML = '';
    // Slide in page
    var screen = document.getElementById('highscores');
        screen.style.left = '0';
    var entry = '';
    // Build high score list
    for (var i = 0; i < highscoreList.length; i++) {
        entry += '<div class="row">';
        entry += '<span class="highscore-name">' + highscoreList[i].name + '</span>';
        entry += '<span class="highscore-score">' + highscoreList[i].score.toLocaleString() + '</span>';
        entry += '</div>';
    }
    list.innerHTML = entry;
    // Add button to proceed to new game
    var button = document.querySelector('#highscores .submit');
        button.addEventListener('click', resetGame);
    var clearHighscoreList = document.querySelector('.clearlist');
        clearHighscoreList.addEventListener('click', clearHighscores);
}

// Clear high score list
function clearHighscores() {
    if (confirm('This will clear your high score list. Are you sure about this?')) {
        localStorage.removeItem('highscoreList');
        delete highscoreList;
        delete retrievedList;
        highscoreList = [];
    }
}

// Return a random value from 0 to 255
function random() {
    return Math.floor(Math.random() * 256);
}