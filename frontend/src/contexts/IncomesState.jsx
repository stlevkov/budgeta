import { getIncomes } from "../api/RestClient";

export default class IncomesState {
  /**
   * @constructor
   * @param {Array} state - The state of the incomes
   * @param {Array} listeners - The listeners stack used to hold listeners
   * @param sumIncomes - the sum of all incomes in the state
   */
  constructor() {
    this.state = [];
    this.listeners = [];
    this.sumIncomes = undefined; // TODO make them private with #

    getIncomes().then((data) => {
      this.setState(data);
    });
  }

  /**
   * Set the new state. Also calculates the sumIncomes. Use getSumIncomes to get the calculated sum.
   *
   * @param newState new incomes array
   */
  setState(newState) {
    console.log("[IncomesState] Setting the state to new state...", newState);
    this.sumIncomes = newState.map((newState) => parseInt(newState.value, 10)).reduce((a, b) => a + b);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  /**
   * Get the current state of the incomes.
   *
   * @returns {Array} The current state of the object.
   */
  getState() {
    return this.state;
  }

  /**
   * Get the sum of incomes stored in the state.
   *
   * @returns {number} The sum of incomes in the state.
   */
  getSumIncomes() {
    return this.sumIncomes;
  }

  /**
   * Updating the state on value change event
   *
   * @param income single income
   */
  updateIncome(income) {
    this.state.map((item) => {
      return item.id === income.id ? income : item;
    });
    this.setState(this.state);
  }

  /**
   * Add new value to the state
   *
   * @param income single income
   */
  addIncome(income) {
    this.setState([...this.state, income]);
  }

  /**
   * Removing value from the state
   *
   * @param income single income
   */
  removeIncome(income) {
    var index = this.state.indexOf(income);
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
   * @function
   * @param listener the listener to be removed
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}
