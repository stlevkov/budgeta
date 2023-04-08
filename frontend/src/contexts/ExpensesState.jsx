import RestClient from "../api/RestClient";
import config from "../resources/config.json";

/** Represents an Expenses State */
export default class ExpensesState {
  /**
   * @constructor
   * @param {Array} state - The state of the expenses
   * @param {Array} listeners - The listeners stack used to hold listeners
   * @param sumExpenses - the sum of all expenses in the state
   */
  constructor() {
    this.state = [];
    this.listeners = [];
    this.sumExpenses = undefined; // TODO make them private with #
    this.restClient = new RestClient(config.api.expensesEndpoint);

    this.restClient.genericFetch().then((data) => {
      this.setState(data);
    });
  }

  /**
   * Set the new state. Also calculates the sumExpenses. Use getSumExpenses to get the calculated sum.
   *
   * @param newState new expenses array
   */
  setState(newState) {
    console.log("[ExpensesState] Setting the state to new state...", newState);
    this.sumExpenses = newState.map((newState) => parseInt(newState.value, 10)).reduce((a, b) => a + b);
    this.state = [...newState];
    this.listeners.forEach((listener) => listener(this.state)); // Notify all listeners that the state has changed
  }

  /**
   * Get the current state of the expenses.
   *
   * @returns {Array} The current state of the object.
   */
  getState() {
    return this.state;
  }

  /**
   * Get the sum of expenses stored in the state.
   *
   * @returns {number} The sum of expenses in the state.
   */
  getSumExpenses() {
    return this.sumExpenses;
  }

  /**
   * Updating the state on value change event
   *
   * @param expense single expense
   */
  updateExpense(expense) {
    this.state.map((item) => {
      return item.id === expense.id ? expense : item;
    });
    this.setState(this.state);
  }

  /**
   * Add new value to the state
   *
   * @param expense single expense
   */
  addExpense(expense) {
    this.setState([...this.state, expense]);
  }

  /**
   * Removing value from the state
   *
   * @param expense single expense
   */
  removeExpense(expense) {
    var index = this.state.indexOf(expense);
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
