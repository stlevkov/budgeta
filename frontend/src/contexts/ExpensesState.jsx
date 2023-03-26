import { getExpenses } from "../api/RestClient";

export default class ExpensesState {
  constructor() {
    this.state = [];
    this.listeners = [];
    this.sumExpenses = undefined;  // TODO make them private with #

    getExpenses().then((data) => {
      this.setState(data);
    });
  }

  /**
   * Set the new state. Also calculates the sumExpenses. Use getSumExpenses to get the calculated sum.
   * @param newState expenses array
   */
  setState(newState) {
    console.log("[ExpensesState] Setting the state to new state...", newState);
    this.sumExpenses = newState.map(newState => newState.value).reduce((a, b) => a + b);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  getState() {
    return this.state;
  }

  getSumExpenses(){
    return this.sumExpenses;
  }

  addListener(listener) {
    this.listeners.push(listener); // Add a listener to be notified when the state changes
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener); // Remove a listener
  }
}