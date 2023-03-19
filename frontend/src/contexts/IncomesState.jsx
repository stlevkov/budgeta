import { getIncomes } from "../api/RestClient";

export default class IncomesState {
  constructor() {
    this.state = [];
    this.listeners = [];

    getIncomes().then((data) => {
      this.setState(data);
    });
  }

  setState(newState) {
    console.log("[IncomesState] Setting the state to new state...", newState);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  getState() {
    return this.state;
  }

  addListener(listener) {
    this.listeners.push(listener); // Add a listener to be notified when the state changes
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener); // Remove a listener
  }
}