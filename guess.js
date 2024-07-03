//setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Craeted By Lobna`;
// setting game options
let numbersOfTries = 6;
let numbersOfLetters = 6; 
let currentTry = 1;
let numberOfHints = 2;
// manage words
let wordToGuess = "";
const words = ["create", "update", "delete", "master", "branch", "mainly", "elzero", "school"];
wordToGuess = words[Math.floor(Math.random()* words.length)].toLowerCase();
let messageArea = document.querySelector(".message");
//manage hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput(){
    const inputsContainer = document.querySelector(".inputs");
    // create main try div
    for(let i = 1; i <= numbersOfTries; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`
        if (i !== 1) tryDiv.classList.add("disabled-inputs");
        // create inputs
        for (let j = 1; j<= numbersOfLetters; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`
            input.setAttribute("maxlength","1");
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    // focus on first input in first try element
    inputsContainer.children[0].children[1].focus();
    // disable all inputs except first one
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // convert input to upper case
        input.addEventListener("input", function(){
            this.value = this.value.toUpperCase(); 
           // console.log(index);
            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });
        input.addEventListener("keydown", function(event){
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if (event.key === "ArrowRight"){
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
        });
    });
}
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click",handleGuesses);

console.log(wordToGuess);

function handleGuesses(){
    let successGuess = true;
    for (let i =1; i <= numbersOfLetters; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
        // game logic
        if(letter === actualLetter){
            // letter is correct and in place
            inputField.classList.add("yes-in-place");
        } else if(wordToGuess.includes(letter) && letter !== ""){
            // letter is correct and not in place
            inputField.classList.add("not-in-place");
            successGuess = false;               
        } else {
            inputField.classList.add("no");
            successGuess = false;
        }
    } 
    // check if user win or lose
    if (successGuess){
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        if (numberOfHints === 2){
            messageArea.innerHTML = `<p> Congrats You Didn't Use Hints</p>`;
        }
        // add disabled class on all try divs 
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
        // disable guess button
        guessButton.disabled = true;
        getHintButton.disabled = true;
    } else{
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const cuurentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        cuurentTryInputs.forEach((input)=> (input.disabled = true)); 

        currentTry++;

        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try-${currentTry}`);
        if(el){
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        } else {
             // disable guess button
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `You Lose The Word is <span>${wordToGuess}</span>`;
        }
    }
}
function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if (numberOfHints === 0){
        getHintButton.disabled = true;
    }
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

    if (emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

        if(indexToFill !== -1){
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}
function handleBackSpace(event){
    if (event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex > 0){
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}
document.addEventListener("keydown",handleBackSpace);

window.onload = function(){
    generateInput();
};