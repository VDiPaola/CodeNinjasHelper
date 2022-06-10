import {Dictionary, tags} from "../dictionary";
import {Editor} from "./Editor";
import { elementBuilder } from "./Helpers";



export class Intellisense {
    constructor(){
        //create container div
        this.container = document.createElement("div");
        this.container.className = "CodeNinjasHelper";
        document.body.appendChild(this.container);


        //get offset position of the editor
        const rect = document.getElementsByClassName("ace_text-input")[0].getBoundingClientRect();
		this.offsetX = rect.x;
		this.offsetY = rect.top;

        
        this.caseSensitive = true; //case sensitive for checking intellisense (false not currently implemented properly)
        this.currentlySelectedKey = null; //currently selected Dictionary key
        this.currentlySelectedIndex = 0;
    }

    onUpArrow(){
        if(this.currentlySelectedIndex > 0){
            this.currentlySelectedIndex--;
            this.updateSelected();
            this.updateScroll();
        }
    }

    onDownArrow(){
        if(this.currentlySelectedIndex < this.container.children.length - 1){
            this.currentlySelectedIndex++;
            this.updateSelected();
            this.updateScroll();
        }
    }

    updateScroll(){
        //update scroll
        this.container.scrollTop = this.container.children[this.currentlySelectedIndex].getBoundingClientRect().top - 
        (this.container.children[this.currentlySelectedIndex].offsetHeight * 3) - this.container.getBoundingClientRect().top;
    }

    updateSelected(){
        //clear all selected
        let el = this.container.querySelector(".selected");
        if(el){ el.remove(); }
        //select current
        let parentEl = this.container.children[this.currentlySelectedIndex]
        let newSpan2 = document.createElement("span");
        newSpan2.classList.add("selected");
        newSpan2.innerText = "Press Enter or Tab";
        parentEl.appendChild(newSpan2);

    }

    show(cursorPos, textAreaEl){
        if(this.container.children.length > 0){
            //position container
            const rect = textAreaEl.getBoundingClientRect();
            this.container.style.top = ((cursorPos.row + 1) * rect.height) + this.offsetY + "px";
            this.container.style.left = ((cursorPos.column) * rect.width) + this.offsetX + "px";
            //show
            this.container.style.display = "flex";

            Editor.setCommandBindingsOn(false);
        }
    }

    hide(){
        if(this.container.children.length > 0){
            //clear and hide div
            this.container.innerHTML = "";
            this.container.style.display = "none";
            //reset selected
            this.currentlySelectedIndex = 0;
            
            Editor.setCommandBindingsOn(true);
        }
    }

    isVisible(){
        return this.container.style.display !== "none";
    }

    check = (curWord, cursorPos, textAreaEl) => {
        this.hide();


        //lookup word in dictionary
        const keys = Object.keys(Dictionary);
        for(let key of keys){
            let startsWith = this.caseSensitive ? key.startsWith(curWord) : key.toLowerCase().startsWith(curWord.toLowerCase());
            if(startsWith){
                const value = this.filterDictValue(Dictionary[key]);
                if(!curWord.includes(value)){
                    this.append(key, curWord.length, textAreaEl, value);
                }
            }
        }

        this.show(cursorPos, textAreaEl);
    }

    append = (key, inputLength, textAreaEl, filteredValue=null) => {
        //create intellisense entry
        let newDiv = document.createElement("div");
        let newSpan = document.createElement("span");

        newSpan.textContent = key;
        newDiv.appendChild(newSpan);

        newDiv.setAttribute("value", key);
        newDiv.setAttribute("inputLength", inputLength);

        //submit on click
        newDiv.addEventListener("click", (e)=>{
            this.submit(e.target)
            textAreaEl.focus();
        });
        //select on hover
        newDiv.addEventListener("mouseover", (e)=>{
            this.currentlySelectedIndex = [...e.target.parentElement.children].indexOf(e.target);
            this.updateSelected();
        });


        //append and add class
        this.container.appendChild(newDiv);
        this.updateSelected();
    }

    filterDictValue = (value) => {
        for(let tag of tags){
            value = value.replace(tag, "");
        }
        return value;
    }


    submit = (el) => {
        //insert text in editor
        const key = el.getAttribute("value");
        let text = Dictionary[key];

        if(text){
            //get text without key in it
            const inputLength = parseInt(el.getAttribute("inputLength"));
	        text = text.slice(inputLength);
            Editor.insertText(text)
        }
        
        //hide
        this.hide();
    }

}