const Dictionary = {
    "if": "if () {\n\t\n}",
	"else": "else {\n\t\n}",
	"function": "function name() {\n\t\n}",
}

const newEl = document.createElement("div");
newEl.className = "CodeNinjasHelper";

//starting textarea positions
let startingX = 0;
let startingTop = 0;


window.onload = ()=> {
	document.body.appendChild(newEl);

	waitForElm(".ace_text-input").then(()=>{
		const rect = document.getElementsByClassName("ace_text-input")[0].getBoundingClientRect();

		//set starting values
		if(startingX == 0){
			startingX = rect.x;
			startingTop = rect.top;
		}
	})
}

const pushInput = (el, value) => {
	el.focus()
	el.value = value
	el.setAttribute("value", value)

	// Create a new event
	var event = new Event('input', {
		bubbles: true,
		cancelable: true,
	});

	// Dispatch it.
	el.dispatchEvent(event);
}

const updateNewEl = (newLetter, textAreaEl) => {
	const rect = textAreaEl.getBoundingClientRect();

	//get column count for textarea
	const colCount = Math.floor((rect.top-startingTop) / rect.height);

	//get all lines
	const lines = document.getElementsByClassName("ace_line");

	//current line
	const curLine = lines[colCount];

	if(curLine && curLine.children.length > 0){
		//get row count for textarea
		const rowCount = Math.floor((rect.x-startingX) / rect.width);

		const rows = [];
		//get all words in row
		for(let i =0; i< curLine.children.length; i++){
			rows.push(curLine.children[i].innerText)
			if(!curLine.children[i].classList.contains("ace_paren")){
				rows.push(" ")
			}
		}
		//join words
		const curRow = rows.join("");
		
		//get current word
		const words = curRow.slice(0, rowCount).trim();
		let curWord = words.split(" ").pop();

		curWord = Dictionary.hasOwnProperty(curWord) ? curWord : curWord + newLetter;
		
		//lookup word in dictionary
		if(Dictionary.hasOwnProperty(curWord)){
			//update UI

			//position newEl
			newEl.style.top = (rect.top + rect.height) + "px";
			newEl.style.left = (rect.x + rect.width) + "px";

			//add div
			appendToNewEl(curWord,textAreaEl);

			newElShow();
		}
	}
}


const newElHide = () => {
	newEl.style.display = "none";
	newEl.innerHTML = "";
}

const newElShow = () => {
	//show intellisense div
	newEl.style.display = "flex";
	
}

const appendToNewEl = (curWord, textAreaEl) => {
	//create intellisense entry
	let newDiv = document.createElement("div");
	let newSpan = document.createElement("span");
	let newSpan2 = document.createElement("span");

	newSpan.textContent = curWord;
	newSpan2.textContent = Dictionary[curWord];
	newDiv.appendChild(newSpan);
	newDiv.appendChild(newSpan2);

	newDiv.setAttribute("value", curWord);

	newDiv.addEventListener("click", (e) => {
		onIntellisenseSelect(e.target, textAreaEl);
	})

	newEl.appendChild(newDiv);
}

const onIntellisenseSelect = (selectedEl, textAreaEl) => {
	const key = selectedEl.getAttribute("value");
	//get text without key in it
	const text = Dictionary[key].slice(key.length);

	//get current indentation (# of spaces)
	const rect = textAreaEl.getBoundingClientRect();
	const rowCount = Math.floor((rect.x - startingX) / rect.width) - key.length;


	//re-format text with indentation
	const tabs = rowCount > 0 ? " ".repeat(rowCount) : "";
	const formattedText = text.split("\n").map((line, i) => i == 0 ? line : tabs + line).join("\n");

	pushToInput(textAreaEl, formattedText);
}

const pushToInput = (el, value) => {
	//push to text area
	el.focus()
	el.value = value

	// Create a new event
	var event = new Event('input', {
		bubbles: true,
		cancelable: true,
	});

	// Dispatch it.
	el.dispatchEvent(event);
}

//stop button
window.addEventListener("keydown", function(e){
	if(startingX == 0){return;}

	const el = e.target;


	//check for enter press
	if(e.code == "Enter" && newEl.style.display != "none"){
		//add code
		e.preventDefault();
		onIntellisenseSelect(newEl.children[0], el);
		newElHide();
	}else if(el.tagName == "TEXTAREA" || el.tagName == "INPUT"){
		newElHide();
		//add to intellisense
		updateNewEl(e.key, el);
	}
})

document.addEventListener("click", function(e){
	newElHide();
})



//waits for selected element to load
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}