const { getModule } = require("powercord/webpack");

module.exports = class Render {
  constructor(plugin) {
    // if we detect two elements, the spotify plugin has to be enabled
    let possibleElements = document.querySelectorAll(`div.container-3baos1`);
    let isSpotifyEnabled = () => possibleElements.length >= 2;

    this.plugin = plugin;
    this._parent = isSpotifyEnabled()
      ? possibleElements[1]
      : possibleElements[0];

    // create canvas
    this._canvas = document.createElement("canvas");
    this._ctx = this._canvas.getContext("2d");
    this._lastFrame = [];

    // prepare canvas
    this._canvas.setAttribute("id", "pspectrum-visualizer");
    this._canvas.setAttribute(
      "style",
      `position:absolute; left: 0; bottom: 0; width: ${this._parent.clientWidth}px; height: ${this._parent.clientHeight};`
    );
    this._canvas.width = this._parent.clientWidth;
    this._canvas.height = this._parent.clientHeight;

    // expand if spotify plugin is enabled
    if (isSpotifyEnabled())
      this._canvas.height += possibleElements[0].clientHeight;

    // inject canvas
    this._parent.insertBefore(this._canvas, this._parent.firstChild);

    // parent check
    this._pcheck = setInterval(() => {
      let valid = true;
      this._parent.childNodes.forEach((c) =>
        c.id === this._canvas.id ? (valid = false) : true
      );

      if (!valid) this.reinject();
    }, 1000);

    // verify check interval
    this._vcheck = setInterval(() => {
      if (!this.verifyInjection(this._last)) {
        //console.log(`%c[PSpectrum/Error]`, `color: red;`, `verify check failed => reinjecting...`);
        this.reinject();
      }
    }, 1000);

    // settings updater
    this.mult = 4;
    this.color = "";
    this._mupdate = setInterval(() => {
      // calculate multiplyer
      if (this._lastResponsiveness == undefined)
        this._lastResponsiveness =
          plugin?.settings?.get("visualizerResponsiveness", 4) ?? 4;
      let current =
        plugin?.settings?.get("visualizerResponsiveness", 4) ??
        this._lastResponsiveness;
      this._lastResponsiveness = current;

      // if manual theming is enabled, select color based on settings
      if (plugin?.settings?.get("manualTheming", false) ?? false)
        this.color = this.getManualColor();
      else this.color = this.getThemeColor();

      // report
      this.report = plugin?.settings?.get("visualizerReport", false) ?? false;

      this.mult = current;
    }, 100);

    (async () => {
      // get required Modules
      const { getState } = await getModule(["getStatus"]);
      const { getCurrentUser } = await getModule(["getCurrentUser"]);

      // create function to fetch current users status
      // only this value are possible: online, idle, dnd, invisible
      this.getCurrentStatus = () =>
        getState().statuses[getCurrentUser().id] ?? "online";
    })();
  }

  /**
   * Destroys the canvas and clears the intervals.
   */
  destroy() {
    this._canvas.remove();
    clearInterval(this._pcheck);
    clearInterval(this._vcheck);
    clearInterval(this._mupdate);
  }

  /**
   * Re-Injects the canvas into the DOM.
   * This is required if the visualizer got stuck to the same frame or if something else happened.
   */
  reinject() {
    this._parent.removeChild(this._canvas);

    // if we detect two elements, the spotify plugin has to be enabled
    let possibleElements = document.querySelectorAll(`div.container-3baos1`);
    let isSpotifyEnabled = () => possibleElements.length >= 2;

    this._parent = isSpotifyEnabled()
      ? possibleElements[1]
      : possibleElements[0];
    // inject canvas
    this._parent.insertBefore(this._canvas, this._parent.firstChild);
  }

  /**
   * Draws the data to the canvas.
   * @param {Array} data - The data to draw.
   */
  drawNewFrame(data = []) {
    if (this.report) console.log(data);

    // normalize and split channels
    let [left, right] = this.prepareData(data);

    // update sizes
    if (
      (this._parent?.clientWidth !== this._canvas?.width ||
        this._parent?.clientHeight !== this._canvas?.height) &&
      this._parent != undefined &&
      this._canvas != undefined
    )
      this.updateSizes();

    // recalc sizes
    let height = this._canvas.height;
    let half = this._canvas.width / 2;
    let multiplyer = this.mult * 100;

    this._ctx.fillStyle = this.color;

    // draw left channel
    left.reverse();
    left.forEach((d, i) =>
      this._ctx.fillRect(1 * (i - 1), height, 1, -(d * multiplyer))
    );

    // draw right channel
    right.forEach((d, i) =>
      this._ctx.fillRect(1 * (i + half), height, 1, -(d * multiplyer))
    );
  }

  /**
   * Prepares the data to be drawn.
   * This includes normalizing the data and splitting it into left and right channel.
   */
  prepareData(data) {
    let left = [],
      right = [],
      half = data.length / 2;

    // clear last frame
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // prevent overdraw
    data.forEach((d, i) => (d > 1 ? (data[i] = 1) : (data[i] = d)));
    data.forEach((d, i) => (d < 0 ? (data[i] = 0) : (data[i] = d)));

    // normalize
    if (this._last == undefined) this._last = [];
    this._last.forEach((d, i) => (data[i] = (data[i] + d) / 2));

    // calculate left and right channel range
    data.forEach((d, i) => (i <= half ? left.push(d) : false));
    data.forEach((d, i) => (i >= half ? right.push(d) : false));

    // save current data (normalisation)
    this._last = data;

    return [left, right];
  }

  /**
   * Verifys that the canvas and the data provieded are valid.
   * Also trys to prevent the visualizer from getting stuck to the same frame.
   */
  verifyInjection(data) {
    // return if data is empty
    if (data == undefined) return false;
    if (data.map((d) => d === 0).length === data.length) return false;

    // get current frame
    var frame = this._ctx.getImageData(
      0,
      0,
      this._canvas.width,
      this._canvas.height
    );

    // ckeck if the last frame data equal the current data
    if (
      this._lastFrame.length > 0 &&
      (this._lastFrame.every((d) => d === 0) ||
        this._lastFrame.every((d, i) => d === frame[i]))
    )
      return false;

    // update last frame
    this._lastFrame = frame;

    // at this point the verification succeded
    return true;
  }

  /**
   * Updates the canvas size to the parent element.
   */
  updateSizes() {
    this._canvas.setAttribute(
      "style",
      `position:absolute; left: 0; bottom: 0; width: ${this._parent.clientWidth}px; height: ${this._parent.clientHeight}px; z-index: -1;`
    );
    this._canvas.width = this._parent.clientWidth;
    this._canvas.height = this._parent.clientHeight;
  }

  /**
   * gets the matching color based on the current users state.
   */
  getManualColor() {
    let fallback = "1ed860";

    // get users status
    let status = this.getCurrentStatus();

    // switch thru posible status
    switch (status) {
      case "online":
        return (
          "#" +
          (this.plugin?.settings?.get("color-online", "1ed860") ?? fallback)
        );

      case "idle":
        return (
          "#" + (this.plugin?.settings?.get("color-idle", "d8d51e") ?? fallback)
        );

      case "dnd":
        return (
          "#" + (this.plugin?.settings?.get("color-dnd", "d81e1e") ?? fallback)
        );

      case "invisible":
        return (
          "#" +
          (this.plugin?.settings?.get("color-invisible", "4f4f4f") ?? fallback)
        );

      default:
        return "#" + fallback;
    }
  }

  /**
   * Gets the matching color based in the theme css propertys.
   */
  getThemeColor() {
    let result = "";

    // get users status
    let status = this.getCurrentStatus();

    // switch thru posible status
    switch (status) {
      case "online":
        result = getComputedStyle(
          document.querySelector("#pspectrum-visualizer")
        ).getPropertyValue("--pspectrum-online-color");
        break;

      case "idle":
        result = getComputedStyle(
          document.querySelector("#pspectrum-visualizer")
        ).getPropertyValue("--pspectrum-idle-color");
        break;

      case "dnd":
        result = getComputedStyle(
          document.querySelector("#pspectrum-visualizer")
        ).getPropertyValue("--pspectrum-dnd-color");
        break;

      case "invisible":
        result = getComputedStyle(
          document.querySelector("#pspectrum-visualizer")
        ).getPropertyValue("--pspectrum-invisible-color");
        break;

      default:
        break;
    }

    // fallback to old css variable (backwards compatibility)
    if (result == "") {
      result = getComputedStyle(
        document.querySelector("#pspectrum-visualizer")
      ).getPropertyValue("--pspectrum-color");
      result =
        result != ""
          ? result
          : getComputedStyle(this._canvas).getPropertyValue("--spotify-color");
    }

    // fallback to variable
    if (result == "") result = "#1ed860";

    return result;
  }
};