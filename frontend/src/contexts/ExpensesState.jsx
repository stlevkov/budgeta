import { getExpenses } from "../api/RestClient";

export default class ExpensesState {
  constructor() {
    this.state = [];
    this.listeners = [];

    getExpenses().then((data) => {
      this.setState(data);
    });
  }

  setState(newState) {
    console.log("[ExpensesState] Setting the state to new state...", newState);
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