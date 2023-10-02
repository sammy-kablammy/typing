"use strict";

// TODO add 'sequences' of commands (git add * -> git commit -> git push)
// TODO add ability to upload a .bash_history file and use recently used commands
// TODO keep track of stats, also maybe cookies

const textInputBox = document.getElementById("textInputBox");
const promptHeading = document.getElementById("prompt");
const scoreCounter = document.getElementById("scoreCounter");
const promptsList = document.getElementById("promptsList");
const customPromptsInputTextarea = document.getElementById("customPromptsInput");
const updateCustomPromptsListButton = document.getElementById("updateCustomPromptsListButton");
const typingArea = document.getElementById("typingArea");

textInputBox.addEventListener("keypress", (e) => {
    const key = e.key;
    // if (key === " ") {
    if (key === "Enter") {
        if (promptIsCorrect()) {
            incrementScoreCounter();
            displayNextRandomPrompt();
            clearTextInputBox();
        } else {
            console.log("todo: handle incorrect prompt");
        }
    }
});

function promptIsCorrect() {
    return textInputBox.value === promptHeading.innerHTML;
}

function incrementScoreCounter() {
    const currentScore = Number(scoreCounter.innerHTML);
    scoreCounter.innerHTML = currentScore + 1;
}

function clearTextInputBox() {
    // you need to set a timeout because the user's <space> keypress will come just
    // after you clear the input box
    setTimeout(() => {
        textInputBox.value = "";
    }, 1);
}

// global variables 😡😡 i know 😒😒 bruh
let allAvailablePrompts = [
    "nvim",
    "ls -ahl",
    "git status",
    "git commit",
    "git push",
    "git pull",
    "git add *",
    "git add .",
    "git add * -p",
    "git add . -p",
    "cd ~/.config",
    "nvim ~/.config",
    "nvim ~/.bashrc",
];

/**
 * all the main stuff that happens when the page loads
 */
function setup() {
    // select the first prompt
    displayNextRandomPrompt();

    // add default prompts to the custom prompts input box
    customPromptsInputTextarea.value = "";
    allAvailablePrompts.forEach((prompt) => {
        customPromptsInputTextarea.value += prompt + "\n";
    });
}

setup();

updateCustomPromptsListButton.addEventListener("click", (e) => {
    const inputtedPrompts = customPromptsInputTextarea.value.split("\n");
    allAvailablePrompts = [];
    for (let i = 0; i < inputtedPrompts.length; i++) {
        if (inputtedPrompts[i] == "") {
            continue;
        }
        allAvailablePrompts.push(inputtedPrompts[i]);
    }
    displayNextRandomPrompt();
});

/**
 * prompt the user to type a new randomly generated command
 */
function displayNextRandomPrompt() {
    const currentPrompt = promptHeading.innerHTML;
    promptHeading.innerHTML = getRandomElementIn(allAvailablePrompts, currentPrompt);
}

// Override <ctrl-w> shortcut so that you don't accidentally close the page
addEventListener("beforeunload", (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
});

/**
 * @param {string[]} list
 * @param {string[]} thingsToExclude list elements to exclude. useful for preventing successive duplicates.
 * @returns {string} an element of 'list' that is not excluded. (if list has only one element, no guarantees 🤷)
 */
function getRandomElementIn(list, thingsToExclude = []) {
    if (list.length <= 1) {
        console.error("cannot get random element of an empty list :(");
        return "[Error: attempted to get random element within empty list]";
    }
    let randIdx;
    let randElement;
    do {
        randIdx = Math.floor(Math.random() * list.length);
        randElement = list[randIdx];
    } while (thingsToExclude.includes(randElement));
    return randElement;
}

/**
 * @param {string} c
 * @return {boolean}
 */
function isAlpha(c) {
    const aCharCode = "a".charCodeAt[0];
    const zCharCode = "z".charCodeAt[0];
    const argCharCode = c.charCodeAt[0];
    if (argCharCode >= aCharCode && argCharCode <= zCharCode) {
        return true;
    }
    return false;
}
