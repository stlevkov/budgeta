import RestClient from "../api/RestClient";
import config from "../resources/config.json";

export default class CostAnalyticState {
  constructor() {
    this.state = {};
    this.listeners = [];
    this.restClient = new RestClient(config.api.costAnalyticEndpoint);

    this.restClient.genericFetch().then((data) => {
      this.setState(data);
    });
  }

  /**
   * Save the state to DB. This will make a Rest Call to the backend.
   */
  saveState() {
    console.log(`[CostAnalyticState] Saving the state to backend: ${this.state}`);
    this.restClient.genericEdit(this.state);
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