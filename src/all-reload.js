var id = "all-reload";

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log(`${id} item created successfully`);
  }
}

function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true });
}

function getExtensionInfo() {
  return {
    id: id,
    title: browser.i18n.getMessage("menuItemReload"),
    contexts: ["all"],
  };
}

function reloadAll(info) {
  switch (info.menuItemId) {
    case id:
      getCurrentWindowTabs().then((tabs) => {
        for (var i = 0; i < tabs.length; i++) {
          browser.tabs.reload(tabs[i].id, { bypassCache: false });
        }
      });
      break;
  }
}

// Export for tests
if (typeof module !== "undefined") {
  module.exports = {
    onCreated,
    getCurrentWindowTabs,
    getExtensionInfo,
    reloadAll,
  };
}

// Set functions to windows object for extension
if (typeof window !== "undefined") {
  window.onCreated = onCreated;
  window.getExtensionInfo = getExtensionInfo;
  window.reloadAll = reloadAll;
}
