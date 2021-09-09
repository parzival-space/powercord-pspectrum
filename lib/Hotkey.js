/* -------------------------------------------------------------------------- */
/*                           PRIVATE STUFF (TYPINGS)                          */
/* -------------------------------------------------------------------------- */

/**
 * Represents the possible types of hotkey events.
 * @ignore For typedoc
 */
const HotkeyEvent = "down" || "up" || "press" || "keydown" || "keyup" || "keypress";

/**
   * An example callback function.
   * @param {KeyboardEvent} key The keyboard event.
   * @param {Hotkey} hotkey The hotkey that has been triggered.
   * @ignore For typedoc
   */
const HotkeyCallback = (key, hotkey) => {};

/**
 * The format of an hotkey callback entry.
 * @ignore For typedoc
 */
const HotkeyEntry = { callback: HotkeyCallback, once: false, id: 0, event: HotkeyEvent };


/* -------------------------------------------------------------------------- */
/*                                 MAIN CLASS                                 */
/* -------------------------------------------------------------------------- */


/**
 * Creates new hotkey entries.
 */
class Hotkey {
  // stored variables
  #key = "";
  #ctrl = false;
  #shift = false;
  #alt = false;

  // stored callbacks
  #callbacks = [];

  // validation function
  #validate = (e) => {
    if (e.key.toUpperCase() != this.#key.toUpperCase()) return false;
    if (e.ctrlKey != this.#ctrl) return false;
    if (e.shiftKey != this.#shift) return false;
    if (e.altKey != this.#alt) return false;
    return true;
  }

  /**
   * handle events
   * @param {HotkeyEvent} event Represents the possible types of hotkey events.
   * @param {KeyboardEvent} args Keyboard Event Args
   */
  #handle = (event, args) => {
    if (!this.#validate(args)) return;

    // call all callbacks
    for (let i = 0; i < this.#callbacks.length; i++) {
      let entry = this.#callbacks[i];

      // check if the event is the same
      if (event.replace("key", "") != entry.event.replace("key", "")) continue;

      // call the callback
      entry.callback(args, this);

      // remove the callback if it is set to once
      if (entry.once) this.#callbacks.splice(i, 1);
    }
  }

  /**
   * A Hotkey to listen for.
   * @param {string} key The key to listen for.
   * @param {bool} ctrl Requires ctrl to be pressed.
   * @param {bool} shift Requires the shift key to be pressed.
   * @param {bool} alt Requires the alt key to be pressed.
   */
  constructor(key, ctrl = false, shift = false, alt = false) {
    // store values
    this.#key = key;
    this.#ctrl = ctrl;
    this.#shift = shift;
    this.#alt = alt;

    // register event listeners
    document.addEventListener("keydown", e => this.#handle("keydown", e));
    document.addEventListener("keyup", e => this.#handle("keyup", e));
    document.addEventListener("keypress", e => this.#handle("keypress", e));
  }

  /**
   * adds a callback to the hotkey
   * @param {HotkeyEvent} event 
   * @param {HotkeyCallback} callback 
   * @returns {number} The id of the callback.
   */
  on(event, callback) {
    // get highest id
    let id = 0;
    for (let i = 0; i < this.#callbacks.length; i++) {
      if (this.#callbacks[i].id > id) id = this.#callbacks[i].id;
    }

    // create new callback entry
    let entry = { 
      callback, 
      event,
      once: false, 
      id: id + 1
    };

    // add callback to list
    this.#callbacks.push(entry);

    // return id
    return entry.id;
  }

  /**
   * adds a callback to the hotkey, that will only be called once
   * @param {HotkeyEvent} event
   * @param {HotkeyCallback} callback
   * @returns {number} The id of the callback.
   */
  once(event, callback) {
    // get highest id
    let id = 0;
    for (let i = 0; i < this.#callbacks.length; i++) {
      if (this.#callbacks[i].id > id) id = this.#callbacks[i].id;
    }

    // create new callback entry
    let entry = { 
      callback, 
      event,
      once: true, 
      id: id + 1
    };

    // add callback to list
    this.#callbacks.push(entry);

    // return id
    return entry.id;
  }

  /**
   * removes a callback from the hotkey
   * @param {number} id The id of the callback.
   * @returns {boolean} Whether the callback was removed.
   */
  off(id) {
    // find the callback
    for (let i = 0; i < this.#callbacks.length; i++) {
      if (this.#callbacks[i].id == id) {
        this.#callbacks.splice(i, 1);
        return true;
      }
    }

    // callback not found
    return false;
  }

  /**
   * removes all callbacks from the hotkey
   * @returns {boolean} Whether the callbacks were removed.
   */
  offAll() {
    this.#callbacks = [];
    return true;
  }

  /**
   * returns the hotkey entry of an event
   * @param {number} id The id of the callback.
   * @returns {HotkeyEntry} The hotkey entry.
   */
  get(id) {
    // find the callback
    for (let i = 0; i < this.#callbacks.length; i++) {
      if (this.#callbacks[i].id == id) return this.#callbacks[i];
    }

    // callback not found
    return null;
  }

  /**
   * returns all hotkey entries
   * @returns {HotkeyEntry[]} The hotkey entries.
   */
  getAll() {
    return this.#callbacks;
  }

  /**
   * sets the hotkey entry of an event
   * @param {number} id The id of the callback.
   * @param {HotkeyEntry} entry The hotkey entry.
   * @returns {boolean} Whether the hotkey entry was set.
   */
  set(id, entry) {
    // first, get the callback
    let callback = this.get(id);
    if (callback == null) return false;

    // then remove it from the list
    if (!this.off(id)) return false;

    // update values with the provided ones
    callback = { ...callback, ...entry };

    // add the callback to the list again
    this.#callbacks.push(callback);

    // return success
    return true;
  }
}

// export
module.exports = Hotkey;