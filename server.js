const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const path = require(`path`);

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
app.use(express.static("public"));

let Rollbar = require('rollbar')
let rollbar = new Rollbar({
  accessToken: 'fe65d44560904b76bb1810f36b9dd7f9',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

//************************************************************* 
//Hey Cam hopefully this makes finding my rollbar a bit eassier
//my additonal rollbars are located at the following endpoints:
//app.get api/robots to catch for fail to load
//app.get api/robots/shuffled to log succesful loaded of bots 
// 2 * app.post api/duel to indicate that the player won or the player lost 

app.get("/", (req, resp) => {
  resp.status(200).sendFile(path.join(__dirname, "/public/index.html"));
});

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr); //should be bots to load properly
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
    rollbar.error('failed to return the robotArr')          //rollbar
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots); 
    res.status(200).send(shuffled);
    rollbar.log('robot array successfully sent')              //rollbar
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
      rollbar.log('player lost')                              //rollbar
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
      rollbar.log('player won')                               //rollbar
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});