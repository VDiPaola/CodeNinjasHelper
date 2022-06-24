import {Dictionary, tags, ObjectDictionary} from "../dictionary";
import {Editor} from "./Editor";



export class Intellisense {
    constructor(){
        //create container div
        this.container = document.createElement("div");
        this.container.className = "CodeNinjasHelper";
        document.body.appendChild(this.container);

        this.setContainerPos();
        
        this.caseSensitive = true; //case sensitive for checking intellisense (false not currently implemented properly)
        this.currentlySelectedKey = null; //currently selected Dictionary key
        this.currentlySelectedIndex = 0;
        this.isShiftDown = false;

        document.body.addEventListener("keydown", (e) => {
            if(e.code == "ShiftLeft" || e.code == "ShiftRight"){
                this.isShiftDown = true;
            }
        });
        document.body.addEventListener("keyup", (e) => {
            if(e.code == "ShiftLeft" || e.code == "ShiftRight"){
                this.isShiftDown = false;
            }
        });
        
    }

    setContainerPos(){
        //set starting offset position of the editor
        const rect = document.getElementsByClassName("ace_text-input")[0].getBoundingClientRect();
		this.offsetX = rect.x;
		this.offsetY = rect.top;
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
        this.container.scrollTop = (this.currentlySelectedIndex *  this.container.children[this.currentlySelectedIndex].getBoundingClientRect().height) - 
            this.container.children[this.currentlySelectedIndex].getBoundingClientRect().height
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

    show(textAreaEl){
        if(this.container.children.length > 0){
            //position container
            const rect = textAreaEl.getBoundingClientRect();
            this.setContainerPos();
            this.container.style.top = rect.height + this.offsetY + "px";
            this.container.style.left = rect.width + this.offsetX + "px";
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

    check = (curWord, objectData, textAreaEl) => {
        this.hide();

        if(objectData.word){
            this.lastObject = objectData;
        }

        const lastDotIndex = curWord.lastIndexOf('.');
        
        if(lastDotIndex  === -1 || !this.lastObject){
            //lookup word in dictionary
            const keys = Object.keys(Dictionary);
            for(let key of keys){
                //check that key starts with current word
                let startsWith = this.caseSensitive ? key.startsWith(curWord) : key.toLowerCase().startsWith(curWord.toLowerCase());
                if(startsWith && key.length >= curWord.length){
                    this.append(key, curWord.length, textAreaEl);
                }
            }
        }else{
            //get property text
            const curProperty = curWord.slice(lastDotIndex+1)
            
            //lookup word in object dictionary (word, type, displayType)
            const keys = Object.keys(this.lastObject);
            for(const objectDataKeys of keys){
                const objectKey = this.lastObject[objectDataKeys];
                if(ObjectDictionary.hasOwnProperty(objectKey)){
                    for(let key of Object.keys(ObjectDictionary[objectKey]) ){
                        const startsWith = this.caseSensitive ? key.startsWith(curProperty) : key.toLowerCase().startsWith(curProperty.toLowerCase());
                        if(curProperty.length <= 0 || startsWith && key.length >= curProperty.length){
                            this.append(key, curProperty.length, textAreaEl, objectKey);
                        }
                    }
                }
            }
            
        }

        this.show(textAreaEl);
    }

    append = (key, inputLength, textAreaEl, objectKey=null) => {
        //create intellisense entry
        let newDiv = document.createElement("div");
        let newSpan = document.createElement("span");

        newSpan.textContent = key;
        newDiv.appendChild(newSpan);

        newDiv.setAttribute("value", key);
        newDiv.setAttribute("inputLength", inputLength);
        if(objectKey){newDiv.setAttribute("objectKey", objectKey);}

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
        const objectKey = el.getAttribute("objectKey");
        let text = objectKey ? ObjectDictionary[objectKey][key] : Dictionary[key];

        if(text){
            //get text without key in it
            const inputLength = parseInt(el.getAttribute("inputLength"));
	        text = text.slice(inputLength);
            //insert text
            Editor.insertText(text)
        }
        
        //hide
        this.hide();
    }

}