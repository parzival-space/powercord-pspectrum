const { spawn } = require('child_process');
const { join } = require('path');

module.exports = class PSpectrum {
  constructor() {
    // sets the bass responsiveness multiplier (default: 1)
    this._bassResponsiveness = 1;

    this._handlers = [{type: "default", action: () => {}}];
  }

  spawn() {
    // prepare child process
    this.child = spawn(join(__dirname, '..', 'bin', 'PSpectrum.exe'), [], { cwd: join(__dirname, '..', 'bin') });

    // normalization buffer (used to store the previous array)
    this._normalize_buffer;
    this.hasCurrentBass = false;

    // start system sound handling
    this.child.stdout.on("data", data => {
      // transform data into something useful
      try { data = JSON.parse(data); }
      catch (e) { return; }

      // normalize data
      data = this._normalize(data);

      // check for bass signal
      if (this._hasBass(data)) {
        this.hasCurrentBass = true;
        this._handlers.filter(h => h.type == "bass").forEach(h => h.action());
      } else {
        this.hasCurrentBass = false;
      }

      // trigger data events
      this._handlers.filter(h => h.type == "data").forEach(h => h.action(data));

      // update normalization buffer
      this._normalize_buffer = data;
    })
  }

  kill() {
    return this.child.kill();
  }
  /**
   * Normalizes the provided system sound input.
   * @param {Number[]} data 
   * @returns {Number[]}
   */
  _normalize(data) {
    // check if the normalization buffer was initialized before
    if (this._normalize_buffer == undefined) this._normalize_buffer = data;

    // modify values to fit in a fixed range
    data.forEach((d, i) => data[i] = (d > 1) ? 1 : d);
    data.forEach((d, i) => data[i] = (d < 0) ? 0 : d);

    // verify current data (filters audio hard resets => every channel sends 1 instead of 0)
    let fails = 0;
    data.forEach(d => (d > 0.4) ? fails += 1 : 0); // increase if every channel sends at least 0.4
    data.forEach((d, i) => (d >= this._normalize_buffer[i] * 7) ? fails += 1 : 0); // increase if the signal of a channel multiplys itself by 7 from the previous step
    if (fails > 200 && fails < data.length) data = this._normalize_buffer; 

    // simple normalization
    this._normalize_buffer.forEach((_, i) => data[i] = (data[i] + this._normalize_buffer[i]) / 2);

    return data;
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
      (
        (this._normalize_buffer[4] * (1.6 * this._bassResponsiveness) <= data[4] && 
        this._normalize_buffer[5] * (1.6 * this._bassResponsiveness) <= data[5]) && 
        (data[4] >= (0.0132 * this._bassResponsiveness) && data[5] >= (0.010 * this._bassResponsiveness) && data[6] >= (0.010 * this._bassResponsiveness))
      ) 
      
      &&

      // Low Bass
      (
        (this._normalize_buffer[1] * (1.6 * this._bassResponsiveness) <= data[1] && 
        this._normalize_buffer[2] * (1.6 * this._bassResponsiveness) <= data[2]) && 
        (data[1] >= (0.0132 * this._bassResponsiveness) && data[2] >= (0.010 * this._bassResponsiveness) && data[3] >= (0.010 * this._bassResponsiveness))
      )
    );
  }

  /**
   * Registers a function wich gets triggered if the Bass got triggered.
   * @param {Function} cb 
   */
  onBass(cb) { this._handlers.push({type: "bass", action: cb}); }

  /**
   * Registers a function wich gets triggered if new data arrives.
   * @param {Function} cb 
   */
  onData(cb) { this._handlers.push({type: "data", action: cb}); }

  // TODO: add more handlers
}
