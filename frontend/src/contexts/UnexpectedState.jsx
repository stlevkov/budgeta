import { getUnexpected } from "../api/RestClient";

/** Represents an Unexpected State */
export default class UnexpectedState {
  /**
   * @constructor
   * @param {Array} state - The state of the unexpected
   * @param {Array} listeners - The listeners stack used to hold listeners
   * @param sumUnexpected - the sum of all unexpected in the state
   */
  constructor() {
    this.state = [];
    this.listeners = [];
    this.sumUnexpected = undefined;

    getUnexpected().then((data) => {
      this.setState(data);
    });
  }

  /**
   * Set the new state. Also calculates the sumUnexpected. Use getSumUnexpected to get the calculated sum.
   *
   * @param newState new unexpected array
   */
  setState(newState) {
    console.log("[UnexpectedState] Setting the state to new state...", newState);
    this.sumUnexpected = newState.map((newState) => parseInt(newState.value, 10)).reduce((a, b) => a + b);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  /**
   * Get the current state of the unexpected.
   *
   * @returns {Array} The current state of the object.
   */
  getState() {
    return this.state;
  }

  /**
   * Get the sum of unexpected stored in the state.
   *
   * @returns {number} The sum of unexpected in the state.
   */
  getSumUnexpected() {
    return this.sumUnexpected;
  }

  /**
   * Updating the state on value change event
   *
   * @param unexpected single unexpected
   */
  updateUnexpected(unexpected) {
    this.state.map((item) => {
      return item.id === unexpected.id ? unexpected : item;
    });
    this.setState(this.state);
  }

  /**
   * Removing value from the state
   *
   * @param unexpected single unexpected
   */
  removeUnexpected(unexpected) {
    var index = this.state.indexOf(unexpected);
    if (index !== -1) {
      this.state.splice(index, 1);
    }
    this.setState(this.state);
  }

  /**
   * Adding new listener to be notified when state change
   *
   * @param listener the new listener
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Removing a listener from the listeners stack
   *
   * @param listener the listener to be removed
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}
