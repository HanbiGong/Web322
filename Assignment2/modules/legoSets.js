const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            sets = setData.map(setElement => {
                const theme = themeData.find(themeElement => themeElement.id === setElement.theme_id);
                if (theme) {
                    return { ...setElement, theme: theme.name };
                } else {
                    return { ...setElement, theme: "Unknown" }; 
                }
            });
            resolve();
        } catch (error) {
            reject("Initialization failed: " + error.message);
        }
    });
}

function getAllSets() {
    return new Promise((resolve) => {
        resolve(sets);
    });
}

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const foundSet = sets.find(s => s.set_num === setNum);
        if (foundSet) {
            resolve(foundSet);
        } else {
            reject(`Unable to find set with number ${setNum}`);
        }
    });
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const foundSets = sets.filter(s => s.theme.toLowerCase().includes(theme.toLowerCase()));
        if (foundSets.length > 0) {
            resolve(foundSets);
        } else {
            reject(`Unable to find sets matching theme ${theme}`);
        }
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };
