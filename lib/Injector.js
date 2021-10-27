const Analyser = require("./PSpectrum");
const Render = require("./Render.js");
const Hotkey = require("./Hotkey");

// prepare reload hotkey
let reloadHotkey = new Hotkey("V", false, true, true);

// trys to inject the plugin into discord
function inject(plugin, success = null, error = null) {
  if (plugin === undefined) return; //TODO: fix this bug

  // get buffer size
  let bufferSize = plugin?.settings?.get("bufferSize", 60) ?? 60;
  console.log(`[Injector] Buffer size: ${bufferSize}`);
  try {
    // init & spawn PSpectrum.exe
    this.watcher = new Analyser();
    this.watcher.spawn(bufferSize);

    // init & spawn Render
    this.render = new Render(plugin);
    this.watcher.onData((data) =>
      // check if buffer size has changed

      this.render.drawNewFrame(
        data,
        plugin.settings?.get("manualTheming", true),
        false
      )
    );

    // success callback
    if (success) success();
  } catch (e) {
    // kill watcher and render instance
    this?.watcher?.kill();
    this?.render?.destroy();

    // error callback
    if (error) error(e.message);

    setTimeout(() => inject(success, error), 1000);
  }

  // register reload hotkey listener
  reloadHotkey.once("up", () => {
    if (!plugin.settings?.get("secretReloadKey", false)) return;

    uninject();
    inject(plugin, success, error);

    // send powercord toast message
    
  });
}

// uninjects the plugin from discord
function uninject() {
  this.watcher.kill();
  this.render.destroy();
}

module.exports = { inject, uninject };