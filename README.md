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
  --pspectrum-online-color: var(--accent-primary);
  --pspectrum-idle-color: var(--accent-primary);
  --pspectrum-dnd-color: var(--accent-primary);
  --pspectrum-invisible-color: var(--accent-primary);
}
```

### Since 1.2.0

The ``--pspectrum-color`` css variable has been splitted into four sub-variables (for each user status one: online, idle, dnd and invisible).<br>
PSpectrum still trys to use ``--spotify-color``, ``--pspectrum-color`` and ``#1ed860`` as fallback values, so your quick css and themes should still work.<br>
Now you can specify custom color for each user state:
```css
#pspectrum-visualizer {
  --pspectrum-online-color: #1ED860;
  --pspectrum-idle-color: #D8D51E;
  --pspectrum-dnd-color: #D81E1E;
  --pspectrum-invisible-color: #4F4F4F;
}
```

---

## Demo

<img src="https://i.imgur.com/1qIn0Ws.gif">
