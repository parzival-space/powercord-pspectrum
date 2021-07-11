module.exports = class Render {
  constructor() {
    // if we detect two elements, the spotify plugin has to be enabled
    let possibleElements = document.querySelectorAll(`div.container-3baos1`);
    let isSpotifyEnabled = () => possibleElements.length >= 2;

    this._parent = isSpotifyEnabled() ? possibleElements[1] : possibleElements[0];

    // create canvas
    this._canvas = document.createElement("canvas");
    this._ctx = this._canvas.getContext("2d");

    // prepare canvas
    this._canvas.setAttribute("id", "pspectrum-visualizer");
    this._canvas.setAttribute("style", `position:absolute; left: 0; bottom: 0; width: ${this._parent.clientWidth}px; height: ${this._parent.clientHeight}; z-index: -1;`);
    this._canvas.width = this._parent.clientWidth;
    this._canvas.height = this._parent.clientHeight;

    // expand if spotify plugin is enabled
    if (isSpotifyEnabled()) this._canvas.height += possibleElements[0].clientHeight;

    // inject canvas
    this._parent.insertBefore(this._canvas, this._parent.firstChild);

    // parent check
    this._pcheck = setInterval(() => {
      let valid = true;
      this._parent.childNodes.forEach(c => (c.id === this._canvas.id) ? valid = false : true);

      if (!valid) this.reinject();
    }, 1000);
  }

  destroy() {
    this._canvas.remove();
    clearInterval(this._pcheck);
  }

  reinject() {
    this._parent.removeChild(this._canvas);

    // if we detect two elements, the spotify plugin has to be enabled
    let possibleElements = document.querySelectorAll(`div.container-3baos1`);
    let isSpotifyEnabled = () => possibleElements.length >= 2;

    this._parent = isSpotifyEnabled() ? possibleElements[1] : possibleElements[0];
    // inject canvas
    this._parent.insertBefore(this._canvas, this._parent.firstChild);
  }

  drawNewFrame(data = []) {
    // normalize and split channels
    let [left, right] = this.prepareData(data);

    // update sizes
    if (this._parent.clientWidth !== this._canvas.width || this._parent.clientHeight !== this._canvas.height) this.updateSizes();

    // recalc sizes
    let height = this._canvas.height;
    let half = this._canvas.width / 2;
    let multiplyer = 200;

    // get spotify color
    let color = getComputedStyle(document.querySelector('#pspectrum-visualizer')).getPropertyValue("--pspectrum-color");
    color = color != "" ? color : getComputedStyle(this._canvas).getPropertyValue("--spotify-color");
    color = color != "" ? color : "#1ed860";
    this._ctx.fillStyle = color;

    // draw left channel
    left.reverse();
    left.forEach((d, i) => this._ctx.fillRect(1 * i, height, 1, -(d * multiplyer)));

    // draw right channel
    right.forEach((d, i) => this._ctx.fillRect(1 * (i + half), height, 1, -(d * multiplyer)));
  }

  prepareData(data) {
    let left = [], right = [], half = data.length / 2;

    // clear last frame
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

    // prevent overdraw
    data.forEach((d, i) => d > 1 ? data[i] = 1 : data[i] = d);
    data.forEach((d, i) => d < 0 ? data[i] = 0 : data[i] = d);

    // normalize
    if (this._last == undefined) this._last = [];
    this._last.forEach((d, i) => data[i] = (data[i] + d) / 2);

    // calculate left and right channel range
    data.forEach((d, i) => (i < half) ? left.push(d) : false);
    data.forEach((d, i) => (i >= half) ? right.push(d) : false);

    // save current data (normalisation)
    this._last = data;

    return [left, right]
  }

  updateSizes() {
    this._canvas.setAttribute("style", `position:absolute; left: 0; bottom: 0; width: ${this._parent.clientWidth}px; height: ${this._parent.clientHeight}px; z-index: -1;`);
    this._canvas.width = this._parent.clientWidth;
    this._canvas.height = this._parent.clientHeight;
  }
}
