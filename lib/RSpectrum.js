const { spawn } = require("child_process");
const { join } = require("path");
const fs = require("fs");

module.exports = class RSpectrum {
  constructor() {
    // sets the bass responsiveness multiplier (default: 1)
    this._bassResponsiveness = 1;

    this._handlers = [{ type: "default", action: () => {} }];

    // creates a temp directory
    this._tempDir = join(__dirname, "..", "temp");
    if (!fs.existsSync(this._tempDir)) fs.mkdirSync(this._tempDir);

    // delete everything in the temp directory
    fs.readdirSync(this._tempDir).forEach((file) =>{
      try { fs.unlinkSync(join(this._tempDir, file)) }catch (e) {}
    });

    // copy binary to temp directory
    let source = join(__dirname, "..", "bin", "PSpectrum.exe");
    let dest = join(this._tempDir, "PSpectrum.exe");
    if (fs.existsSync(dest)) try { fs.unlinkSync(dest); } catch (e) {}
    if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
  }

  spawn(bufferSize = 512) {
    console.log("[RSpectrum] Buffer size: " + bufferSize);

    // prepare child process
    this.child = spawn(join(this._tempDir, "PSpectrum.exe"), ['listen', '-b', bufferSize], {
      cwd: this._tempDir,
    });

    this._normalize_buffer = new Array(bufferSize).fill(0);
    this.hasCurrentBass = false;

    // start system sound handling
    this.child.stdout.on("data", (data) => {
      // transform data into something useful
      try {
        data = JSON.parse(data);
      } catch (e) {
        return;
      }

      // check for bass signal
      if (bufferSize > 10) {
        if (this._hasBass(data)) {
        this.hasCurrentBass = true;
        this._handlers
          .filter((h) => h.type == "bass")
          .forEach((h) => h.action());
        } else {
          this.hasCurrentBass = false;
        }
      }

      // trigger data events
      this._handlers
        .filter((h) => h.type == "data")
        .forEach((h) => h.action(data));

      // update normalization buffer
      this._normalize_buffer = data;
    });
  }

  kill() {
    return this.child?.kill();
  }

  /**
   * Changes the responsiveness of the onBass event. Lower values increase the responsiveness.
   */
  setResponsiveness(value) {
    this._bassResponsiveness = value;
  }

  /**
   * Checks if the provided data has a Bass signal in it.
   * @param {Number[]} data
   * @returns
   */
  _hasBass(data) {
    return (
      // High Bass
      //((this._normalize_buffer[5] * 1.6 <= data[5] && this._normalize_buffer[6] * 1.6 <= data[6]) && (data[5] >= 0.010 && data[6] >= 0.010 && data[7] >= 0.010))

      //&&

      // Mid Bass
      this._normalize_buffer[4] * (1.6 * this._bassResponsiveness) <= data[4] &&
      this._normalize_buffer[5] * (1.6 * this._bassResponsiveness) <= data[5] &&
      data[4] >= 0.0132 * this._bassResponsiveness &&
      data[5] >= 0.01 * this._bassResponsiveness &&
      data[6] >= 0.01 * this._bassResponsiveness &&
      // Low Bass
      this._normalize_buffer[1] * (1.6 * this._bassResponsiveness) <= data[1] &&
      this._normalize_buffer[2] * (1.6 * this._bassResponsiveness) <= data[2] &&
      data[1] >= 0.0132 * this._bassResponsiveness &&
      data[2] >= 0.01 * this._bassResponsiveness &&
      data[3] >= 0.01 * this._bassResponsiveness
    );
  }

  /**
   * Registers a function wich gets triggered if the Bass got triggered.
   * @param {Function} cb
   */
  onBass(cb) {
    this._handlers.push({ type: "bass", action: cb });
  }

  /**
   * Registers a function wich gets triggered if new data arrives.
   * @param {Function} cb
   */
  onData(cb) {
    this._handlers.push({ type: "data", action: cb });
  }

  // TODO: add more handlers
};