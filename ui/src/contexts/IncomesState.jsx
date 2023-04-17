import RestClient from "../api/RestClient";
import config from  '../resources/config';
import StateFactory from "./StateFactory";

export default class IncomesState {
  /**
   * @constructor
   * @param {StateFactory} stateFactory - To access another states if need
   * @param {Array} state - The state of the incomes
   * @param {Array} listeners - The listeners stack used to hold listeners
   * @param sumIncomes - the sum of all incomes in the state
   */
  constructor(stateFactory) {
    this.state = [];
    this.listeners = [];
    this.saveListeners = [];
    this.sumIncomes = undefined; // TODO make them private with #
    this.restClient = new RestClient(config.api.incomesEndpoint);

    this.restClient.genericFetch().then((data) => {
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
  * Updating the state on value change event. This function will not save the value to DB.
  * After the dynamic change complete, or upon ENTER, please invoke {@link updateIncome}
  *
  * @param income dto
  */
  onChangeIncome(income) {
    console.log('Income candidate: ', income)
    this.state.map((item) => {
      return item.id === income.id ? income : item;
    });
    this.setState(this.state);
  }

  /**
   * This function will make Rest call to save the value to DB.
   * Also will update the state if the operation succeed.
   * Also will notify save listeners.
   *
   * @param income single income
   */
  updateIncome(income) {
    this.restClient.genericEdit(income, () => {
      this.state.map((item) => {
        return item.id === income.id ? income : item;
      });
      this.setState(this.state);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    });

  }

  /**
   * This function will save the value to DB.
   * Will update the state if operation succeed.
   * Also will call save listeners.
   *
   * @param income single income
   */
  addIncome(income) {
    this.restClient.genericCreate(income, () => {
      this.setState([...this.state, income]);
      this.saveListeners.forEach((saveListener) => saveListener(this.state));
    })
  }

  /**
   * This function will remove the value from DB. Removing value from the state if operation succeed.
   * Also notify the save listeners.
   * 
   * @param income single income
   */
  removeIncome(income) {
    this.restClient.genericDelete(income, () => {
      var index = this.state.indexOf(income);
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
