const slider = document.querySelector('.slider') ;
const displayLen = document.querySelector('.display-len') ;
const upperCase = document.querySelector('#cb1') ;
const lowerCase = document.querySelector('#cb2') ;
const numbers = document.querySelector('#cb3') ;
const symbols = document.querySelector('#cb4') ;
const indicatorDiv = document.querySelector('.indicator') ;
const passwordDiv = document.querySelector('.password') ;
const copyIcon = document.querySelector('#copyIcon');
const tooltip = document.querySelector('.tooltip');
const allCheckboxes = document.querySelectorAll('input[type=checkbox]')
const allsymbols = "!#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
const submitBtn = document.querySelector('#gen-btn') ;
let passwordLength = 10;
let generatedPassword = "";




const displayPassword = () => {
    passwordDiv.innerText = generatedPassword ;
}
const displayLengthChange = () => { // this is function assignment & it has to be above function call;
    let min = slider.min;
    let max = slider.max;
    passwordLength = slider.value;
    displayLen.innerText = passwordLength ;
    slider.style.backgroundSize = `${((passwordLength-min)/(max-min)*100)}% 100%`;
}
slider.addEventListener('input' , displayLengthChange);


/*********** copying password to clipboard ***********/
const copyPassword = async () => {
    try {
        await navigator.clipboard.writeText(passwordDiv.innerText);
        tooltip.innerText = "copied!";
    }
    catch(e){
        console.log(e);
        tooltip.innerText = "failed!";
    }
    tooltip.classList.add("show");
    setTimeout(()=>{
        tooltip.classList.remove("show");
    } , 2000);
}
copyIcon.addEventListener('click' , copyPassword);
/*****************************************************/


/********** Password Strength **********/
const setIndicator = (color) => {
    indicatorDiv.style.backgroundColor = color;
    indicatorDiv.style.boxShadow = `0 0 12px 1px ${color}`;
}
const calcStrength = () => {
    let hasLower = lowerCase.checked;
    let hasUpper = upperCase.checked;
    let hasNum = numbers.checked;
    let hasSymbol = symbols.checked;
    if(hasLower && hasUpper && (hasNum || hasSymbol) && passwordLength >= 8){
        setIndicator("#7CFC00");
    }
    else if((hasLower && (hasNum || hasSymbol)) || (hasUpper && (hasNum || hasSymbol)) && passwordLength >= 6){
        setIndicator("#FFEA00");
    }
    else{
        setIndicator("#FF0000");
    }
}
/****************************************/



const generateRndInteger = (min , max) => {
    return Math.floor(Math.random()*(max-min)) + min;
}
const generateRndNumber = () => {
    return generateRndInteger(0 , 9);
}
const generateRndlowerCase = () => {
    return String.fromCharCode(generateRndInteger(97 , 123));
}
const generateRndupperCase = () => {
    return String.fromCharCode(generateRndInteger(65 , 91));
}
const generateRndSymbol = () => {
    return allsymbols.charAt(generateRndInteger(0 , allsymbols.length));
}


/* counting checked checkboxes */
const handleCheckboxChange = ()=>{
    let checkCount=0;
    allCheckboxes.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });
    // if checked boxes are more than the password length
    if(checkCount > passwordLength){
        passwordLength = checkCount ;
        displayLen.innerText = passwordLength ;
        slider.value = passwordLength ;
    }
}
allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('input' , handleCheckboxChange);
});
/*******************************/

/* generating password */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    let passwordString="";
    array.forEach((el) => {passwordString+=el});
    return passwordString;
}

const createPassword = () => {
    functionArray = [];
    generatedPassword="";
    if(lowerCase.checked){
        functionArray.push(generateRndlowerCase);
    }
    if(upperCase.checked){
        functionArray.push(generateRndupperCase);
    }
    if(numbers.checked){
        functionArray.push(generateRndNumber);
    }
    if(symbols.checked){
        functionArray.push(generateRndSymbol);
    }
    for(let i=0 ; i<functionArray.length ; i++){
        generatedPassword += functionArray[i]();
    }
    for(let i=0 ; i<(passwordLength-functionArray.length) ; i++){
        generatedPassword += functionArray[generateRndInteger(0 , functionArray.length)]();
    }
    generatedPassword = shuffle(Array.from(generatedPassword));
    passwordDiv.innerText = generatedPassword;
    calcStrength();
}
submitBtn.addEventListener('click' , createPassword);
