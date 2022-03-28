/**
 * @module Utilities
 * @description Includes all utility functions across the app.
 */
//***---- IMPORTS ----***//


//----------------------------------------------------------------------------------
// UTILITIY FUNCTIONS
//----------------------------------------------------------------------------------


/**
 * Create a new HTML tag
 * @function
 * @param {String} elementType 
 * @param {String} attributeName 
 * @param {*} attributeValue 
 * @param {Array} classes 
 * @param {String} ObjectId 
 * @param {String} text 
 * @returns {HTMLElement} new element
 */
export function createTag(elementType, attributeName, attributeValue, classes, ObjectId, text) {
    let element = document.createElement(elementType);
    setTag(element, attributeName, attributeValue, classes, ObjectId, text);
    return element;
}

/**
 * Convert text into id - remove unwanted characters
 * @function
 * @param {String} value 
 * @param {Boolean} lowerCase 
 * @returns {String} new ID
 */
export function textToHTMLattribute(value, lowerCase = false) {
    let filter = new RegExp('[^a-zA-Z0-9/_-]', 'g'); //Match all characters except letters, numbers, "-", "_"
    let unwanted = value.match(filter);
    let id = value;
    if (unwanted !== null) {
        for (let char of unwanted) {
            id = id.replace(char, "");
        }
    }
    if (lowerCase) id = id.toLowerCase();
    return id;
}


/**
 * Set tag's attributes, classes, id
 * @function
 * @param {HTMLElement} element 
 * @param {String} attributeName 
 * @param {*} attributeValue 
 * @param {Array} classes 
 * @param {String} ObjectId 
 * @param {String} text 
 */
export function setTag(element, attributeName, attributeValue, classes, ObjectId, text) {
    if (attributeName !== undefined) {
        for (let i = 0; i < attributeName.length; i++) {
            element.setAttribute(textToHTMLattribute(attributeName[i], true), attributeValue[i]);
        }
    }
    if (classes !== undefined) {
        for (let i = 0; i < classes.length; i++) {
            element.className += " " + textToHTMLattribute(classes[i]);
        }
    }
    if (ObjectId !== undefined) {
        element.id = textToHTMLattribute(ObjectId);
    }

    if (text !== undefined) {
        let textnode = document.createTextNode(text);
        element.appendChild(textnode);
    }
}

/**
 * Remove all items from a parent
 * @function
 * @param {HTMLElement} category 
 */
export function clearList(category) {
    if (category) {
        while (category.firstChild) {
            category.removeChild(category.firstChild);
        }
    }
}

/**
 * Generate an MDC select dropdown
 * @function
 * @param {Object} jsonObj - object with name and options {name:<name>, options:[]}
 * @param {*} parent 
 * @returns mdc select item
 */
export function addSelectTemplate(jsonObj, parent) {

    parent.querySelector(".mdc-floating-label").innerText = jsonObj.name;
    const mdclist = parent.querySelector(".mdc-list");
    for (let option of jsonObj.options) {
        const listItemTemplate = document.querySelector("#select-list-item").content.cloneNode(true);
        const listItem = listItemTemplate.querySelector("li");
        listItem.setAttribute("data-value", option);
        listItem.querySelector(".mdc-list-item__text").innerText = option;
        mdclist.appendChild(listItem);
    }
    let select = new mdc.select.MDCSelect(parent);



    return select;
}

/**
 * Convert to data url
 * @function
 * @param {String} url 
 * @returns {string}
 */
export async function toDataURL(url) {
    let promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
    let result = await promise;
    let textresult = result.toString();
    return textresult;
}


/**
 * Convert canvas element to data url
 * @function
 * @param {String} src - source image
 * @param {Function} callback 
 * @param {*} outputFormat 
 */
export function canvastoDataURL(src, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
}

export function getElementIndex(array, element) {
    let index = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == element.id) {
            index = i;
        }
    }
    return index;
}

export function loadCursor() {
    document.body.style.cursor = 'wait';
}
export function restoreCursor() {
    document.body.style.cursor = 'default';
}

/**
 * Get file from local directory
 * @function
 * @async
 * @param {String} url 
 */
export async function readFromLocalFile(url) {
    const filetext = await fetch(url)
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            return data;
        })

    return filetext;
}
/**
 * Capitalize first letter of string
 * @function
 * @param {String}
 * @returns new string
 */
export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Check if string has white spaces
 * @param {String} s 
 * @returns 
 */
export function hasWhiteSpace(s) {
    return /\s/g.test(s);
}
/**
 * Convert Mongo _id to formatted string
 * @param {*} id 
 * @returns 
 */
export function DateTimeFormat(id) {
    let timestamp = id.toString().substring(0, 8);
    let d = new Date(parseInt(timestamp, 16) * 1000);
    // let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    // let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    // let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    // let time = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric', second: 'numeric',hour12: false }).format(d);
    // return `${da}-${mo}-${ye} ${time}`;
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() +
        " " + d.getHours() +
        ":" + d.getMinutes() +
        ":" + d.getSeconds();

}
/**
 * Converts integer to HEX number
 * @param {*} c 
 * @returns 
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
/**
 *Convert RGB color values to hex
 * @param {*} r red as integer
 * @param {*} g green as integer
 * @param {*} b blue as integer
 * @returns 
 */
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
/**
 * Converts a string describing an RGB value
 * @param {*} colorString the string with RGB values, comma separated
 * @returns 
 */
export function userDataColorToHex(colorString) {
    let r = parseInt(colorString.split(',')[0]);
    let g = parseInt(colorString.split(',')[1]);
    let b = parseInt(colorString.split(',')[2]);
    return rgbToHex(r, g, b);
}

/**
 * Function to remove any special characters
 * @param {*} val 
 * @returns value with any spaces, fullstops, brackets and colons removed
 */
export const removeSpecialChars = (val) => val.replace(/[\s.\(\);]/g, '');

/**
* Simple function to add an array (used with Array.reduce())
* @param {*} previousValue - previous array value from reduce function
* @param {*} currentValue - current array value from reduce function
* @returns 
*/
export const addArray = (previousValue, currentValue) => previousValue + currentValue;


/**
 * Function to format and round number values
 * @param {*} number - number
 * @param {*} locale - 'country locale string'
 * @returns - number string formatted to locale & rounded
 */
export const formatNumber = (number, locale) => Math.round(number).toLocaleString(locale || navigator.language);

export const squareMetersToAcres = (number) => number * 0.000247105;
export const feetToMiles = (number) => number * 0.000189394;

export function UnitPerUnitysystem(system, type) {
    let unit;
    switch (system) {
        case "imperial":
            switch (type) {
                case "area":
                    unit = "sq.ft";
                    break;
                case "volume":
                    unit = "c.ft";
                    break;
                case "length":
                    unit = "ft";
                    unit
                    break;
            }
            break;
        case "metric":
            switch (type) {
                case "area":
                    unit = "sq.m"
                    break;
                case "volume":
                    unit = "c.m"
                    break;
                case "length":
                    unit = "m"
                    break;
            }
            break;
    }
    return unit;
}


