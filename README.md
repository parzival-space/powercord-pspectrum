# PSpectrum Audio Visualizer

Adds an audio visualizer behind the user modal. <br>
This Plugin ships an executeable with it (PSpectrum.exe), which means **this plugin only works for Windows**.<br>
You can find the source for the executeable here: <a href="https://github.com/malte-linke/PSpectrum">malte-linke/PSpectrum</a>

The builds of PSpectrum get automatically pushed to this Repository using GitHub Actions.

## Support

If you need help, please create an issue in the "Issues" tab and do not contact the powercord team. I will look into it as soon as possible.</br>
The powercord team will not give you support (this is an unsupported plugin) and we don't need to stress them out more than they already are.

## Installation

1. Go to your powercord plugins folder. Run ``git clone https://github.com/malte-linke/powercord-pspectrum.git``
2. Restart discord to fetch missing plugins.

---

## Styling

You can add support for your themes by modifying the styles of the #pspectrum-visualizer.<br>
For example, this code adds support for the <a href="https://github.com/CorellanStoma/CreArts-Discord">Crearts</a> Theme:
```css
#pspectrum-visualizer {
  z-index: 0 !important;
  border-radius: var(--radius-primary);
  --pspectrum-color: var(--accent-primary);
}
```

### Since 1.0.1

You can now recolor the visualizer using the ``--pspectrum-color`` css variable.<br>
If this variable is not set the visualizer trys to fallback to the ``--spotify-color`` variable and if nothing works the color will get set to ``#1ed860``.
Below you can see an css example to customize the visualizers color:
```css
#pspectrum-visualizer {
  --pspectrum-color: #FF0000;
}
```

---

## Demo

<img src="https://i.imgur.com/vbEoXAm.gif"><img src="https://i.imgur.com/jOZhMS2.gif">
