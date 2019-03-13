const HomeItemsViewModel = require("./home-items-view-model");
const labelModule = require("tns-core-modules/ui/label/label");
const observableModule = require("tns-core-modules/data/observable");
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout/grid-layout");
const TextField = require("tns-core-modules/ui/text-field/text-field");
const dialogs = require("tns-core-modules/ui/dialogs");

const labelStyle =
  "text-align: center; font-size: 18px;  padding: 12px; overflow: auto; width: 100%;";

function onNavigatingTo(args) {
  const component = args.object;
  component.bindingContext = new HomeItemsViewModel();
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

function populatePastGames(args) {
  const list = args.object;
  global.loadGames();
  var games = global.allGames;
  if (games == undefined || games == []) {
    var label = new labelModule.Label();
    label.text = "No Games found!";
    label.style = labelStyle;
    list.addChild(label);
  } else {
    var count = games.length;
    for (var i = 0; i < count; i++) {
      var label = new labelModule.Label();
      label.text = games[i].title;
      label.style = labelStyle;
      label.borderColor = "black";
      label.borderBottomWidth =  "2px";
      label.id = i;
      //console.log(games[i]);
      label.on("tap", (args) => {
        var msg = "";
        var id = args.object.id;
        global.allGames[id].players.forEach(player => {
          msg += player.person.id + ": " +player.person.name + ", Total: " + player.person.totalScore + "\n";
        });
        dialogs.alert({
          title: global.allGames[id].title,
          message:  msg,
          okButtonText: "Okay"
        }).then(() => {
          console.log("Closed popup");
        });
      });
      list.addChild(label);
    }
  }
}
exports.populatePastGames = populatePastGames;

function onItemTap(args) {
  const view = args.view;
  const page = view.page;
  const tappedItem = view.bindingContext;

  page.frame.navigate({
    moduleName: "home/home-item-detail/home-item-detail-page",
    context: tappedItem,
    animated: true,
    transition: {
      name: "slide",
      duration: 200,
      curve: "ease"
    }
  });
}

function goToCreateEvent(args) {
  const button = args.object;
  const page = button.page;
  page.frame.navigate("creategame/create-game-page");
}

exports.goToCreateEvent = goToCreateEvent;

exports.onItemTap = onItemTap;
exports.onNavigatingTo = onNavigatingTo;
