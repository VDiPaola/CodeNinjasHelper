//waits for selected element to load
export const waitForElement = (selector) => {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(_ => {
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

//waits for selected element to load
export const waitForElements = (selector, amount) => {
    return new Promise(resolve => {
        if (document.querySelectorAll(selector).length >= amount) {
            return resolve(document.querySelectorAll(selector));
        }

        const observer = new MutationObserver(_ => {
            if (document.querySelectorAll(selector) >= amount) {
                resolve(document.querySelectorAll(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

export const elementBuilder = (tagName, elAttributes, parentEl)=>{
    //creates element and sets any attributes passed
    const el = document.createElement(tagName);
    for(let attrKey in elAttributes){
        el[attrKey] = elAttributes[attrKey];
    }
    //append to parent if exist
    if(parentEl) parentEl.appendChild(el);
    return el;
}