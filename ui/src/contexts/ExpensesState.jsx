import RestClient from "../api/RestClient";
import config from  '../resources/config';
import StateFactory from "./StateFactory";

/** Represents an Expenses State */
export default class ExpensesState {
  /**
   * @constructor
   * @param {StateFactory} stateFactory - To access another states if need
   * @param {Array} state - The state of the expenses
   * @param {Array} listeners - The listeners stack used to hold listeners
   * @param sumExpenses - the sum of all expenses in the state
   */
  constructor(stateFactory) {
    this.state = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumExpenses = undefined; // TODO move this to CostAnalyticState and just calculate with listener
    this.restClient = new RestClient(config.api.expensesEndpoint);

    this.restClient.genericFetch().then((data) => {
      this.setState(data);
    });
  }

  /**
   * Set the new state. Also calculates the sumExpenses. Use getSumExpenses to get the calculated sum.
   * TODO - sumExpenses is property of CostAnalyticState, move it there
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
   * Updating the state on value change event. This function will not save the value to DB.
   * After the dynamic change complete, or upon ENTER, please invoke {@link updateExpense}
   *
   * @param expense dto
   */
  onChange(expense) {
    console.log('Expense candidate: ', expense)
    this.state.map((item) => {
      return item.id === expense.id ? expense : item;
    });
    this.setState(this.state);
  }

  /**
   * Stores the value to the DB and Update the expense state if succeed.
   * Also notifies the save listeners.
   * 
   * @param expense dto
   */
  updateExpense(expense) {
    this.restClient.genericEdit(expense, () => {
      this.state.map((item) => {
        return item.id === expense.id ? expense : item;
      });
      this.setState(this.state);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    });
  }

  /**
   * Add new value to the state.
   *
   * @param expense single expense
   */
  addExpense(expense) {
    this.restClient.genericCreate(expense, () => {
      this.setState([...this.state, expense]);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    });
  }

  /**
   * Removing value from the state.
   *
   * @param expense single expense
   */
  removeExpense(expense) {
    this.restClient.genericDelete(expense, () => {
      var index = this.state.indexOf(expense);
      if (index !== -1) {
        this.state.splice(index, 1);
      }
      this.setState(this.state);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    });
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

  addSaveListener(saveListener) {
    this.saveListeners.push(saveListener);
  }

  removeSaveListener(saveListener) {
    this.saveListeners = this.saveListeners.filter((l) => l !== saveListener);
  }
}
