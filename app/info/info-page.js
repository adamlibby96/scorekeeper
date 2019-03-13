const BrowseViewModel = require("./info-view-model");

function onNavigatingTo(args) {
    const component = args.object;
    component.bindingContext = new BrowseViewModel();
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

exports.onNavigatingTo = onNavigatingTo;
