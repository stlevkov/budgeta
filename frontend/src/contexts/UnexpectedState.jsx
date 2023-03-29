import { getUnexpected } from "../api/RestClient";

export default class UnexpectedState {
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
   * @param newState unexpected array
   */
  setState(newState) {
    console.log("[UnexpectedState] Setting the state to new state...", newState);
    this.sumUnexpected = newState.map((newState) => parseInt(newState.value, 10)).reduce((a, b) => a + b);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  getState() {
    return this.state;
  }

  getSumUnexpected() {
    return this.sumUnexpected;
  }

  addListener(listener) {
    this.listeners.push(listener); // Add a listener to be notified when the state changes
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener); // Remove a listener
  }
}
