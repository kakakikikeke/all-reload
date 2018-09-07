function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("all-reload item created successfully");
  }
}

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

browser.menus.create({
  id: "all-reload",
  title: browser.i18n.getMessage("menuItemReload"),
  contexts: ["all"]
}, onCreated);

browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "all-reload":
      getCurrentWindowTabs().then(tabs => {
        for(var i=0; i<tabs.length; i++){
          browser.tabs.reload(tabs[i].id, {bypassCache: false});
        }
      });
      break;
  }
});
