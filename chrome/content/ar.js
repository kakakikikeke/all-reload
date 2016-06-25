function reloadAllTabs () {
	var browser = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var mw = browser.getMostRecentWindow("navigator:browser");
	mw.gBrowser.reloadAllTabs();
};