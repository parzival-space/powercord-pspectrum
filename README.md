# PSpectrum Audio Visualizer
> Adds an audio visualizer behind the user modal. 

![Version][version-image]
![Size][size-image]
![License][license-image]

Adds an audio visualizer behind the user modal. <br>
This Plugin ships an executeable with it (PSpectrum.exe), which means **this plugin only works for Windows**.<br>
You can find the source for the executeable here: <a href="https://github.com/malte-linke/PSpectrum">malte-linke/PSpectrum</a>

The builds of PSpectrum get automatically pushed to this Repository using GitHub Actions.

![][demo-image]

## Installation

1. Open your powercord plugins directory and run `git clone https://github.com/malte-linke/powercord-pspectrum.git`.
2. Restart discord to fetch missing plugins.

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

## Release History

* 2.1.2
    * I forgot the changes since 1.2.0...
* 1.2.0
    * Added custom color per user status
    * Splitted the `--pspectrum-color` into multiple sub-variables
* 1.1.0
    * Added custom color support (Added `--pspectrum-color` with fallback to `--spotify-color`)
* 1.0.0
    * First release

## Meta

Malte Linke – [Parzival#9999](https://discord.com/users/249877580180750336)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/malte-linke](https://github.com/malte-linke)

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[version-image]: https://img.shields.io/github/manifest-json/v/malte-linke/powercord-pspectrum?style=flat-square
[license-image]: https://img.shields.io/github/license/malte-linke/powercord-pspectrum?style=flat-square
[size-image]: https://img.shields.io/github/size/malte-linke/powercord-pspectrum/index.js?style=flat-square
[demo-image]: https://i.imgur.com/eiubeXY.gif


## Other Plugins

Check out my other plugins for [Powercord](https://powercord.dev/plugins/):

  - [BeatRPC](https://github.com/malte-linke/powercord-beatrpc) - A more detailed Beat Saber RPC
  - [PRadio](https://github.com/malte-linke/powercord-pradio) - Stream radio in Discord
  - [PSpectrum](https://github.com/malte-linke/powercord-pspectrum) - Audio visualizer for Discord
  - [VR Audio Switch](https://github.com/malte-linke/powercord-vraudioswitch) - Automatically switch Input and Output to VR
