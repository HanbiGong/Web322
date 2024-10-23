/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Hanbi Gong Student ID: 111932224 Date: 2024-06-13
*
*  Published URL: a3-brown.vercel.app
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Assignment 2: Hanbi Gong - 111932224');
});

app.get("/lego/sets", async (req, res) => {
    try {
        const sets = await legoData.getAllSets();
        res.json(sets);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get("/lego/sets/id-demo", async (req, res) => {
    try {
        const set = await legoData.getSetByNum("001-1");
        res.json(set);
    } catch (err) {
        res.status(404).send(err);
    }
});

app.get("/lego/sets/theme-demo", async (req, res) => {
    try {
        const sets = await legoData.getSetsByTheme("tech");
        res.json(sets);
    } catch (err) {
        res.status(404).send(err);
    }
});

legoData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port: ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize data:", err);
    });
