const { Plugin } = require("powercord/entities");
const Analyser = require('./lib/PSpectrum');
const Render = require('./lib/Render.js');

module.exports = class PSpectrum extends (Plugin) {

  inject() {
    let trys = 0;

    try {

      // init & spawn PSpectrum.exe
      this.watcher = new Analyser();
      this.watcher.spawn();

      // init & spawn Render
      this.render = new Render();
      this.watcher.onData(data => this.render.drawNewFrame(data));

      console.log(`%c[PSpectrum]`, `color: lime;`, `* feeling the bass *`);

    } catch (e) {
      this?.watcher?.kill();
      this?.render?.destroy();

      console.log(`%c[PSpectrum/Error]`, `color: red;`, `Fu***! Another error: ${e}. Retrying... (fail ${trys} / 10)`);

      if (trys < 10) {
        trys++;

        let _t = setTimeout(() => {
          this.startPlugin();
          clearTimeout(_t);
        });
      }
    }
  }

  startPlugin() {
    if (document.readyState === "complete") this.inject();
    else document.addEventListener("readystatechange", () => {
      if (document.readyState !== "complete") return;
      this.inject();
    });
  }

  pluginWillUnload() {
    this.watcher.kill();
    this.render.destroy();
    console.log(`%c[PSpectrum]`, `color: lime;`, `Unloaded.`);
  }
};
