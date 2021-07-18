const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("./lib/Injector");

// import settings component
const Settings = require("./components/Settings");

module.exports = class PSpectrum extends (Plugin) {

  startPlugin() {
    // register settings
    powercord.api.settings.registerSettings('pspectrum', {
      category: this.entityID,
      label: 'PSpectrum',
      render: Settings
    });


    // injects the plugin
    inject(
      this,
      () => console.log(`%c[PSpectrum/Info]`, `color: lime;`, `Successfully injected PSpectrum!`),
      (f) => console.log(`%c[PSpectrum/Failed]`, `color: red;`, `Failed to inject PSpectrum: ${f}. Retrying...`)
    );
  }

  pluginWillUnload() {
    // uninjects the plugin
    uninject();

    // unregister settings tab
    powercord.api.settings.unregisterSettings('pspectrum');
  }
};
