//intellisense dictionary
export const Dictionary = {
    if: "if ([cursor]) {\n\n}",
	function: "function ([cursor]) {\n\n}",
    isKeyPressed: "isKeyPressed(Keys.[cursor])",
    createTimer: "createTimer(1000,function() {\n[cursor]\n})",
}

const genericProperties = {
    x: "x([cursor])",
    y: "y([cursor])",
    speedX: "speedX([cursor])",
    speedY: "speedY([cursor])",
    scaleX: "scaleX([cursor])",
    scaleY: "scaleY([cursor])",
    width: "width([cursor])",
    height: "height([cursor])",
    opacity: "opacity([cursor])",
    visible: "visible([cursor])",
    draggable: "draggable([cursor])",
    toggleVisible: "toggleVisible()",
    toggleDraggable: "toggleDraggable()",
    rotation: "rotation([cursor])",
}

export const ObjectDictionary = {
    GO_SHAPE:{
        ...genericProperties,
    },
    GO_GROUP:{
        ...genericProperties,
    },
    GO_SCENE:{
        state: "state()",
        stopCode: "stopCode()",
    },
    STAR:{
        numPoints: "numPoints([cursor])",
    },
    CIRCLE:{
        radius: "numPoints([cursor])",
    },
    Keys:{
        rightArrow: "rightArrow",
        leftArrow: "leftArrow",
        upArrow: "upArrow",
        downArrow: "downArrow",
        space: "space",
    }
}

export const tags = ["[cursor]", "[tab]", "[highlightStart]", "[highlightEnd]"];
