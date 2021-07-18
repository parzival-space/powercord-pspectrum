const Analyser = require('./PSpectrum');
const Render = require('./Render.js');

// trys to inject the plugin into discord
function inject(plugin, success = null, error = null) {
  try {
    // init & spawn PSpectrum.exe
    this.watcher = new Analyser();
    this.watcher.spawn();

    // init & spawn Render
    this.render = new Render(plugin);
    this.watcher.onData(data => this.render.drawNewFrame(data));

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
}

// uninjects the plugin from discord
function uninject() {
  this.watcher.kill();
  this.render.destroy();
}

module.exports = { inject, uninject }