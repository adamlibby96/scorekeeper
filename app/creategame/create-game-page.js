const BrowseViewModel = require("./create-game-view-model");
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
 */

function onNavigatingTo(args) {
    const component = args.object;

    //this.game = new Game();

    component.bindingContext = new BrowseViewModel();
}

function promptForName(args) {
    var button = args.object;
    var page = button.page;

    var vm = new observableModule.Observable();
    dialogs.prompt({
        title: "Enter Player's Name",
        okButtonText: "Add",
        cancelButtonText: "Cancel",
        inputType: dialogs.inputType.text
    }).then((r) => {
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
    textField.editable = false;
    const page = textField.page;
    const list = page.getViewById("peopleList");
    var vm = new observableModule.Observable();

    console.log("About to create " + textField.text + " people");
    for (var i = 0; i < parseInt(textField.text); i++)
    {
        global.createPerson("", i);

        var grid = new GridLayout.GridLayout();
        grid.backgroundColor = '#F8F8FF';
        grid.borderWidth = '2';
        grid.borderColor='black';
        grid.padding='4';
        grid.marginTop='2';
        grid.rows = "auto";
        grid.columns = "* *";

        var label = new labelModule.Label();
        label.text = i+1;
        label.row = "0";
        label.col = "0";

        var tf = new TextField.TextField();
        tf.hint = "Name (optional)";
        tf.row = "0";
        tf.col = "1";
        tf.id = i;
        tf.returnKeyType = "done";
        tf.addEventListener(TextField.TextField.returnPressEvent, (args) => {
            var tf = args.object;
            //console.log(tf.id);
            //console.log(tf.text);
            global.setPersonName(parseInt(tf.id), tf.text);
        }, tf);


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
    page.frame.navigate("./gameround/game-round-page");
}

exports.createGame = createGame;


exports.generatePeople = generatePeople;

exports.promptForName = promptForName;

exports.onNavigatingTo = onNavigatingTo;
