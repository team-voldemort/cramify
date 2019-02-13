//imported libraries
const express = require("express");
require("dotenv").config();
const massive = require("massive");
const session = require("express-session");
const socket = require("socket.io");
const app = express();
// working to this point
// const server = require('http').createServer(app)
const sharedSession = require("express-socket.io-session");
//all libraries have been installed, double check package.json
//main and proxy set up in package.json to "main":"server/server.js", "proxy":"http://localhost:4000"

//deconstruct of .env file:
const { SECRET, CONNECTION_PORT, SERVER_PORT } = process.env;
//controller imports
const qc = require("./controllers/questionsController");
const ac = require("./controllers/authController");

//Middleware
app.use(express.json());
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Socket.io initialization
const io = socket(
  app.listen(SERVER_PORT, () =>
    console.log(`Our Group Project is over ${SERVER_PORT}`)
  )
);

//
io.use(
  sharedSession(
    session({
      secret: SECRET,
      resave: false,
      saveUninitialized: false
    })
  )
);

// Socket.io Listeners
io.on("connection", socket => {
  console.log("connected to socket");

  //Join Room
  socket.on("join room", data => {
    socket.join(data.room);
    socket.handshake.session.userdata = data;
    socket.handshake.session.save();
    console.log("joined room ", data.room);
    io.to(data.room).emit("room joined", data);
  });

  // Add name to users array
  socket.on("display name", data => {
    if (socket.handshake.session.players) socket.handshake.session.players.push(data.username)
    else {
      socket.handshake.session.players = [data.username];
    }
    socket.handshake.session.save();
    console.log("room socket hit: blast", socket.handshake.session.players);
    io.to(data.room).emit(
      "display name response",
      socket.handshake.session.players
    );
  });

  // Update everyone's users arrays
  socket.on('users array changed', data => {
    io.to(data.room).emit('update users array', data.users)
  })
});

// Account Endpoints
app.post("/auth/register", ac.register);
app.post("/auth/login", ac.login);
app.post("/auth/logout", ac.logout);
app.put("/auth/edit/:id", ac.changeUser);
app.get("/auth/user", ac.getUser);
app.delete('/auth/user/delete', ac.deleteUser);

//Question_sets endpoints
app.get('/set/user', qc.getSets); //this is the users question_sets for his dashboard.
app.get('/set/all', qc.allGameSets); // this is both the user and our question_sets for the create game page
app.post('/set/user/create', qc.createNewSet); //this creates a new empty set for specific user
app.delete('/set/user/delete/:setID', qc.deleteQuestionSets); // delete sets

app.get('/set/getedit/:setID', qc.getSpecificSet); // this is to get the specific set by id to edit

//added questions to new sets per user
app.post('/set/user/question/', qc.addQuestionsToSet);

//delete specific question from users set
app.delete('/set/user/edit/delete/', qc.editQuestionDelete)

//question endpoints
app.get('/question/all', qc.getAllQuestions);

//require in db through massive, listen to server for connection
massive(CONNECTION_PORT).then(connection => {
  app.set("db", connection);
  console.log("Connected to Database");
});
