const {
  onCreated,
  getCurrentWindowTabs,
  getExtensionInfo,
  reloadAll,
} = require("../src/all-reload");

describe("all-reload.js", () => {
  beforeEach(() => {
    global.browser = {
      runtime: {
        lastError: null,
      },
      tabs: {
        query: jest.fn(),
        reload: jest.fn(),
      },
      i18n: {
        getMessage: jest.fn(),
      },
    };

    jest.clearAllMocks();
  });

  describe("onCreated", () => {
    test("logs success message when no error", () => {
      console.log = jest.fn();
      browser.runtime.lastError = null;

      onCreated();

      expect(console.log).toHaveBeenCalledWith(
        "all-reload item created successfully",
      );
    });

    test("logs error message when lastError exists", () => {
      console.log = jest.fn();
      browser.runtime.lastError = "some error";

      onCreated();

      expect(console.log).toHaveBeenCalledWith("Error: some error");
    });
  });

  describe("getCurrentWindowTabs", () => {
    test("calls browser.tabs.query with currentWindow true", () => {
      browser.tabs.query.mockResolvedValue([]);

      getCurrentWindowTabs();

      expect(browser.tabs.query).toHaveBeenCalledWith({ currentWindow: true });
    });
  });

  describe("getExtensionInfo", () => {
    test("returns expected extension info object", () => {
      browser.i18n.getMessage.mockReturnValue("Reload All");

      const info = getExtensionInfo();

      expect(info).toEqual({
        id: "all-reload",
        title: "Reload All",
        contexts: ["all"],
      });
      expect(browser.i18n.getMessage).toHaveBeenCalledWith("menuItemReload");
    });
  });

  describe("reloadAll", () => {
    test("reloads all tabs when menuItemId matches", async () => {
      const tabs = [{ id: 1 }, { id: 2 }, { id: 3 }];
      browser.tabs.query.mockResolvedValue(tabs);

      await reloadAll({ menuItemId: "all-reload" });

      expect(browser.tabs.reload).toHaveBeenCalledTimes(3);
      expect(browser.tabs.reload).toHaveBeenCalledWith(1, {
        bypassCache: false,
      });
      expect(browser.tabs.reload).toHaveBeenCalledWith(2, {
        bypassCache: false,
      });
      expect(browser.tabs.reload).toHaveBeenCalledWith(3, {
        bypassCache: false,
      });
    });

    test("does nothing when menuItemId does not match", async () => {
      await reloadAll({ menuItemId: "other-id" });

      expect(browser.tabs.query).not.toHaveBeenCalled();
      expect(browser.tabs.reload).not.toHaveBeenCalled();
    });
  });
});
