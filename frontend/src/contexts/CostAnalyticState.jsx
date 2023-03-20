import { getCostAnalytic } from "../api/RestClient";

export default class CostAnalyticState {
  constructor() {
    this.state = {};
    this.listeners = [];

    getCostAnalytic().then((data) => {
      this.setState(data);
    });
  }

  setState(newState) {
    console.log("[CostAnalyticState] Setting the state to new state...", newState);
    this.state = structuredClone(newState);
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  getState() {
    return this.state;
  }

  addListener(listener) {
    console.log("Added listener to our state class");
    this.listeners.push(listener); // Add a listener to be notified when the state changes
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener); // Remove a listener
  }
}