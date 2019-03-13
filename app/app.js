const application = require("tns-core-modules/application");
const appSettings = require("tns-core-modules/application-settings");

//application.setCssFileName("global.css");

global.allGames = [];

global.currentRound = 0;
global.currentGame = {
  title: "",
  isComplete: false,
  players: []
};

global.person = [];
global.players = [];
global.allGameSaveName = "AllGames";

global.loadGames = () => {
  //console.log(appSettings.getString(global.allGameSaveName));
  global.allGames = JSON.parse(appSettings.getString(global.allGameSaveName));
};

global.restartCurrentGame = () => {
  global.currentGame.players.forEach(player => {
    player.comment = [];
    player.roundScore = [];
    player.person.totalScore = 0;
  });
  global.currentRound = 0;
};

global.gameOver = () => {
  global.currentGame.isComplete = true;
  global.allGames = [...global.allGames, global.currentGame];
  appSettings.setString(
    global.allGameSaveName,
    JSON.stringify(global.allGames)
  );
  global.currentGame = {
    title: "",
    isComplete: false,
    players: []
  };
};

global.createGame = name => {
  global.currentGame.title = name;
  global.currentGame.isComplete = false;
  addPlayersToGame();
};

addPlayersToGame = () => {
  global.person.forEach(p => {
    var player = {
      person: p,
      comment: [],
      roundScore: []
    };
    global.currentGame.players = [...global.currentGame.players, player];
  });

  console.log("Created game called: " + global.currentGame.title);
  console.log(
    "The game has players: " + JSON.stringify(global.currentGame.players)
  );
};

global.updateRoundScoreForPlayer = (id, score) => {
  global.currentGame.players[id].roundScore[global.currentRound] = score;
  console.log(
    "Player " +
      global.currentGame.players[id].person.id +
      " received " +
      global.currentGame.players[id].roundScore[global.currentRound] +
      " points"
  );
  var sum = 0;
  for (var i = 0; i < currentRound + 1; i++) {
    sum += global.currentGame.players[id].roundScore[i];
  }
  global.currentGame.players[id].person.totalScore = sum;
};

global.updateRoundCommentForPlayer = (id, comment) => {
  global.currentGame.players[id].comment[global.currentRound] = comment;
};

global.createPerson = (name, id) => {
  console.log("Creating " + id + " person with " + name + " name");
  var person = {
    id: id,
    name: name,
    totalScore: 0
  };
  global.person = [...global.person, person];
};

global.setPersonName = (id, name) => {
  console.log("Changed person " + id + "'s name to: " + name);
  global.person[id].name = name;
  console.log(
    "Person: " + global.person[id].id + ", " + global.person[id].name
  );
};

application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
