/********************************************************************************
*  WEB322 – Assignment 06
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ______________________ Student ID: ______________ Date: ______________
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const authData = require("./modules/auth-service");
const express = require('express');
const clientSessions = require("client-sessions");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// Setup client-sessions
app.use(clientSessions({
  cookieName: 'session', // this is the object name that will be added to 'req'
  secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
}));

// Custom middleware to add "session" to all views (res)
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware to ensure user is logged in
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
  res.render("home");
});

// About route
app.get('/about', (req, res) => {
  res.render("about");
});

// Add set route
app.get("/lego/addSet", ensureLogin, async (req, res) => {
  try {
    let themes = await legoData.getAllThemes();
    res.render("addSet", { themes: themes });
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

app.post("/lego/addSet", ensureLogin, async (req, res) => {
  try {
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

// Edit set route
app.get("/lego/editSet/:num", ensureLogin, async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    let themes = await legoData.getAllThemes();
    res.render("editSet", { set, themes });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

app.post("/lego/editSet", ensureLogin, async (req, res) => {
  try {
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

// Delete set route
app.get("/lego/deleteSet/:num", ensureLogin, async (req, res) => {
  try {
    await legoData.deleteSet(req.params.num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

// List sets route
app.get("/lego/sets", async (req, res) => {

  let sets = [];

  try {
    if(req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    }else {
      sets = await legoData.getAllSets();
    }

    res.render("sets", { sets });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

// Set details route
app.get("/lego/sets/:num", async (req, res) => {
  try {
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", { set });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

// Login routes
app.get("/login", (req, res) => {
  res.render("login", { errorMessage: "", userName: "" });
});

app.get("/register", (req, res) => {
  res.render("register", {errorMessage:"", successMessage:"", userName: ""});
});

// Registration routes
app.post('/register', (req, res) => {
  authData.registerUser(req.body).then(() => {
    res.render("register", { errorMessage: "", successMessage: "User created", userName: "" });
  }).catch((err) => {
    res.render("register", { errorMessage: err, successMessage: "", userName: req.body.userName });
  });
});

app.post("/login", (req, res) => {

  req.body.userAgent = req.get('User-Agent');

  authData.checkUser(req.body).then((user) => {

    req.session.user ={
      userName : user.userName,
      email: user.email,
      loginHistory: user.loginHistory
    }

    res.redirect('/lego/sets');
  }).catch((err) => {
    res.render("login", { errorMessage: err, userName: req.body.userName });
  });
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect('/');
});

// User history route
app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory"); // Render userHistory.ejs
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});

// Initialize and start the server
legoData.initialize().then(authData.initialize).then(() => {
  app.listen(HTTP_PORT, () => { console.log(`Server listening on: ${HTTP_PORT}`); });
}).catch(err => {
  console.log(err);
});
