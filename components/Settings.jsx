const { React } = require("powercord/webpack");
const {
  Category,
  SliderInput,
  SwitchItem,
  ColorPickerInput,
} = require("powercord/components/settings");

const Settings = ({ getSetting, updateSetting }) => {
  var _numberToHex = (color) => {
    const r = (color & 0xff0000) >>> 16;
    const g = (color & 0xff00) >>> 8;
    const b = color & 0xff;
    return `${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  return (
    <div>
      <SliderInput
        note="Sets the multiplier of the visualizer. Higher numbers mean higher responsiveness."
        required={true}
        minValue={1}
        maxValue={20}
        defaultValue={4}
        initialValue={getSetting("visualizerResponsiveness", 4)}
        markers={[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        ]}
        stickToMarkers={true}
        onValueChange={(value) =>
          updateSetting("visualizerResponsiveness", value)
        }
      >
        Visualizer Responsiveness
      </SliderInput>

      <SwitchItem
        note="If activated, the frequencies of the Visualizer will be centered.."
        value={getSetting("visualizerCenter", true)}
        onChange={() => updateSetting("visualizerCenter", !getSetting("visualizerCenter", true))}
      >
        Center Frequencies
      </SwitchItem>

      <SwitchItem
        note="If enabled, allows you to change the visualizer's color manually instead of using the colors managed by your theme (or quick css)."
        value={getSetting("manualTheming", false)}
        onChange={() =>
          updateSetting("manualTheming", !getSetting("manualTheming", false))
        }
      >
        Switch to manual theming
      </SwitchItem>

      <Category
        name="Design"
        description="Allows you to change the design of the visualizer. This will override the settings provided by your theme. You must have 'Switch to manual theming' enabled for this to work."
        disabled={getSetting("manualTheming", false)}
        opened={getSetting("designSettings", false) && getSetting("manualTheming", false)}
        onChange={() =>
          updateSetting("designSettings", !getSetting("designSettings", false))
        }
      >
        <ColorPickerInput
          note={"The visualizers color when your status is 'Online'."}
          onChange={(value) =>
            updateSetting("color-online", _numberToHex(value))
          }
          default={parseInt("1ed860", 16)}
          value={parseInt(getSetting("color-online", "1ed860"), 16)}
        >
          Online Color
        </ColorPickerInput>

        <ColorPickerInput
          note={"The visualizers color when your status is 'Idle'."}
          onChange={(value) => updateSetting("color-idle", _numberToHex(value))}
          default={parseInt("d8d51e", 16)}
          value={parseInt(getSetting("color-idle", "d8d51e"), 16)}
        >
          Idle Color
        </ColorPickerInput>

        <ColorPickerInput
          note={"The visualizers color when your status is 'Do not disturb'."}
          onChange={(value) => updateSetting("color-dnd", _numberToHex(value))}
          default={parseInt("d81e1e", 16)}
          value={parseInt(getSetting("color-dnd", "d81e1e"), 16)}
        >
          Do Not Disturb Color
        </ColorPickerInput>

        <ColorPickerInput
          note={"The visualizers color when your status is 'Invisible'."}
          onChange={(value) =>
            updateSetting("color-invisible", _numberToHex(value))
          }
          default={parseInt("4f4f4f", 16)}
          value={parseInt(getSetting("color-invisible", "4f4f4f"), 16)}
        >
          Invisible Color
        </ColorPickerInput>
      </Category>

      <Category
        name="Debug"
        description="Stuff that's only useful for debugging. Only the bravest of developers should use this."
        opened={getSetting("debugSettings", false)}
        onChange={() =>
          updateSetting("debugSettings", !getSetting("debugSettings", false))
        }
      >
        <SwitchItem
          note="Log current audio array to console. May cause lag!"
          value={getSetting("visualizerReport", false)}
          onChange={(value) => updateSetting("visualizerReport", value)}
        >
          Log Audio Array
        </SwitchItem>

        <div>
          Online: #{getSetting("color-online", "1ed860")}
          <br />
          Idle: #{getSetting("color-idle", "d8d51e")}
          <br />
          Do Not Disturb: #{getSetting("color-dnd", "d81e1e")}
          <br />
          Invisible: #{getSetting("color-invisible", "4f4f4f")}
        </div>
      </Category>
    </div>
  );
};

module.exports = Settings;