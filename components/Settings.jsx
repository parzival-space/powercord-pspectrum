const { React } = require('powercord/webpack');
const { SliderInput, SwitchItem } = require('powercord/components/settings');

const Settings = ({ getSetting, updateSetting }) => {
  return (
    <div>
      <SliderInput
        note="Sets the multiplier of the visualizer. Higher numbers mean higher responsiveness."
        required={true}
        minValue={1}
        maxValue={20}
        defaultValue={4}
        initialValue={getSetting('visualizerResponsiveness', 4)}
        markers={[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]}
        stickToMarkers={true}
        onValueChange={value => updateSetting('visualizerResponsiveness', value)}
      >
        Visualizer Responsiveness
      </SliderInput>
      <SwitchItem
        note="Log current audio array to console. May cause lag!"
        value={getSetting('visualizerReport', false)}
        onChange={value => updateSetting('visualizerReport', value)}
      >
        Debug: Log Audio Array
      </SwitchItem>
    </div>
  );
};

module.exports = Settings;
