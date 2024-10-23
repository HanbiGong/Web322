/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Hanbi Gong  // Student ID: 111932224 // Date: May 17th, 2024
*
********************************************************************************/ 

const fs = require("fs");

function analyzeFile(fileName) {
    fs.readFile(fileName, function (err, fileData) {
        if (err) {
            console.log("Error reading file: " + err.message);
            process.exit(1);  
        } else {
            let fileContent = fileData.toString().replace(/\s+/g, ' ');
            let wordsArray = fileContent.replace(/[^\w\s\']/g, "").split(' ');

            console.log("Number of Characters (including spaces): " + fileContent.length);
            console.log("Number of Words: " + wordsArray.length);

            let longestWord = '';
            for (let i = 0; i < wordsArray.length; i++) {
                if (wordsArray[i].length > longestWord.length) {
                    longestWord = wordsArray[i];
                }
            }
            console.log("Longest Word: " + longestWord);
            process.exit(0);  
        }
    });
}

function analyzeDirectory(directoryName) {
    fs.readdir(directoryName, function (err, fileArray) {
        if (err) {
            console.log("Error reading directory: " + err.message);
            process.exit(1);  
        } else {
            let sortedFiles = fileArray.sort().reverse();
            console.log("Files (reverse alphabetical order): " + sortedFiles.join(", "));
            process.exit(0);  
        }
    });
}

process.stdout.write('Do you wish to process a File (f) or directory (d): ');
process.stdin.once('data', function(data) {
    let input = data.toString().trim().toUpperCase();
    if (input === 'F') {
        process.stdout.write('File: ');
        process.stdin.once('data', function(fileName) {
            console.log('TODO: Process file ' + fileName.toString().trim());
            analyzeFile(fileName.toString().trim());
        });
    } else if (input === 'D') {
        process.stdout.write('Directory: ');
        process.stdin.once('data', function(directoryName) {
            console.log('TODO: Process directory ' + directoryName.toString().trim());
            analyzeDirectory(directoryName.toString().trim());
        });
    } else {
        console.log("Invalid selection.");
        process.exit(1);  
    }
});
