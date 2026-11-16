const assert = require("node:assert/strict");
const { beforeEach, describe, it } = require("node:test");
const {
  onCreated,
  getCurrentWindowTabs,
  getExtensionInfo,
  reloadAll,
} = require("../src/all-reload");

let browser;

beforeEach((context) => {
  browser = {
    runtime: {
      lastError: null,
    },
    tabs: {
      query: context.mock.fn(),
      reload: context.mock.fn(),
    },
    i18n: {
      getMessage: context.mock.fn(),
    },
  };
  global.browser = browser;
});

describe("all-reload.js", () => {
  describe("onCreated", () => {
    it("logs success message when no error", (context) => {
      const log = context.mock.method(console, "log", () => {});
      browser.runtime.lastError = null;

      onCreated();

      assert.deepEqual(log.mock.calls[0].arguments, [
        "all-reload item created successfully",
      ]);
    });

    it("logs error message when lastError exists", (context) => {
      const log = context.mock.method(console, "log", () => {});
      browser.runtime.lastError = "some error";

      onCreated();

      assert.deepEqual(log.mock.calls[0].arguments, ["Error: some error"]);
    });
  });

  describe("getCurrentWindowTabs", () => {
    it("calls browser.tabs.query with currentWindow true", () => {
      browser.tabs.query.mock.mockImplementation(() => Promise.resolve([]));

      getCurrentWindowTabs();

      assert.deepEqual(browser.tabs.query.mock.calls[0].arguments, [
        { currentWindow: true },
      ]);
    });
  });

  describe("getExtensionInfo", () => {
    it("returns expected extension info object", () => {
      browser.i18n.getMessage.mock.mockImplementation(() => "Reload All");

      const info = getExtensionInfo();

      assert.deepEqual(info, {
        id: "all-reload",
        title: "Reload All",
        contexts: ["all"],
      });
      assert.deepEqual(browser.i18n.getMessage.mock.calls[0].arguments, [
        "menuItemReload",
      ]);
    });
  });

  describe("reloadAll", () => {
    it("reloads all tabs when menuItemId matches", async () => {
      const tabs = [{ id: 1 }, { id: 2 }, { id: 3 }];
      browser.tabs.query.mock.mockImplementation(() => Promise.resolve(tabs));

      await reloadAll({ menuItemId: "all-reload" });

      assert.deepEqual(
        browser.tabs.reload.mock.calls.map((call) => call.arguments),
        [
          [1, { bypassCache: false }],
          [2, { bypassCache: false }],
          [3, { bypassCache: false }],
        ],
      );
    });

    it("does nothing when menuItemId does not match", async () => {
      await reloadAll({ menuItemId: "other-id" });

      assert.equal(browser.tabs.query.mock.callCount(), 0);
      assert.equal(browser.tabs.reload.mock.callCount(), 0);
    });
  });
});
