# PSpectrum

Displays an audio visualizer behind the user modal. 

<img src="https://i.imgur.com/eiubeXY.gif" alt="Demo Image">



### Important! Read this!
This Plugin ships an executeable with it (PSpectrum.exe), which means **this plugin only works for Windows**.<br>
You can find the source for the executeable here: <a href="https://github.com/parzival-space/PSpectrum">parzival-space/PSpectrum</a>



## Installation

As Powercord has reached EOL, it is now recommendet to install this plugin using Replugged:

<a href="https://replugged.dev/install?url=parzival-space/powercord-pspectrum">
    <img src="https://img.shields.io/badge/-Install%20in%20Replugged-blue?style=for-the-badge&logo=none" alt="Install in Replugged">
</a>


<br>
<details>
    <summary>Installing in Powercord (Depricated)</summary>

1. Open your powercord plugins directory and run `git clone https://github.com/parzival-space/powercord-pspectrum.git`.
2. Restart discord to fetch missing plugins.
</details>



## Theme Support

You can add support for your themes by modifying the styles of the `#pspectrum-visualizer` class.<br>

```css
#pspectrum-visualizer {
  --pspectrum-online-color: #1ed860;    /* changes the color of the visualizer when the user is online */
  --pspectrum-idle-color: #d8d51e;      /* same as above but for idle */
  --pspectrum-dnd-color: #d81e1e;       /* same as above but for dnd */
  --pspectrum-invisible-color: #4f4f4f; /* same as above but for invisible */
}
```

If none of the above variables are found, PSpectrum will try to fallback to the following values in the following order:

  * `--pspectrum-color` (Fallback from previous versions)
  * `--spotify-color` (For users who have the Spotify plugin installed)
  * `#1ed860`



## License
[MIT](https://choosealicense.com/licenses/mit/)



## Other Plugins

Check out my other plugins:

  - [BeatRPC](https://github.com/parzival-space/powercord-beatrpc) - A more detailed Beat Saber RPC
  - [PRadio](https://github.com/parzival-space/powercord-pradio) - Stream radio in Discord
  - [PSpectrum](https://github.com/parzival-space/powercord-pspectrum) - Audio visualizer for Discord
  - [VR Audio Switch](https://github.com/parzival-space/powercord-vraudioswitch) - Automatically switch Input and Output to VR
