const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("./lib/Injector");

// import settings component
const Settings = require("./components/Settings");

module.exports = class PSpectrum extends Plugin {
  startPlugin() {
    // register settings
    powercord.api.settings.registerSettings("pspectrum", {
      category: this.entityID,
      label: "RSpectrum",
      render: Settings,
    });

    // injects the plugin
    inject(
      this,
      () =>
        console.log(
          `%c[RSpectrum/Info]`,
          `color: lime;`,
          `Successfully injected RSpectrum!`
        ),
      (f) =>
        console.log(
          `%c[RSpectrum/Failed]`,
          `color: red;`,
          `Failed to inject RSpectrum: ${f}. Retrying...`
        )
    );
  }

  pluginWillUnload() {
    // uninjects the plugin
    uninject();

    // unregister settings tab
    powercord.api.settings.unregisterSettings("pspectrum");
  }
};