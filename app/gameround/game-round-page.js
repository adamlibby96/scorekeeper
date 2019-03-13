const BrowseViewModel = require("./game-round-view-model");
const labelModule = require("tns-core-modules/ui/label/label");
const observableModule = require("tns-core-modules/data/observable");
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout/grid-layout");
const TextField = require("tns-core-modules/ui/text-field/text-field");
const dialogs = require("tns-core-modules/ui/dialogs");
/**
 * Game has:
 * id,
 * name,
 * isComplete,
 * list of people,
 * list of rounds
 *
 *
 * Person has:
 * id,
 * name (optional)
 *
 *
 *
 * Round has:
 * roundNum,
 * list of players
 *
 *
 * Player has:
 * person,
 * comment,
 * roundScore,
 * gameScore
 *
 *
 *
 *
 *
 *
 *
 *
 */

var roundNumber;

function onNavigatingTo(args) {
  const component = args.object;
  roundNumber = 0;
  component.bindingContext = new BrowseViewModel();
}

function onTitleLoaded(args) {
  const titlelabel = args.object;
  titlelabel.text =
    global.currentGame.title + ": Round " + (global.currentRound + 1);
  console.log(global.currentGame.title);
}
exports.onTitleLoaded = onTitleLoaded;

function endGame(args) {
  const button = args.object;
  const page = button.page;
  

  global.gameOver();
  page.frame.navigate("home/home-items-page");
}

function goToHome(args) {
  args.object.page.frame.navigate("home/home-items-page");
}
exports.goToHome = goToHome;

function goToSettings(args) {
  args.object.page.frame.navigate("settings/settings-page");
}
exports.goToSettings = goToSettings;

function goToInfo(args) {
  args.object.page.frame.navigate("info/info-page");
}
exports.goToInfo = goToInfo;



function startOver(args) {
  global.restartCurrentGame();
  args.object.page.frame.navigate("gameround/game-round-page");
}
exports.startOver = startOver;

exports.endGame = endGame;

const labelStyle =
  "float: left; font-size: 14px;  padding: 12px; overflow: auto; width: 50%;";

function populatePlayers(args) {
  const list = args.object;
  const page = list.page;
  list.removeChildren();
  var size = global.currentGame.players.length;
  console.log(size);
  for (var i = 0; i < size; i++) {
    var player = global.currentGame.players[i];
    var grid = new GridLayout.GridLayout();
    grid.rows = "auto";
    grid.columns = "* * * *";

    var idAndName = new labelModule.Label();
    idAndName.text = player.person.id + 1 + ": " + player.person.name;
    idAndName.style = labelStyle;
    idAndName.textWrap = true;
    idAndName.row = "0";
    idAndName.col = "0";

    var tf = new TextField.TextField();
    tf.hint = "score";
    tf.id = i;

    if (player.roundScore[global.currentRound] != undefined) {
      tf.text = player.roundScore[global.currentRound];
      tf.editable = false;
    }

    tf.row = "0";
    tf.col = "1";
    tf.keyboardType = "number";
    tf.returnKeyType = "done";
    tf.addEventListener(
      TextField.TextField.returnPressEvent,
      args => {
        var tf = args.object;

        global.updateRoundScoreForPlayer(tf.id, parseInt(tf.text));
      },
      tf
    );

    var comment = new TextField.TextField();
    comment.hint = "Comments";
    comment.id = i;

    if (player.comment[global.currentRound] != undefined) {
      comment.text = player.comment[global.currentRound];
      comment.editable = false;
    }

    comment.row = "0";
    comment.col = "2";

    comment.returnKeyType = "done";
    comment.addEventListener(
      TextField.TextField.returnPressEvent,
      args => {
        var tf = args.object;

        global.updateRoundCommentForPlayer(tf.id, tf.text);
      },
      comment
    );

    var totalScore = new labelModule.Label();
    totalScore.style = labelStyle;
    totalScore.textWrap = true;
    totalScore.row = "0";
    totalScore.col = "3";
    var s = 0;

    totalScore.text = player.person.totalScore;

    grid.addChild(idAndName);
    grid.addChild(tf);
    grid.addChild(comment);
    grid.addChild(totalScore);
    list.addChild(grid);
  }
}

exports.populatePlayers = populatePlayers;

function goToNextRound(args) {
  var page = args.object.page;

  global.currentRound++;
  page.frame.navigate("gameround/game-round-page");
}
exports.goToNextRound = goToNextRound;

function goToPrevRound(args) {
  var page = args.object.page;
  if (global.currentRound > 0) {
    global.currentRound--;
  } else {
    console.log("no prev round");
  }
  page.frame.navigate("gameround/game-round-page");
}

exports.goToPrevRound = goToPrevRound;

function promptForName(args) {
  var button = args.object;
  var page = button.page;

  var vm = new observableModule.Observable();
  dialogs
    .prompt({
      title: "Enter Player's Name",
      okButtonText: "Add",
      cancelButtonText: "Cancel",
      inputType: dialogs.inputType.text
    })
    .then(r => {
      if (r.result) {
        //var person = new Person(r.text);
        var list = page.getViewById("peopleList");
        var label = new labelModule.Label();
        label.text = r.text;
        list.addChild(label);
        //this.game.addPerson(person);
      }
    });

  page.bindingContext = vm;
}

function generatePeople(args) {
  const textField = args.object;
  const page = textField.page;
  const list = page.getViewById("peopleList");
  var vm = new observableModule.Observable();

  console.log("About to create " + textField.text + " people");
  for (var i = 0; i < parseInt(textField.text); i++) {
    global.createPerson("", i);

    var grid = new GridLayout.GridLayout();
    grid.backgroundColor = "#F8F8FF";
    grid.borderWidth = "2";
    grid.borderColor = "black";
    grid.padding = "4";
    grid.marginTop = "2";
    grid.rows = "auto";
    grid.columns = "* *";

    var label = new labelModule.Label();
    label.text = i + 1;
    label.row = "0";
    label.col = "0";

    var tf = new TextField.TextField();
    tf.hint = "Name (optional)";
    tf.row = "0";
    tf.col = "1";
    tf.id = i;
    tf.returnKeyType = "done";
    tf.addEventListener(
      TextField.TextField.returnPressEvent,
      args => {
        var tf = args.object;
        //console.log(tf.id);
        //console.log(tf.text);
        global.setPersonName(parseInt(tf.id), tf.text);
      },
      tf
    );

    grid.addChild(label);
    grid.addChild(tf);
    list.addChild(grid);
    console.log("added child: " + i);
  }

  page.bindingContext = vm;
}

function createGame(args) {
  const button = args.object;
  const page = button.page;
  var gameNameTF = page.getViewById("gametitle");
  global.createGame(gameNameTF.text);
}

exports.createGame = createGame;

exports.generatePeople = generatePeople;

exports.promptForName = promptForName;

exports.onNavigatingTo = onNavigatingTo;
