const HomeItemsViewModel = require("./home-items-view-model");
const labelModule = require("tns-core-modules/ui/label/label");
const observableModule = require("tns-core-modules/data/observable");
const GridLayout = require("tns-core-modules/ui/layouts/grid-layout/grid-layout");
const TextField = require("tns-core-modules/ui/text-field/text-field");
const dialogs = require("tns-core-modules/ui/dialogs");

function onNavigatingTo(args) {
  const component = args.object;
  component.bindingContext = new HomeItemsViewModel();
}

function populatePastGames(args) {
  const list = args.object;
  global.loadGames();
  var games = global.allGames;
  if (games == undefined) {
    var label = new labelModule.Label();
    label.text = "No Games found!";
    list.addChild(label);
  } else {
    var count = games.length;
    for (var i = 0; i < count; i++) {
      var label = new labelModule.Label();
      label.text = games[i].title;
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
