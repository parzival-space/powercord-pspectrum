# PSpectrum Audio Visualizer

Adds an audio visualizer behind the user modal. <br>
This Plugin ships an executeable with it (PSpectrum.exe), wich means this plugin ony works for Windows.<br>
You can find the source for the executeable here: <a href="https://github.com/malte-linke/PSpectrum">malte-linke/PSpectrum</a>

The builds of PSpectrum get automatically pushed to this Repository using GitHub Actions.

## Installation

1. Go to your powercord plugins folder. Run ``git clone https://github.com/malte-linke/powercord-pspectrum.git``
2. Restart discord to fetch missing plugins.

## Styling

You can add support for your themes by modifying the styles of the #pspectrum-visualizer.<br>
For example, this code adds support for the Crearts Theme:
```css
#pspectrum-visualizer {
  z-index: 0 !important;
  border-radius: var(--radius-primary);
}
```

## Demo

<img src="https://i.imgur.com/vbEoXAm.gif">

<img src="https://i.imgur.com/jOZhMS2.gif">
